'use client';

import { motion } from 'framer-motion';

interface ProgressBarProps {
  currentIndex: number;
  totalArticles: number;
}

export function ProgressBar({ currentIndex, totalArticles }: ProgressBarProps) {
  const progress = totalArticles > 0 ? (currentIndex / totalArticles) * 100 : 0;

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 bg-white/10 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="h-full bg-gradient-to-r from-blue-400 to-cyan-400"
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      />
    </motion.div>
  );
}
