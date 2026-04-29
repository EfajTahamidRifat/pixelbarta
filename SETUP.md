# PixelBarta Setup Guide

## Quick Start

### 1. Install Dependencies
```bash
pnpm install
```

### 2. Run Development Server
```bash
pnpm dev
```

The app will open at `http://localhost:3000`

### 3. View in Browser
- The loading screen appears while fetching news
- Once loaded, scroll vertically to browse articles
- Each article takes up the full screen (100vh)
- Tap the right-side icons to interact

## Key Controls

### Desktop
- **Scroll** - Move up/down through articles
- **Arrow Keys** - Navigate with keyboard
- **Click Icons** - Bookmark, share, or open links
- **Tap Info (ⓘ)** - See why an article matters

### Mobile
- **Swipe Up/Down** - Navigate between articles
- **Tap Icons** - Bookmark, share, or open links
- **Double Tap** - Quick actions (if implemented)

## Configuration

### Add More RSS Sources
Edit `lib/rss-fetcher.ts` and add to `FEED_SOURCES`:

```typescript
{
  name: 'Your Source',
  url: 'https://example.com/feed/',
  category: 'english',
  logo: 'https://example.com/favicon.ico',
  color: '#FF6E1A',
}
```

### Change Update Frequency
In `app/page.tsx`, modify the refresh interval:

```typescript
// Refresh feed every X minutes
const interval = setInterval(fetchFeed, 15 * 60 * 1000); // Change 15 to your preferred minutes
```

### Customize Theme
Edit `app/globals.css` to change:
- `--primary` - Main brand color
- `--background` - Dark background
- `--foreground` - Text color
- `--accent` - Accent highlights

## Deployment to Vercel

### 1. Push to GitHub
```bash
git add .
git commit -m "Initial PixelBarta"
git push
```

### 2. Deploy to Vercel
- Go to https://vercel.com
- Click "New Project"
- Select your GitHub repository
- Accept default settings
- Click "Deploy"

The app will be live in seconds!

## Troubleshooting

### Articles not loading?
- Check your internet connection
- RSS feeds may be temporarily unavailable
- Try refreshing the page

### Images not showing?
- Some RSS feeds don't include images
- Fallback mesh gradient appears automatically
- Source logo displays if og:image unavailable

### Translations not working?
- Bengali translation is currently skipped by design
- To add translations, integrate Google Translate API
- Update `lib/rss-fetcher.ts` to call translation service

### Keyboard navigation not working?
- Click in the scroll area first to focus it
- Some browsers may have different key handling

## Performance Tips

- **First Load** - Takes 3-5 seconds to fetch all feeds
- **Caching** - Feeds cache for 15 minutes
- **Storage** - Bookmarks stored locally (no server calls)
- **Images** - Lazy-load as users scroll

## Development

### Build for Production
```bash
pnpm build
pnpm start
```

### Run Type Checking
```bash
pnpm tsc --noEmit
```

### Format Code
```bash
pnpm format
```

## Environment Variables

Currently, no environment variables are required. All RSS feeds are public.

If you want to add features like:
- Google Translate API: Add `GOOGLE_TRANSLATE_API_KEY`
- Analytics: Add `NEXT_PUBLIC_ANALYTICS_ID`
- Custom API: Add relevant keys

Update `.env.local` and use them in your code.

## Need Help?

- Check the README.md for detailed feature documentation
- Review component files for implementation details
- Test in development with `pnpm dev`
- Check browser console for error messages

Enjoy PixelBarta! 🚀
