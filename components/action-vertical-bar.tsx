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
    setBookmarked((p) => !p);
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title: article.title, url: article.link });
      } else {
        await navigator.clipboard.writeText(article.link);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch { /* user cancelled */ }
  };

  const BtnWrap = ({
    onClick, href, children, active, title,
  }: {
    onClick?: () => void;
    href?: string;
    children: React.ReactNode;
    active?: boolean;
    title: string;
  }) => {
    const cls = `
      relative flex items-center justify-center w-11 h-11
      transition-all duration-200 group
    `;
    const style = {
      background: active ? 'rgba(0,245,255,0.15)' : 'rgba(0,0,0,0.6)',
      border: `1px solid ${active ? 'rgba(0,245,255,0.5)' : 'rgba(255,255,255,0.1)'}`,
      boxShadow: active ? '0 0 12px rgba(0,245,255,0.3)' : 'none',
    };
    const inner = (
      <div style={style} className="w-11 h-11 flex items-center justify-center">
        {children}
      </div>
    );
    if (href) return (
      <motion.a href={href} target="_blank" rel="noopener noreferrer"
        className={cls} whileTap={{ scale: 0.88 }} title={title} aria-label={title}>
        {inner}
      </motion.a>
    );
    return (
      <motion.button onClick={onClick} className={cls}
        whileTap={{ scale: 0.88 }} title={title} aria-label={title}>
        {inner}
      </motion.button>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 16 }}
      animate={isVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: 16 }}
      transition={{ duration: 0.3, delay: 0.15 }}
      className="fixed right-3 z-30 flex flex-col items-center gap-2.5"
      style={{ bottom: '96px' }}
    >
      {/* Bookmark */}
      <BtnWrap onClick={handleBookmark} active={bookmarked} title={bookmarked ? 'Unbookmark' : 'Bookmark'}>
        <svg className="w-5 h-5" viewBox="0 0 24 24"
          fill={bookmarked ? '#00f5ff' : 'none'}
          stroke={bookmarked ? '#00f5ff' : 'rgba(255,255,255,0.6)'}
          strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h6a2 2 0 012 2v16l-7-3.5L5 21V5z"/>
        </svg>
      </BtnWrap>

      {/* Share */}
      <div className="relative">
        <BtnWrap onClick={handleShare} title="Share">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none"
            stroke="rgba(255,255,255,0.6)" strokeWidth="1.5">
            <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/>
            <circle cx="18" cy="19" r="3"/>
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
          </svg>
        </BtnWrap>
        <AnimatePresence>
          {copied && (
            <motion.div
              initial={{ opacity: 0, x: 8, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 8, scale: 0.9 }}
              className="absolute right-14 top-1/2 -translate-y-1/2 whitespace-nowrap text-[11px] font-bold tracking-widest uppercase px-3 py-1.5"
              style={{
                background: '#00f5ff',
                color: '#000',
                fontFamily: 'var(--font-mono)',
              }}
            >
              COPIED
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Open article */}
      <BtnWrap href={article.link} title="Open full article">
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none"
          stroke="rgba(255,255,255,0.6)" strokeWidth="1.5">
          <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>
          <polyline points="15 3 21 3 21 9"/>
          <line x1="10" y1="14" x2="21" y2="3"/>
        </svg>
      </BtnWrap>
    </motion.div>
  );
}
