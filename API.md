# PixelBarta API Documentation

## Endpoints

### GET /api/feed

Fetches aggregated tech news from all configured RSS sources.

**Query Parameters:** None

**Response:**
```json
{
  "articles": [
    {
      "id": "the-verge-0-2024-01-15T10:30:00Z",
      "title": "Apple announces new iPhone 16 Pro with AI features",
      "description": "Apple has unveiled its latest flagship smartphone...",
      "image": "https://example.com/image.jpg",
      "link": "https://theverge.com/article/iphone-16-pro",
      "pubDate": "2024-01-15T10:30:00Z",
      "source": "The Verge",
      "category": "english",
      "badge": "🚀 Launch"
    },
    // ... more articles
  ],
  "cached": false,
  "timestamp": "2024-01-15T10:35:00Z"
}
```

**Status Codes:**
- `200 OK` - Successfully returned articles
- `500 Internal Server Error` - Failed to fetch feeds

**Caching:**
- Responses are cached for 15 minutes
- If cache is valid, `"cached": true` is returned
- If cache expires, fresh feeds are fetched from all sources

**Response Time:**
- Cached: 10-50ms
- Fresh: 3-8 seconds (depends on RSS sources)

## Response Schema

### Article Object

```typescript
interface NewsArticle {
  id: string;                    // Unique identifier
  title: string;                 // Article headline
  description: string;           // Article summary/snippet
  image: string;                 // Full-bleed background image URL
  link: string;                  // URL to full article
  pubDate: string;               // ISO 8601 timestamp
  source: string;                // Name of RSS source
  category: 'english' | 'bengali'; // Feed language category
  badge?: string;                // Auto-generated category badge
}
```

### Badge Values

Auto-generated based on article content:

```
💰 Investment  - Funding, raises, investments, acquisitions
🤖 AI          - AI, machine learning, neural networks
🔒 Security    - Security, hacks, vulnerabilities, breaches
📱 Mobile      - Mobile, smartphones, apps, iOS, Android
🚀 Launch      - New products, announcements, releases
```

## Error Handling

### Network Error
If RSS sources are unreachable:

```json
{
  "articles": [],
  "error": "Failed to fetch feed",
  "status": 500
}
```

### Fallback to Cache
If fresh fetch fails but cache exists:

```json
{
  "articles": [...cached_articles...],
  "error": "Using cached data",
  "cached": true,
  "status": 200
}
```

## Performance Considerations

### Rate Limiting
- No explicit rate limiting (public feeds)
- RSS sources may have their own limits
- Cache prevents excessive requests

### Optimization
- Deduplication removes >80% similar articles
- Images lazy-loaded by browser
- Feed fetches in parallel (Promise.all)
- Failed feeds don't block others

### Cache Strategy

```
Fresh Feed Request
  ↓
Fetch all RSS sources in parallel
  ↓
Deduplicate articles
  ↓
Sort by date
  ↓
Cache for 15 minutes
  ↓
Return to client
```

## Usage Examples

### JavaScript/Fetch
```javascript
const response = await fetch('/api/feed');
const data = await response.json();
console.log(data.articles.length, 'articles loaded');
```

### React Hook
```typescript
const [articles, setArticles] = useState([]);

useEffect(() => {
  const fetchFeed = async () => {
    const response = await fetch('/api/feed');
    const data = await response.json();
    setArticles(data.articles);
  };
  
  fetchFeed();
}, []);
```

### Auto-Refresh
```typescript
// Refresh feed every 15 minutes
setInterval(async () => {
  const response = await fetch('/api/feed');
  const data = await response.json();
  setArticles(data.articles);
}, 15 * 60 * 1000);
```

## Deduplication Algorithm

Articles are compared using string similarity:

```typescript
const similarity = stringSimilarity(
  article1.title.toLowerCase(),
  article2.title.toLowerCase()
);

// Remove if > 80% similar
if (similarity > 0.8) {
  // Filter out duplicate
}
```

**Example:**
- "Apple releases new iPhone 16 Pro" 
- "Apple announces iPhone 16 Pro launch"
- Result: Second article filtered (81% similar)

## Feed Sources

All feeds are **public** and require no authentication.

### English Sources
| Source | URL | Update Frequency |
|--------|-----|------------------|
| The Verge | https://www.theverge.com/rss/index.xml | Hourly |
| TechCrunch | https://techcrunch.com/feed/ | Hourly |
| Wired | https://www.wired.com/feed/rss | Hourly |
| 9to5Google | https://9to5google.com/feed/ | Multiple daily |

### Bengali Sources
| Source | URL | Update Frequency |
|--------|-----|------------------|
| Bangla Tribune | https://www.banglatribune.com/feed/tech-and-gadget/ | Daily |
| DigiBangla | https://digibanglatech.news/feed/ | Daily |

## Future API Plans

1. **Filtering**
   - `/api/feed?source=theverge`
   - `/api/feed?category=investment`
   - `/api/feed?language=bengali`

2. **Pagination**
   - `/api/feed?page=1&limit=20`

3. **Search**
   - `/api/search?q=AI`

4. **User Preferences** (requires auth)
   - POST `/api/bookmarks`
   - GET `/api/user/history`

## Copyright & Attribution

All content belongs to original sources. Links properly attribute to source publications. Images are from RSS feeds' og:image meta tags, respecting original publisher rights.

No content is cached longer than necessary, and all articles link back to original sources.
