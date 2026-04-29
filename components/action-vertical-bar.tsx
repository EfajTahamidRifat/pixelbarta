'use client';

import { motion } from 'framer-motion';
import { NewsArticle } from '@/lib/rss-fetcher';
import { isBookmarked, toggleBookmark } from '@/lib/storage';
import { useState, useEffect } from 'react';

interface ActionVerticalBarProps {
  article: NewsArticle;
  isVisible: boolean;
  onBookmarkChange?: (id: string, bookmarked: boolean) => void;
}

export function ActionVerticalBar({
  article,
  isVisible,
  onBookmarkChange,
}: ActionVerticalBarProps) {
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    setBookmarked(isBookmarked(article.id));
  }, [article.id]);

  const handleBookmark = () => {
    toggleBookmark(article.id);
    const newState = !bookmarked;
    setBookmarked(newState);
    onBookmarkChange?.(article.id, newState);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: article.title,
        text: article.description,
        url: article.link,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(article.link);
      alert('Link copied to clipboard!');
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate={isVisible ? 'visible' : 'hidden'}
      className="fixed right-6 bottom-24 z-30 flex flex-col gap-3 md:bottom-32"
    >
      {/* Bookmark Button */}
      <motion.button
        variants={itemVariants}
        onClick={handleBookmark}
        className={`flex items-center justify-center w-12 h-12 rounded-full backdrop-blur border transition-all duration-300 ${
          bookmarked
            ? 'bg-white/20 border-white/40 text-white'
            : 'bg-white/10 border-white/20 text-white/70 hover:bg-white/20 hover:text-white'
        }`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <svg
          className="w-6 h-6"
          fill={bookmarked ? 'currentColor' : 'none'}
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 5a2 2 0 012-2h6a2 2 0 012 2v16l-7-3.5L5 21V5z"
          />
        </svg>
      </motion.button>

      {/* Share Button */}
      <motion.button
        variants={itemVariants}
        onClick={handleShare}
        className="flex items-center justify-center w-12 h-12 rounded-full backdrop-blur border bg-white/10 border-white/20 text-white/70 hover:bg-white/20 hover:text-white transition-all duration-300"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
          />
        </svg>
      </motion.button>

      {/* Open Link Button */}
      <motion.a
        variants={itemVariants}
        href={article.link}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center w-12 h-12 rounded-full backdrop-blur border bg-white/10 border-white/20 text-white/70 hover:bg-white/20 hover:text-white transition-all duration-300"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4m-4-6l6-6m0 0l-6 6m6-6v8"
          />
        </svg>
      </motion.a>
    </motion.div>
  );
}
