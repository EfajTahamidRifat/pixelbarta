'use client';

import { motion } from 'framer-motion';

interface ProgressBarProps {
  currentIndex: number;
  totalArticles: number;
}

export function ProgressBar({ currentIndex, totalArticles }: ProgressBarProps) {
  // Fix: divide by (total - 1) so last article = 100%
  const progress = totalArticles > 1 ? (currentIndex / (totalArticles - 1)) * 100 : 0;

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-0.5 bg-white/10 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="h-full bg-gradient-to-r from-white/60 to-white/90"
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      />
    </motion.div>
  );
}
