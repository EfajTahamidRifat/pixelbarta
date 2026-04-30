'use client';

import { motion } from 'framer-motion';
import { NewsArticle } from '@/lib/rss-fetcher';
import { markAsRead } from '@/lib/storage';
import { useEffect, useState } from 'react';

interface NewsCardProps {
  article: NewsArticle;
  isVisible: boolean;
}

export function NewsCard({ article, isVisible }: NewsCardProps) {
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (isVisible) markAsRead(article.id);
  }, [isVisible, article.id]);

  // Reset image error when article changes
  useEffect(() => {
    setImageError(false);
  }, [article.id]);

  const formattedDate = new Date(article.pubDate).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: isVisible ? 1 : 0.4 }}
      transition={{ duration: 0.5 }}
      className="relative h-screen w-full snap-start flex flex-col justify-end overflow-hidden bg-black"
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        {!imageError ? (
          <img
            src={article.image}
            alt=""
            aria-hidden="true"
            onError={() => setImageError(true)}
            className="h-full w-full object-cover"
          />
        ) : (
          <div
            className="h-full w-full"
            style={{
              backgroundImage: `linear-gradient(135deg, #0d1b2a 0%, #1b263b 50%, #0d1b2a 100%)`,
            }}
          />
        )}

        {/* Gradient overlay — stronger at bottom for readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/10" />
      </div>

      {/* Content — safe zone: leaves room for action bar (right) and language switch (top) */}
      <motion.div
        initial={{ y: 24, opacity: 0 }}
        animate={isVisible ? { y: 0, opacity: 1 } : { y: 24, opacity: 0 }}
        transition={{ delay: 0.15, duration: 0.45, ease: 'easeOut' }}
        className="relative z-10 px-5 pb-10 pt-6 pr-20 text-white"
      >
        {/* Source row */}
        <div className="flex items-center gap-2.5 mb-3">
          <span className="text-[11px] font-bold uppercase tracking-widest text-white/60">
            {article.source}
          </span>
          <span className="text-white/30 text-xs">·</span>
          <span className="text-[11px] text-white/40">{formattedDate}</span>
          {article.badge && (
            <span className="ml-auto text-[11px] font-semibold px-2.5 py-1 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm whitespace-nowrap">
              {article.badge}
            </span>
          )}
        </div>

        {/* Title */}
        <h1 className="text-2xl sm:text-3xl font-bold leading-snug mb-3 text-balance">
          {article.title}
        </h1>

        {/* Description */}
        {article.description && (
          <p className="text-sm text-white/65 leading-relaxed line-clamp-2 mb-4">
            {article.description}
          </p>
        )}

        {/* Read more */}
        <a
          href={article.link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-white/80 hover:text-white transition-colors"
        >
          Read full story
          <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 8h10M9 4l4 4-4 4"/>
          </svg>
        </a>
      </motion.div>
    </motion.div>
  );
}
