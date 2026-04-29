'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { NewsArticle } from '@/lib/rss-fetcher';
import { NewsCard } from './news-card';
import { ActionVerticalBar } from './action-vertical-bar';
import { ProgressBar } from './progress-bar';
import { ContextDrawer } from './context-drawer';
import { BilingualSwitch } from './bilingual-switch';

interface FeedScrollerProps {
  articles: NewsArticle[];
}

export function FeedScroller({ articles }: FeedScrollerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if mobile
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleScroll = useCallback(() => {
    if (!containerRef.current) return;

    const { scrollTop, clientHeight } = containerRef.current;
    const newIndex = Math.round(scrollTop / clientHeight);
    setCurrentIndex(Math.min(newIndex, articles.length - 1));
  }, [articles.length]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // Keyboard navigation and touch swipe
  useEffect(() => {
    let touchStartY = 0;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        const newIndex = Math.min(currentIndex + 1, articles.length - 1);
        setCurrentIndex(newIndex);
        containerRef.current?.scrollTo({
          top: newIndex * window.innerHeight,
          behavior: 'smooth',
        });
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        const newIndex = Math.max(currentIndex - 1, 0);
        setCurrentIndex(newIndex);
        containerRef.current?.scrollTo({
          top: newIndex * window.innerHeight,
          behavior: 'smooth',
        });
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const touchEndY = e.changedTouches[0].clientY;
      const diff = touchStartY - touchEndY;

      // Only trigger if swipe is significant (more than 50px)
      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          // Swiped up
          const newIndex = Math.min(currentIndex + 1, articles.length - 1);
          setCurrentIndex(newIndex);
          containerRef.current?.scrollTo({
            top: newIndex * window.innerHeight,
            behavior: 'smooth',
          });
        } else {
          // Swiped down
          const newIndex = Math.max(currentIndex - 1, 0);
          setCurrentIndex(newIndex);
          containerRef.current?.scrollTo({
            top: newIndex * window.innerHeight,
            behavior: 'smooth',
          });
        }
      }
    };

    const container = containerRef.current;
    window.addEventListener('keydown', handleKeyDown);
    if (container) {
      container.addEventListener('touchstart', handleTouchStart);
      container.addEventListener('touchend', handleTouchEnd);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (container) {
        container.removeEventListener('touchstart', handleTouchStart);
        container.removeEventListener('touchend', handleTouchEnd);
      }
    };
  }, [currentIndex, articles.length]);

  if (articles.length === 0) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-black">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-white/50"
        >
          <p className="text-lg mb-2">Loading news...</p>
          <div className="flex justify-center gap-1">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-2 h-2 rounded-full bg-white/30"
                animate={{ y: [0, -8, 0] }}
                transition={{
                  duration: 1.4,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
          </div>
        </motion.div>
      </div>
    );
  }

  const currentArticle = articles[currentIndex];

  return (
    <div className="relative h-screen w-full bg-black overflow-hidden">
      {/* Progress Bar */}
      <ProgressBar currentIndex={currentIndex} totalArticles={articles.length} />

      {/* Bilingual Switch */}
      <BilingualSwitch />

      {/* Main Scroll Container */}
      <div
        ref={containerRef}
        className="h-screen w-full overflow-y-scroll snap-mandatory snap-y scroll-smooth"
        style={{ scrollBehavior: 'smooth' }}
      >
        {articles.map((article, index) => (
          <div key={article.id} className="snap-center">
            <NewsCard
              article={article}
              isVisible={currentIndex === index}
            />
          </div>
        ))}
      </div>

      {/* Action Bar */}
      {currentArticle && (
        <ActionVerticalBar article={currentArticle} isVisible={true} />
      )}

      {/* Context Drawer */}
      {currentArticle && <ContextDrawer article={currentArticle} />}

      {/* Mobile Instructions */}
      {isMobile && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="fixed bottom-4 left-4 right-4 z-20 text-center text-white/50 text-xs"
        >
          <p>Scroll for more | Tap icons to interact</p>
        </motion.div>
      )}
    </div>
  );
}
