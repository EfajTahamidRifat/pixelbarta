'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

interface BilingualSwitchProps {
  onLanguageChange?: (language: 'en' | 'bn') => void;
}

export function BilingualSwitch({ onLanguageChange }: BilingualSwitchProps) {
  const [language, setLanguage] = useState<'en' | 'bn'>('en');

  useEffect(() => {
    // Load from localStorage
    if (typeof window !== 'undefined') {
      try {
        const prefs = JSON.parse(localStorage.getItem('pixelbarta_preferences') || '{}');
        if (prefs.language) {
          setLanguage(prefs.language);
        }
      } catch (error) {
        console.error('[v0] Failed to load language preference:', error);
      }
    }
  }, []);

  const handleToggle = () => {
    const newLanguage = language === 'en' ? 'bn' : 'en';
    setLanguage(newLanguage);
    
    // Save to localStorage
    if (typeof window !== 'undefined') {
      try {
        const prefs = JSON.parse(localStorage.getItem('pixelbarta_preferences') || '{}');
        prefs.language = newLanguage;
        localStorage.setItem('pixelbarta_preferences', JSON.stringify(prefs));
      } catch (error) {
        console.error('[v0] Failed to save language preference:', error);
      }
    }

    onLanguageChange?.(newLanguage);
  };

  return (
    <motion.button
      onClick={handleToggle}
      className="fixed top-6 right-6 z-40 px-4 py-2 rounded-full backdrop-blur border border-white/20 bg-white/10 text-white font-semibold text-sm hover:bg-white/20 transition-all duration-300"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.span
        key={language}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{ duration: 0.3 }}
      >
        {language === 'en' ? (
          <span>EN / <span className="text-gray-300">বাং</span></span>
        ) : (
          <span><span className="text-gray-300">EN</span> / বাং</span>
        )}
      </motion.span>
    </motion.button>
  );
}
