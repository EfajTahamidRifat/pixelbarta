'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { NewsArticle } from '@/lib/rss-fetcher';
import { isBookmarked, toggleBookmark } from '@/lib/storage';
import { useState, useEffect } from 'react';

interface ActionVerticalBarProps {
  article: NewsArticle;
  isVisible: boolean;
}

export function ActionVerticalBar({ article, isVisible }: ActionVerticalBarProps) {
  const [bookmarked, setBookmarked] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setBookmarked(isBookmarked(article.id));
  }, [article.id]);

  const handleBookmark = () => {
    toggleBookmark(article.id);
    setBookmarked((prev) => !prev);
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: article.title,
          text: article.description,
          url: article.link,
        });
      } else {
        await navigator.clipboard.writeText(article.link);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      // user cancelled share — no error needed
    }
  };

  const btnClass =
    'flex items-center justify-center w-11 h-11 rounded-full backdrop-blur-md border border-white/20 bg-black/30 text-white/70 hover:text-white hover:bg-white/20 transition-all duration-200 shadow-lg';

  return (
    <motion.div
      initial={{ opacity: 0, x: 16 }}
      animate={isVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: 16 }}
      transition={{ duration: 0.35, delay: 0.2 }}
      className="fixed right-4 bottom-28 z-30 flex flex-col items-center gap-3"
    >
      {/* Bookmark */}
      <motion.button
        onClick={handleBookmark}
        className={`${btnClass} ${bookmarked ? '!bg-white/25 border-white/40 !text-white' : ''}`}
        whileTap={{ scale: 0.9 }}
        title={bookmarked ? 'Remove bookmark' : 'Bookmark'}
        aria-label={bookmarked ? 'Remove bookmark' : 'Bookmark'}
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill={bookmarked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h6a2 2 0 012 2v16l-7-3.5L5 21V5z" />
        </svg>
      </motion.button>

      {/* Share / Copy */}
      <div className="relative">
        <motion.button
          onClick={handleShare}
          className={btnClass}
          whileTap={{ scale: 0.9 }}
          title="Share"
          aria-label="Share article"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
          </svg>
        </motion.button>

        {/* Copied toast — inline, no alert() */}
        <AnimatePresence>
          {copied && (
            <motion.span
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 8 }}
              className="absolute right-14 top-1/2 -translate-y-1/2 bg-white text-black text-xs font-semibold px-3 py-1.5 rounded-full shadow-xl whitespace-nowrap"
            >
              Link copied!
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Open in browser */}
      <motion.a
        href={article.link}
        target="_blank"
        rel="noopener noreferrer"
        className={btnClass}
        whileTap={{ scale: 0.9 }}
        title="Open article"
        aria-label="Open full article"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>
          <polyline points="15 3 21 3 21 9"/>
          <line x1="10" y1="14" x2="21" y2="3"/>
        </svg>
      </motion.a>
    </motion.div>
  );
}
