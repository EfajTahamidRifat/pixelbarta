# PixelBarta - Tech News Reels

A high-end, vertical-scroll tech news aggregator featuring a bilingual (Bengali/English) "Reels" experience. Scroll through the latest tech news like Instagram Reels, with beautiful animations, smart categorization, and contextual insights about how tech trends affect Bangladesh.

## Features

### Core Experience
- **Vertical Scroll Reels** - Full-screen news cards that snap into place with smooth animations
- **Full-Bleed Images** - Each article displays with a background image (og:image from RSS feeds)
- **Glassmorphism UI** - Modern, frosted-glass design throughout
- **Smooth Animations** - Framer Motion powers beautiful transitions

### Smart Content
- **RSS Feed Aggregation** - Fetches from 8 major tech sources (English + Bengali)
- **Auto-Deduplication** - Filters out near-duplicate articles with string similarity matching
- **Smart Badges** - Auto-tags articles: 💰 Investment, 🤖 AI, 🔒 Security, 📱 Mobile, 🚀 Launch
- **Contextual Insights** - "Why it Matters" drawer explains how tech affects Bangladesh's tech community

### Bilingual Support
- **EN / বাং Toggle** - Switch languages with a floating button
- **Progress Bar** - Track your position in the current news stack
- **Responsive Design** - Works beautifully on mobile and desktop

### User Control
- **Bookmark Articles** - Save favorites to local storage
- **Share & Read More** - Quick actions to share articles or visit the source
- **Keyboard Navigation** - Use arrow keys to scroll (desktop), or swipe on mobile
- **Read History** - Automatically tracks which articles you've viewed

## Tech Stack

- **Next.js 16** - App Router, server-side rendering
- **React 19** - UI components and hooks
- **Framer Motion** - Animations and transitions
- **Tailwind CSS** - Utility-first styling
- **TypeScript** - Type safety throughout
- **RSS Parser** - Extracts feeds from multiple sources
- **String Similarity** - Deduplication engine

## Project Structure

```
├── app/
│   ├── api/
│   │   └── feed/route.ts          # RSS feed fetching endpoint (15-min cache)
│   ├── layout.tsx                  # Root layout with metadata
│   ├── page.tsx                    # Main page with loading states
│   └── globals.css                 # Dark theme design tokens
├── components/
│   ├── news-card.tsx              # Individual article display card
│   ├── feed-scroller.tsx          # Main vertical scroll container
│   ├── action-vertical-bar.tsx    # Bookmark/Share/Link buttons
│   ├── context-drawer.tsx         # "Why it Matters" insights panel
│   ├── bilingual-switch.tsx       # EN/বাং language toggle
│   ├── progress-bar.tsx           # Top progress indicator
│   └── loading-screen.tsx         # Beautiful loading state
├── lib/
│   ├── rss-fetcher.ts            # RSS parsing & article normalization
│   └── storage.ts                 # Local storage utilities
└── public/                         # Static assets
```

## RSS Feed Sources

### English
- The Verge: https://www.theverge.com/rss/index.xml
- TechCrunch: https://techcrunch.com/feed/
- Wired: https://www.wired.com/feed/rss
- 9to5Google: https://9to5google.com/feed/

### Bengali
- Bangla Tribune: https://www.banglatribune.com/feed/tech-and-gadget/
- DigiBangla: https://digibanglatech.news/feed/

## How to Run

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start
```

The app will be available at `http://localhost:3000`

## Features in Detail

### Smart Badge System
Automatically categorizes articles based on keywords:
- **Investment** - Articles about funding, raises, investments
- **AI** - Artificial intelligence and machine learning
- **Security** - Cybersecurity, hacks, vulnerabilities
- **Mobile** - Mobile devices, smartphones, Android, iOS
- **Launch** - New product announcements

### Image Handling
- Extracts `og:image` from RSS feeds for beautiful full-bleed backgrounds
- Falls back to source logo if image unavailable
- Generates mesh gradient fallbacks based on brand colors
- Applies dark gradient overlay for text readability

### Context Drawer
Tap the info icon (ⓘ) on any article to see:
- Why this tech trend matters for Bangladesh
- Key areas affected (Digital Economy, Tech Growth, etc.)
- Related categories
- Direct link to full article

### Local Storage
User preferences stored locally:
- **Language preference** - EN or বাং
- **Bookmarked articles** - Save favorites
- **Read history** - Track viewed articles
- **Auto-synced** - Persists across sessions

## Browser Support

- Chrome/Edge: Full support
- Safari: Full support
- Firefox: Full support
- Mobile browsers: Optimized touch interactions

## Performance

- **Feed Caching** - 15-minute cache to reduce API calls
- **Lazy Loading** - Images load as users scroll
- **Optimized Images** - og:images from sources typically under 50KB
- **Snap Scrolling** - Smooth, performant vertical scroll

## Future Enhancements

- Real Bengali translations via Google Translate API
- User accounts with cloud sync
- Advanced filtering (by source, category, date)
- AI-powered content recommendation
- Offline reading mode

## Notes

- Articles are deduplicated with >80% title similarity
- Feed fetches run on-demand with 15-minute caching
- No analytics or tracking - fully privacy-focused
- Works without internet after initial load

## License

MIT - Free to use and modify
