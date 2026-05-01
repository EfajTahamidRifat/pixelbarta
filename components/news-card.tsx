'use client';

import { motion } from 'framer-motion';
import { NewsArticle } from '@/lib/rss-fetcher';
import { markAsRead } from '@/lib/storage';
import { useEffect, useState } from 'react';

interface NewsCardProps {
  article: NewsArticle;
  isVisible: boolean;
}

// Deterministic gradient per source — fallback when no image
const SOURCE_GRADIENTS: Record<string, string> = {
  'The Verge':      'linear-gradient(135deg,#1a0a2e 0%,#0d1b2a 60%,#0a1628 100%)',
  'TechCrunch':     'linear-gradient(135deg,#1a0d00 0%,#0d0800 60%,#000000 100%)',
  'Wired':          'linear-gradient(135deg,#001a0d 0%,#000d06 60%,#000000 100%)',
  '9to5Google':     'linear-gradient(135deg,#0a001a 0%,#05000d 60%,#000000 100%)',
  'Bangla Tribune': 'linear-gradient(135deg,#1a0000 0%,#0d0000 60%,#000000 100%)',
  'DigiBangla':     'linear-gradient(135deg,#001a1a 0%,#000d0d 60%,#000000 100%)',
};

const SOURCE_ACCENT: Record<string, string> = {
  'The Verge':      '#00f5ff',
  'TechCrunch':     '#ff6600',
  'Wired':          '#00ff88',
  '9to5Google':     '#4285f4',
  'Bangla Tribune': '#ff0080',
  'DigiBangla':     '#00f5ff',
};

export function NewsCard({ article, isVisible }: NewsCardProps) {
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (isVisible) markAsRead(article.id);
  }, [isVisible, article.id]);

  useEffect(() => {
    setImageError(false);
  }, [article.id]);

  const accent = SOURCE_ACCENT[article.source] ?? '#00f5ff';
  const gradient = SOURCE_GRADIENTS[article.source] ?? 'linear-gradient(135deg,#0d1b2a,#000)';

  const formattedDate = new Date(article.pubDate).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric',
  });

  return (
    <motion.div
      animate={{ opacity: isVisible ? 1 : 0.3 }}
      transition={{ duration: 0.4 }}
      className="relative h-[100svh] w-full flex flex-col justify-end overflow-hidden bg-black"
      style={{ scrollSnapAlign: 'start' }}
    >
      {/* BG image or gradient */}
      <div className="absolute inset-0">
        {!imageError && article.image ? (
          <img
            src={article.image}
            alt=""
            aria-hidden="true"
            onError={() => setImageError(true)}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="h-full w-full" style={{ background: gradient }} />
        )}

        {/* Multi-stop overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
        {/* Top darkening so top-bar UI is always readable */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black/70 to-transparent" />
      </div>

      {/* Digital grid lines overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,245,255,1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,245,255,1) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Corner brackets — digital HUD feel */}
      <div className="absolute top-16 left-4 pointer-events-none">
        <div className="w-6 h-6 border-t border-l" style={{ borderColor: `${accent}60` }} />
      </div>
      <div className="absolute top-16 right-16 pointer-events-none">
        <div className="w-6 h-6 border-t border-r" style={{ borderColor: `${accent}60` }} />
      </div>

      {/* Article number HUD — top left */}
      <div
        className="absolute top-[72px] left-5 text-[10px] tracking-[0.3em] uppercase pointer-events-none"
        style={{ color: `${accent}80`, fontFamily: 'var(--font-mono)' }}
      >
        {article.source}
      </div>

      {/* Content panel */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={isVisible ? { y: 0, opacity: 1 } : { y: 30, opacity: 0 }}
        transition={{ delay: 0.1, duration: 0.4, ease: 'easeOut' }}
        className="relative z-10 px-5 pb-8 pt-5"
        style={{ paddingRight: '72px' }} /* room for action bar */
      >
        {/* Badge + date row */}
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          {article.badge && (
            <span
              className="text-[10px] font-bold tracking-widest uppercase px-2.5 py-1"
              style={{
                color: accent,
                border: `1px solid ${accent}44`,
                background: `${accent}11`,
                fontFamily: 'var(--font-mono)',
                boxShadow: `0 0 8px ${accent}22`,
              }}
            >
              {article.badge}
            </span>
          )}
          <span
            className="text-[10px] tracking-widest"
            style={{ color: 'rgba(255,255,255,0.35)', fontFamily: 'var(--font-mono)' }}
          >
            {formattedDate}
          </span>
          {/* Live indicator */}
          <span className="flex items-center gap-1 ml-auto">
            <span
              className="w-1.5 h-1.5 rounded-full pulse-neon"
              style={{ background: accent, boxShadow: `0 0 4px ${accent}` }}
            />
            <span
              className="text-[10px] tracking-widest"
              style={{ color: `${accent}90`, fontFamily: 'var(--font-mono)' }}
            >
              LIVE
            </span>
          </span>
        </div>

        {/* Accent line */}
        <div
          className="w-8 h-px mb-3"
          style={{ background: accent, boxShadow: `0 0 6px ${accent}` }}
        />

        {/* Title */}
        <h1 className="text-[clamp(1.2rem,5vw,1.75rem)] font-bold leading-[1.25] mb-3 text-white tracking-tight">
          {article.title}
        </h1>

        {/* Description */}
        {article.description && (
          <p className="text-[13px] text-white/50 leading-relaxed line-clamp-2 mb-4">
            {article.description}
          </p>
        )}

        {/* Read more CTA */}
        <a
          href={article.link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-[12px] font-bold tracking-widest uppercase transition-all duration-200"
          style={{
            color: accent,
            fontFamily: 'var(--font-mono)',
            textShadow: `0 0 8px ${accent}88`,
          }}
        >
          <span>READ FULL STORY</span>
          <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M1 6h10M7 2l4 4-4 4"/>
          </svg>
        </a>
      </motion.div>
    </motion.div>
  );
}
