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
      onLanguageChange?.(prefs.language);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleToggle = (lang: 'en' | 'bn') => {
    if (lang === language) return;
    setLanguage(lang);
    const prefs = getPreferences();
    prefs.language = lang;
    savePreferences(prefs);
    onLanguageChange?.(lang);
  };

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-40">
      {/* Outer border glow */}
      <div
        className="relative flex rounded-sm overflow-hidden"
        style={{
          background: 'rgba(0,0,0,0.8)',
          border: '1px solid rgba(0,245,255,0.25)',
          boxShadow: '0 0 12px rgba(0,245,255,0.1)',
        }}
      >
        {(['en', 'bn'] as const).map((lang) => (
          <button
            key={lang}
            onClick={() => handleToggle(lang)}
            className="relative px-5 py-2 text-[11px] font-bold tracking-[0.2em] uppercase transition-colors duration-200"
            style={{
              color: language === lang ? '#000' : 'rgba(255,255,255,0.35)',
              fontFamily: 'var(--font-mono)',
            }}
          >
            {language === lang && (
              <motion.div
                layoutId="lang-pill"
                className="absolute inset-0 bg-[#00f5ff]"
                style={{ boxShadow: '0 0 12px #00f5ff' }}
                transition={{ type: 'spring', stiffness: 300, damping: 28 }}
              />
            )}
            <span className="relative z-10">{lang === 'en' ? 'EN' : 'বাংলা}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
