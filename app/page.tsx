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
      if (fetched.length === 0) throw new Error('NO ARTICLES FOUND');
      setArticles(fetched);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'FEED UNAVAILABLE');
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

  if (loading) return <LoadingScreen />;

  if (error && articles.length === 0) {
    return (
      <div className="h-[100svh] w-full flex items-center justify-center bg-black px-6">
        {/* Corner decorations */}
        <div className="absolute top-4 left-4 w-8 h-8 border-t border-l border-[#ff0080]/40" />
        <div className="absolute top-4 right-4 w-8 h-8 border-t border-r border-[#ff0080]/40" />
        <div className="absolute bottom-4 left-4 w-8 h-8 border-b border-l border-[#ff0080]/40" />
        <div className="absolute bottom-4 right-4 w-8 h-8 border-b border-r border-[#ff0080]/40" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-xs w-full"
        >
          <div
            className="text-[10px] tracking-[0.3em] uppercase mb-4"
            style={{ color: '#ff0080', fontFamily: 'var(--font-mono)' }}
          >
            // SYSTEM ERROR
          </div>
          <div
            className="text-4xl font-black tracking-tighter text-white mb-1"
            style={{ fontFamily: 'var(--font-mono)', textShadow: '0 0 20px rgba(255,0,128,0.5)' }}
          >
            CONNECTION<br />FAILED
          </div>
          <div className="w-12 h-px mx-auto my-4" style={{ background: '#ff0080', boxShadow: '0 0 8px #ff0080' }} />
          <p
            className="text-[11px] tracking-wider mb-8"
            style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-mono)' }}
          >
            {error}
          </p>
          <button
            onClick={() => { setLoading(true); fetchFeed(); }}
            className="w-full py-3.5 text-[12px] font-bold tracking-widest uppercase transition-opacity hover:opacity-80"
            style={{
              background: '#ff0080',
              color: '#000',
              fontFamily: 'var(--font-mono)',
              boxShadow: '0 0 20px rgba(255,0,128,0.3)',
            }}
          >
            RETRY CONNECTION
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <main className="h-[100svh] w-full bg-black">
      <FeedScroller articles={articles} />
    </main>
  );
}
