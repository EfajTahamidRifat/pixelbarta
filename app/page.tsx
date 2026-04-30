'use client';

import { useEffect, useState } from 'react';
import { FeedScroller } from '@/components/feed-scroller';
import { LoadingScreen } from '@/components/loading-screen';
import { NewsArticle } from '@/lib/rss-fetcher';
import { motion } from 'framer-motion';

export default function Home() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFeed = async () => {
    try {
      setError(null);
      const response = await fetch('/api/feed', { cache: 'no-store' });
      if (!response.ok) throw new Error(`Server error: ${response.status}`);
      const data = await response.json();
      const fetched: NewsArticle[] = data.articles || [];
      if (fetched.length === 0) throw new Error('No articles found. Try again later.');
      setArticles(fetched);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load news feed.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeed();
    const interval = setInterval(fetchFeed, 15 * 60 * 1000);
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Show loading screen until first successful fetch — never flash error during load
  if (loading) return <LoadingScreen />;

  // Error state — only shown after load attempt completes with no articles
  if (error && articles.length === 0) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-black">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center text-white max-w-sm px-6"
        >
          <div className="text-5xl mb-6">⚠️</div>
          <h1 className="text-2xl font-bold mb-3">Connection Issue</h1>
          <p className="text-white/50 text-sm mb-8 leading-relaxed">{error}</p>
          <button
            onClick={() => { setLoading(true); fetchFeed(); }}
            className="px-8 py-3 rounded-full bg-white text-black text-sm font-semibold hover:bg-white/90 transition-colors"
          >
            Try Again
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <main className="h-screen w-full bg-black">
      <FeedScroller articles={articles} />
    </main>
  );
}
