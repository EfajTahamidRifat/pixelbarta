'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
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
    // Initialise from storage on first render (client only)
    if (typeof window !== 'undefined') return getPreferences().language;
    return 'en';
  });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showHint, setShowHint] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  // Filter articles by language
  const filtered = articles.filter((a) =>
    language === 'bn'
      ? BN_SOURCES.some((s) => a.source.includes(s))
      : !BN_SOURCES.some((s) => a.source.includes(s))
  );

  // When language changes reset scroll position
  const handleLanguageChange = useCallback((lang: 'en' | 'bn') => {
    setLanguage(lang);
    setCurrentIndex(0);
    containerRef.current?.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  // Hide swipe hint after first scroll
  const handleScroll = useCallback(() => {
    if (!containerRef.current) return;
    const { scrollTop, clientHeight } = containerRef.current;
    const idx = Math.round(scrollTop / clientHeight);
    setCurrentIndex(Math.min(idx, filtered.length - 1));
    if (idx > 0) setShowHint(false);
  }, [filtered.length]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener('scroll', handleScroll, { passive: true });
    return () => el.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // Keyboard navigation
  useEffect(() => {
    const go = (dir: 1 | -1) => {
      setCurrentIndex((prev) => {
        const next = Math.min(Math.max(prev + dir, 0), filtered.length - 1);
        containerRef.current?.scrollTo({
          top: next * window.innerHeight,
          behavior: 'smooth',
        });
        return next;
      });
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
      <div className="h-screen w-full flex items-center justify-center bg-black">
        <div className="text-center text-white/40 px-6">
          <p className="text-base mb-1">No articles available</p>
          <p className="text-sm">Try switching language</p>
        </div>
        <BilingualSwitch onLanguageChange={handleLanguageChange} />
      </div>
    );
  }

  const currentArticle = filtered[currentIndex] ?? filtered[0];

  return (
    <div className="relative h-screen w-full bg-black overflow-hidden">
      {/* Progress bar */}
      <ProgressBar currentIndex={currentIndex} totalArticles={filtered.length} />

      {/* Language toggle — centered top */}
      <BilingualSwitch onLanguageChange={handleLanguageChange} />

      {/* Scroll container */}
      <div
        ref={containerRef}
        className="h-screen w-full overflow-y-scroll snap-y snap-mandatory"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {filtered.map((article, index) => (
          <NewsCard
            key={article.id}
            article={article}
            isVisible={currentIndex === index}
          />
        ))}
      </div>

      {/* Action bar — right side */}
      <ActionVerticalBar article={currentArticle} isVisible={true} />

      {/* Context drawer trigger */}
      <ContextDrawer article={currentArticle} />

      {/* Swipe hint — auto-dismisses after first scroll or 3 seconds */}
      {showHint && (
        <div
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-20 pointer-events-none"
          style={{ animation: 'fadeout 3s forwards 2s' }}
        >
          <div className="flex flex-col items-center gap-1.5 text-white/30">
            <svg className="w-5 h-5 animate-bounce" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M12 5v14M5 12l7 7 7-7"/>
            </svg>
            <span className="text-[11px] tracking-widest uppercase">Scroll to explore</span>
          </div>
        </div>
      )}

      <style>{`
        div::-webkit-scrollbar { display: none; }
        @keyframes fadeout { to { opacity: 0; } }
      `}</style>
    </div>
  );
}
