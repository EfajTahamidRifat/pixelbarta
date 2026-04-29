import { fetchAllFeeds, NewsArticle } from '@/lib/rss-fetcher';
import { NextResponse } from 'next/server';

// Cache the feed for 15 minutes
const CACHE_DURATION = 15 * 60 * 1000;
let cachedFeed: NewsArticle[] | null = null;
let cacheTime = 0;

export async function GET() {
  try {
    // Check if cache is still valid
    const now = Date.now();
    if (cachedFeed && now - cacheTime < CACHE_DURATION) {
      console.log('[v0] Returning cached feed');
      return NextResponse.json({ articles: cachedFeed, cached: true });
    }

    console.log('[v0] Fetching fresh feed...');
    const articles = await fetchAllFeeds();
    
    // Update cache
    cachedFeed = articles;
    cacheTime = now;

    return NextResponse.json({
      articles,
      cached: false,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[v0] Error fetching feed:', error);
    
    // Return cached feed if available, even if expired
    if (cachedFeed) {
      return NextResponse.json(
        { articles: cachedFeed, error: 'Using cached data', cached: true },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to fetch feed' },
      { status: 500 }
    );
  }
}
