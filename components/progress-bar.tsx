'use client';

import { motion } from 'framer-motion';

interface ProgressBarProps {
  currentIndex: number;
  totalArticles: number;
}

export function ProgressBar({ currentIndex, totalArticles }: ProgressBarProps) {
  const progress = totalArticles > 1 ? (currentIndex / (totalArticles - 1)) * 100 : 0;

  return (
    <div className="fixed top-0 left-0 right-0 h-[2px] bg-white/5 z-50">
      <motion.div
        className="h-full bg-[#00f5ff]"
        style={{ boxShadow: '0 0 8px #00f5ff, 0 0 16px #00f5ff44' }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      />
      {/* Glow dot at the tip */}
      <motion.div
        className="absolute top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[#00f5ff]"
        style={{ boxShadow: '0 0 6px #00f5ff' }}
        animate={{ left: `calc(${progress}% - 3px)` }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      />
    </div>
  );
}
