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

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch('/api/feed', {
          cache: 'no-store',
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.statusText}`);
        }

        const data = await response.json();
        setArticles(data.articles || []);

        if (data.articles?.length === 0) {
          setError('No articles found. Try again later.');
        }
      } catch (err) {
        console.error('[v0] Feed fetch error:', err);
        setError(
          err instanceof Error
            ? err.message
            : 'Failed to load news feed. Please try again.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchFeed();

    // Refresh feed every 15 minutes
    const interval = setInterval(fetchFeed, 15 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (loading || articles.length === 0) {
    if (error && articles.length === 0) {
      return (
        <div className="h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-black">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-white max-w-md px-6"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className="mb-6 text-6xl"
            >
              ⚠️
            </motion.div>
            <h1 className="text-3xl font-bold mb-4">Connection Issue</h1>
            <p className="text-white/60 mb-8">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold hover:from-blue-700 hover:to-purple-700 transition-all"
            >
              Retry
            </button>
          </motion.div>
        </div>
      );
    }

    return <LoadingScreen />;
  }

  return (
    <main className="h-screen w-full bg-black">
      <FeedScroller articles={articles} />
    </main>
  );
}
