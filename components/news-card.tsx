'use client';

import { motion } from 'framer-motion';
import { NewsArticle } from '@/lib/rss-fetcher';
import { isBookmarked, markAsRead } from '@/lib/storage';
import { useEffect, useState } from 'react';

interface NewsCardProps {
  article: NewsArticle;
  isVisible: boolean;
  onBookmarkChange?: (id: string, isBookmarked: boolean) => void;
}

export function NewsCard({ article, isVisible, onBookmarkChange }: NewsCardProps) {
  const [bookmarked, setBookmarked] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setBookmarked(isBookmarked(article.id));
    if (isVisible) {
      markAsRead(article.id);
    }
  }, [isVisible, article.id]);

  const handleBookmarkClick = () => {
    const newState = !bookmarked;
    setBookmarked(newState);
    onBookmarkChange?.(article.id, newState);
  };

  const sourceLogoMap: { [key: string]: { emoji: string; color: string } } = {
    'The Verge': { emoji: '🔶', color: 'from-orange-500' },
    'TechCrunch': { emoji: '🔳', color: 'from-slate-800' },
    'Wired': { emoji: '💎', color: 'from-teal-500' },
    '9to5Google': { emoji: '🔵', color: 'from-blue-500' },
    'Bangla Tribune': { emoji: '🔴', color: 'from-red-600' },
    'DigiBangla': { emoji: '🔵', color: 'from-blue-600' },
  };

  const sourceInfo = sourceLogoMap[article.source] || { emoji: '📰', color: 'from-gray-600' };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: isVisible ? 1 : 0.5 }}
      transition={{ duration: 0.6 }}
      className="relative h-screen w-full snap-center flex flex-col justify-end overflow-hidden bg-black"
    >
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        {!imageError ? (
          <img
            src={article.image}
            alt={article.title}
            onError={() => setImageError(true)}
            className="h-full w-full object-cover"
          />
        ) : (
          <div
            className="h-full w-full bg-gradient-to-br"
            style={{
              backgroundImage: `linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)`,
            }}
          />
        )}

        {/* Dark Gradient Overlay (bottom 40%) */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
      </div>

      {/* Content Container */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={isVisible ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="relative z-10 p-6 pb-24 text-white"
      >
        {/* Source & Badge Row */}
        <div className="flex items-center justify-between mb-4 gap-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 backdrop-blur border border-white/20 text-xl">
              {sourceInfo.emoji}
            </div>
            <div className="flex flex-col">
              <p className="text-xs uppercase tracking-widest font-bold text-white">
                {article.source}
              </p>
              <p className="text-xs text-white/50">
                {new Date(article.pubDate).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                })}
              </p>
            </div>
          </div>
          {article.badge && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
              className="bg-white/10 backdrop-blur px-3 py-1.5 rounded-full text-xs font-semibold border border-white/20 whitespace-nowrap"
            >
              {article.badge}
            </motion.div>
          )}
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-4 text-balance">
          {article.title}
        </h1>

        {/* Description */}
        {article.description && (
          <p className="text-gray-200 text-base leading-relaxed mb-6 line-clamp-3">
            {article.description}
          </p>
        )}

        {/* Read More Link */}
        <a
          href={article.link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block text-white font-semibold hover:text-gray-300 transition-colors underline"
        >
          Read full story →
        </a>
      </motion.div>

      {/* Bookmark Indicator (subtle) */}
      {bookmarked && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute top-6 right-6 z-20 bg-white/10 backdrop-blur px-3 py-2 rounded-full border border-white/20"
        >
          <span className="text-white font-semibold">✓ Saved</span>
        </motion.div>
      )}
    </motion.div>
  );
}
