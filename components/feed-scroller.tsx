'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { NewsArticle } from '@/lib/rss-fetcher';
import { NewsCard } from './news-card';
import { ActionVerticalBar } from './action-vertical-bar';
import { ProgressBar } from './progress-bar';
import { ContextDrawer } from './context-drawer';
import { BilingualSwitch } from './bilingual-switch';
import { getPreferences } from '@/lib/storage';

interface FeedScrollerProps {
  articles: NewsArticle[];
}

const BN_SOURCES = ['Bangla Tribune', 'DigiBangla'];

export function FeedScroller({ articles }: FeedScrollerProps) {
  const [language, setLanguage] = useState<'en' | 'bn'>(() => {
    if (typeof window !== 'undefined') return getPreferences().language ?? 'en';
    return 'en';
  });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showHint, setShowHint] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  const filtered = articles.filter((a) =>
    language === 'bn'
      ? BN_SOURCES.some((s) => a.source.includes(s))
      : !BN_SOURCES.some((s) => a.source.includes(s))
  );

  const handleLanguageChange = useCallback((lang: 'en' | 'bn') => {
    setLanguage(lang);
    setCurrentIndex(0);
    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
    }
  }, []);

  const handleScroll = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    const idx = Math.round(el.scrollTop / el.clientHeight);
    setCurrentIndex(Math.min(idx, filtered.length - 1));
    if (idx > 0) setShowHint(false);
  }, [filtered.length]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener('scroll', handleScroll, { passive: true });
    return () => el.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    const go = (dir: 1 | -1) => {
      setCurrentIndex((prev) => {
        const next = Math.min(Math.max(prev + dir, 0), filtered.length - 1);
        containerRef.current?.scrollTo({ top: next * window.innerHeight, behavior: 'smooth' });
        return next;
      });
      setShowHint(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') { e.preventDefault(); go(1); }
      if (e.key === 'ArrowUp')   { e.preventDefault(); go(-1); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [filtered.length]);

  if (filtered.length === 0) {
    return (
      <div className="h-[100svh] w-full flex flex-col items-center justify-center bg-black gap-6">
        <p
          className="text-[11px] tracking-[0.25em] uppercase text-center px-6"
          style={{ color: 'rgba(255,255,255,0.3)', fontFamily: 'var(--font-mono)' }}
        >
          NO ARTICLES — SWITCH LANGUAGE
        </p>
        <BilingualSwitch onLanguageChange={handleLanguageChange} />
      </div>
    );
  }

  const currentArticle = filtered[currentIndex] ?? filtered[0];

  return (
    <div className="relative h-[100svh] w-full bg-black overflow-hidden">
      {/* Neon progress bar */}
      <ProgressBar currentIndex={currentIndex} totalArticles={filtered.length} />

      {/* Language switch — centered top */}
      <BilingualSwitch onLanguageChange={handleLanguageChange} />

      {/* Article counter HUD — bottom left */}
      <div
        className="fixed bottom-6 left-4 z-20 pointer-events-none"
        style={{ fontFamily: 'var(--font-mono)' }}
      >
        <span
          className="text-[10px] tracking-widest tabular-nums"
          style={{ color: 'rgba(255,255,255,0.2)' }}
        >
          {String(currentIndex + 1).padStart(2, '0')}&nbsp;/&nbsp;{String(filtered.length).padStart(2, '0')}
        </span>
      </div>

      {/* Scroll container */}
      <div
        ref={containerRef}
        className="h-[100svh] w-full overflow-y-scroll"
        style={{ scrollSnapType: 'y mandatory', WebkitOverflowScrolling: 'touch' }}
      >
        {filtered.map((article, index) => (
          <NewsCard
            key={article.id}
            article={article}
            isVisible={currentIndex === index}
          />
        ))}
      </div>

      {/* Actions — right side */}
      <ActionVerticalBar article={currentArticle} isVisible={true} />

      {/* Context info drawer */}
      <ContextDrawer article={currentArticle} />

      {/* Swipe hint */}
      {showHint && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="fixed bottom-14 left-1/2 -translate-x-1/2 z-20 pointer-events-none flex flex-col items-center gap-1.5"
          style={{ animation: 'hint-out 0.5s forwards 3s' }}
        >
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none"
              stroke="rgba(0,245,255,0.4)" strokeWidth="1.5">
              <path d="M12 5v14M5 12l7 7 7-7"/>
            </svg>
          </motion.div>
          <span
            className="text-[10px] tracking-[0.3em] uppercase"
            style={{ color: 'rgba(0,245,255,0.3)', fontFamily: 'var(--font-mono)' }}
          >
            SWIPE UP
          </span>
        </motion.div>
      )}

      <style>{`
        @keyframes hint-out { to { opacity: 0; } }
      `}</style>
    </div>
  );
}
