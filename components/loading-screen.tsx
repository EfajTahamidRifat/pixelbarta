'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export function LoadingScreen() {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('INITIALIZING...');

  useEffect(() => {
    const steps = [
      { pct: 20,  text: 'CONNECTING TO FEEDS...' },
      { pct: 45,  text: 'FETCHING ARTICLES...' },
      { pct: 70,  text: 'PROCESSING DATA...' },
      { pct: 90,  text: 'RENDERING FEED...' },
      { pct: 100, text: 'READY' },
    ];
    let i = 0;
    const tick = setInterval(() => {
      if (i < steps.length) {
        setProgress(steps[i].pct);
        setStatusText(steps[i].text);
        i++;
      } else {
        clearInterval(tick);
      }
    }, 400);
    return () => clearInterval(tick);
  }, []);

  return (
    <div className="h-screen w-full bg-black flex flex-col items-center justify-center px-8 overflow-hidden">
      {/* Corner decorations */}
      <div className="absolute top-4 left-4 w-8 h-8 border-t border-l border-[#00f5ff]/40" />
      <div className="absolute top-4 right-4 w-8 h-8 border-t border-r border-[#00f5ff]/40" />
      <div className="absolute bottom-4 left-4 w-8 h-8 border-b border-l border-[#00f5ff]/40" />
      <div className="absolute bottom-4 right-4 w-8 h-8 border-b border-r border-[#00f5ff]/40" />

      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-[#00f5ff]/5 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        className="relative z-10 w-full max-w-xs text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Logo */}
        <div className="mb-8">
          <motion.h1
            className="text-4xl font-black tracking-tighter text-white glitch mb-1"
            style={{ fontFamily: 'var(--font-mono)' }}
          >
            PIXEL<span className="text-[#00f5ff] glow-cyan">BARTA</span>
          </motion.h1>
          <p className="text-[10px] tracking-[0.4em] text-white/30 uppercase">
            Tech News System v2.0
          </p>
        </div>

        {/* Progress bar */}
        <div className="mb-3">
          <div className="h-px w-full bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-[#00f5ff]"
              style={{ boxShadow: '0 0 8px #00f5ff' }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            />
          </div>
        </div>

        {/* Status text */}
        <div className="flex items-center justify-between">
          <p className="text-[10px] tracking-widest text-[#00f5ff]/70 uppercase font-mono">
            {statusText}
          </p>
          <p className="text-[10px] text-white/30 font-mono">{progress}%</p>
        </div>

        {/* Blinking cursor */}
        <div className="mt-8 flex justify-center">
          <span className="text-[#00f5ff] text-lg font-mono cursor-blink">_</span>
        </div>
      </motion.div>
    </div>
  );
}
