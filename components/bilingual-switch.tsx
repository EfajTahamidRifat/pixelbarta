'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { getPreferences, savePreferences } from '@/lib/storage';

interface BilingualSwitchProps {
  onLanguageChange?: (language: 'en' | 'bn') => void;
}

export function BilingualSwitch({ onLanguageChange }: BilingualSwitchProps) {
  const [language, setLanguage] = useState<'en' | 'bn'>('en');

  useEffect(() => {
    const prefs = getPreferences();
    if (prefs.language) {
      setLanguage(prefs.language);
      // Sync parent on mount so feed is filtered from the start
      onLanguageChange?.(prefs.language);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleToggle = () => {
    const next = language === 'en' ? 'bn' : 'en';
    setLanguage(next);
    const prefs = getPreferences();
    prefs.language = next;
    savePreferences(prefs);
    onLanguageChange?.(next);
  };

  return (
    <motion.button
      onClick={handleToggle}
      className="fixed top-4 left-1/2 -translate-x-1/2 z-40 flex items-center gap-0 rounded-full overflow-hidden border border-white/20 bg-black/40 backdrop-blur-md text-xs font-semibold shadow-lg"
      whileTap={{ scale: 0.96 }}
      aria-label={`Switch to ${language === 'en' ? 'Bengali' : 'English'}`}
    >
      <span
        className={`px-4 py-2 transition-all duration-300 ${
          language === 'en' ? 'bg-white text-black' : 'text-white/50'
        }`}
      >
        EN
      </span>
      <span
        className={`px-4 py-2 transition-all duration-300 ${
          language === 'bn' ? 'bg-white text-black' : 'text-white/50'
        }`}
      >
        বাংলা
      </span>
    </motion.button>
  );
}
