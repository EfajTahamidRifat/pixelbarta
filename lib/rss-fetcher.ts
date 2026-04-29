import Parser from 'rss-parser';
import { convert } from 'html-to-text';

// Native Dice coefficient similarity — replaces broken `string-similarity` package
function stringSimilarity(a: string, b: string): number {
  if (a === b) return 1;
  if (a.length < 2 || b.length < 2) return 0;
  const getBigrams = (str: string) => {
    const bigrams = new Map<string, number>();
    for (let i = 0; i < str.length - 1; i++) {
      const bigram = str.slice(i, i + 2);
      bigrams.set(bigram, (bigrams.get(bigram) || 0) + 1);
    }
    return bigrams;
  };
  const aBigrams = getBigrams(a);
  const bBigrams = getBigrams(b);
  let intersectionSize = 0;
  for (const [bigram, count] of aBigrams) {
    const bCount = bBigrams.get(bigram) || 0;
    intersectionSize += Math.min(count, bCount);
  }
  return (2 * intersectionSize) / (a.length + b.length - 2);
}

const FETCH_TIMEOUT_MS = 8000; // 8 second timeout per feed

const parser = new Parser({
  timeout: FETCH_TIMEOUT_MS,
  headers: {
    'User-Agent': 'Mozilla/5.0 (compatible; PixelBarta/1.0; +https://pixelbarta.vercel.app)',
    'Accept': 'application/rss+xml, application/xml, text/xml, */*',
  },
  customFields: {
    item: [
      ['media:content', 'mediaContent'],
      ['media:thumbnail', 'mediaThumbnail'],
      ['content:encoded', 'content'],
      ['description', 'summary'],
    ],
  },
});

export interface NewsArticle {
  id: string;
  title: string;
  description: string;
  image: string;
  link: string;
  pubDate: string;
  source: string;
  category: 'english' | 'bengali';
  badge?: string;
}

interface FeedSource {
  name: string;
  url: string;
  category: 'english' | 'bengali';
  logo: string;
  color: string;
}

const FEED_SOURCES: FeedSource[] = [
  // English Tech Sources
  {
    name: 'The Verge',
    url: 'https://www.theverge.com/rss/index.xml',
    category: 'english',
    logo: 'https://www.theverge.com/apple-touch-icon-iphone.png',
    color: '#FF6E1A',
  },
  {
    name: 'TechCrunch',
    url: 'https://techcrunch.com/feed/',
    category: 'english',
    logo: 'https://techcrunch.com/wp-content/uploads/2015/02/cropped-cropped-favicon-192x192.png',
    color: '#25282A',
  },
  {
    name: 'Wired',
    url: 'https://www.wired.com/feed/rss',
    category: 'english',
    logo: 'https://www.wired.com/favicon.ico',
    color: '#1ABDA4',
  },
  {
    name: '9to5Google',
    url: 'https://9to5google.com/feed/',
    category: 'english',
    logo: 'https://9to5google.com/apple-touch-icon.png',
    color: '#4285F4',
  },
  // Bengali Tech Sources
  {
    name: 'Bangla Tribune',
    url: 'https://www.banglatribune.com/feed/tech-and-gadget/',
    category: 'bengali',
    logo: 'https://www.banglatribune.com/favicon.ico',
    color: '#D32F2F',
  },
  {
    name: 'DigiBangla',
    url: 'https://digibanglatech.news/feed/',
    category: 'bengali',
    logo: 'https://digibanglatech.news/favicon.ico',
    color: '#2196F3',
  },
];

function generateBadge(title: string): string | undefined {
  const lowerTitle = title.toLowerCase();
  
  if (lowerTitle.includes('funding') || lowerTitle.includes('raises') || lowerTitle.includes('investment')) {
    return '💰 Investment';
  }
  if (lowerTitle.includes('ai') || lowerTitle.includes('artificial intelligence') || lowerTitle.includes('machine learning')) {
    return '🤖 AI';
  }
  if (lowerTitle.includes('security') || lowerTitle.includes('hack') || lowerTitle.includes('vulnerability')) {
    return '🔒 Security';
  }
  if (lowerTitle.includes('mobile') || lowerTitle.includes('smartphone') || lowerTitle.includes('iphone') || lowerTitle.includes('android')) {
    return '📱 Mobile';
  }
  if (lowerTitle.includes('launch') || lowerTitle.includes('new') || lowerTitle.includes('announcement')) {
    return '🚀 Launch';
  }
  
  return undefined;
}

