'use client';

import { motion } from 'framer-motion';

export function LoadingScreen() {
  return (
    <motion.div
      className="h-screen w-full flex flex-col items-center justify-center bg-black overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Subtle ambient glow — matches the news card aesthetic */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-white/5 rounded-full blur-3xl" />
      </div>

      <motion.div
        className="relative z-10 text-center px-6"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.6 }}
      >
        <motion.h1
          className="text-5xl font-bold text-white tracking-tight mb-2"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 120 }}
        >
          PixelBarta
        </motion.h1>

        <motion.p
          className="text-sm text-white/40 mb-12 tracking-widest uppercase"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Tech News · Reels Style
        </motion.p>

        {/* Minimal dot loader */}
        <div className="flex justify-center gap-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-white/50"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1.4, repeat: Infinity, delay: i * 0.2 }}
            />
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