function extractImageFromItem(item: any, source: FeedSource): string {
  // Try og:image from content
  if (item.mediaContent) {
    const media = Array.isArray(item.mediaContent) ? item.mediaContent[0] : item.mediaContent;
    if (media?.['$']?.url) return media['$'].url;
  }

  if (item.mediaThumbnail) {
    const thumb = Array.isArray(item.mediaThumbnail) ? item.mediaThumbnail[0] : item.mediaThumbnail;
    if (thumb?.['$']?.url) return thumb['$'].url;
  }

  // Try to extract from content HTML
  if (item.content) {
    const imgMatch = item.content.match(/<img[^>]+src="([^">]+)"/);
    if (imgMatch && imgMatch[1]) return imgMatch[1];
  }

  // Fallback to logo
  return source.logo;
}

function deduplicateArticles(articles: NewsArticle[]): NewsArticle[] {
  const seen: { [key: string]: boolean } = {};
  
  return articles.filter((article) => {
    const similarArticle = articles.find((other) => {
      if (other.id === article.id) return false;
      if (seen[other.id]) return false;
      
      const similarity = stringSimilarity(
        article.title.toLowerCase(),
        other.title.toLowerCase()
      );
      
      return similarity > 0.8;
    });

    if (!similarArticle) {
      seen[article.id] = true;
      return true;
    }
    
    return false;
  });
}

async function fetchSingleFeed(source: FeedSource): Promise<NewsArticle[]> {
  const feed = await parser.parseURL(source.url);
  const articles: NewsArticle[] = [];

  feed.items.slice(0, 20).forEach((item, index) => {
    if (!item.title) return;

    articles.push({
      id: `${source.name}-${index}-${item.pubDate}`,
      title: item.title,
      description: item.contentSnippet || item.summary || '',
      image: extractImageFromItem(item, source),
      link: item.link || '',
      pubDate: item.pubDate || new Date().toISOString(),
      source: source.name,
      category: source.category,
      badge: generateBadge(item.title),
    });
  });

  return articles;
}

export async function fetchAllFeeds(): Promise<NewsArticle[]> {
  // Fetch all feeds in parallel — prevents one slow/hanging feed from blocking others
  const results = await Promise.allSettled(
    FEED_SOURCES.map((source) => fetchSingleFeed(source))
  );

  const allArticles: NewsArticle[] = [];

  results.forEach((result, i) => {
    if (result.status === 'fulfilled') {
      allArticles.push(...result.value);
    } else {
      console.error(`[pixelbarta] Failed to fetch ${FEED_SOURCES[i].name}:`, result.reason);
    }
  });

  if (allArticles.length === 0) {
    throw new Error('All RSS feeds failed to load.');
  }

  // Deduplicate and sort by date
  const deduplicated = deduplicateArticles(allArticles);
  return deduplicated.sort(
    (a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()
  );
}

export function generateMeshGradient(color: string, index: number): string {
  // Generate a deterministic mesh gradient based on source color and index
  const colors = [color, adjustBrightness(color, 20), adjustBrightness(color, -20)];
  
  return `linear-gradient(135deg, ${colors[0]} 0%, ${colors[1]} 50%, ${colors[2]} 100%)`;
}

function adjustBrightness(color: string, amount: number): string {
  const hex = color.replace('#', '');
  const r = Math.max(0, Math.min(255, parseInt(hex.slice(0, 2), 16) + amount));
  const g = Math.max(0, Math.min(255, parseInt(hex.slice(2, 4), 16) + amount));
  const b = Math.max(0, Math.min(255, parseInt(hex.slice(4, 6), 16) + amount));
  
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}
