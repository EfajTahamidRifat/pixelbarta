'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { NewsArticle } from '@/lib/rss-fetcher';

interface ContextDrawerProps {
  article: NewsArticle;
}

function getContextMessage(title: string): string {
  const t = title.toLowerCase();
  if (t.includes('ai') || t.includes('machine learning') || t.includes('artificial intelligence'))
    return "AI breakthroughs are reshaping Bangladesh's tech sector. Local firms can leverage automation, smarter CX, and regional competitive advantages as this space matures.";
  if (t.includes('funding') || t.includes('raises') || t.includes('investment') || t.includes('valuation'))
    return "Global investment signals matter for Bangladesh. Increased tech funding creates upstream opportunities for local founders and engineers building on proven models.";
  if (t.includes('mobile') || t.includes('smartphone') || t.includes('5g') || t.includes('android'))
    return "With 100M+ mobile users, smartphone and 5G innovations directly shape digital inclusion, e-commerce growth, and connectivity across Bangladesh.";
  if (t.includes('security') || t.includes('hack') || t.includes('breach') || t.includes('vulnerability'))
    return "Cybersecurity developments affect Bangladesh's growing digital economy. Understanding global threats helps local organisations protect infrastructure and user data.";
  if (t.includes('startup') || t.includes('unicorn') || t.includes('ipo'))
    return "Global startup milestones inspire and benchmark the next wave of Bangladeshi tech founders and early-stage companies.";
  return "This tech development creates ripple effects for Bangladesh's digital economy. Global innovations shape the playbook for entrepreneurs and developers building locally.";
}

export function ContextDrawer({ article }: ContextDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Trigger — sits below action bar */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed right-3 z-30 flex items-center justify-center w-11 h-11 transition-all duration-200"
        style={{
          bottom: '44px',
          background: 'rgba(0,0,0,0.6)',
          border: '1px solid rgba(255,255,255,0.1)',
        }}
        whileTap={{ scale: 0.88 }}
        aria-label="Why this matters"
      >
        <span
          className="text-[11px] font-black tracking-widest"
          style={{ color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-mono)' }}
        >
          ⓘ
        </span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-40"
              style={{ background: 'rgba(0,0,0,0.75)' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            {/* Drawer */}
            <motion.div
              className="fixed bottom-0 left-0 right-0 z-50 overflow-y-auto"
              style={{
                maxHeight: '75vh',
                background: '#060606',
                borderTop: '1px solid rgba(0,245,255,0.3)',
                boxShadow: '0 -8px 40px rgba(0,245,255,0.08)',
              }}
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 240 }}
            >
              {/* Top handle area */}
              <div className="sticky top-0 z-10 flex flex-col items-center pt-3 pb-3"
                style={{ background: '#060606', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-10 h-0.5 rounded-full mb-3"
                  style={{ background: 'rgba(255,255,255,0.15)' }}
                  aria-label="Close"
                />
                <div className="flex items-center gap-2">
                  <span
                    className="text-[10px] tracking-[0.3em] uppercase"
                    style={{ color: '#00f5ff', fontFamily: 'var(--font-mono)' }}
                  >
                    // WHY IT MATTERS
                  </span>
                  <div className="w-1.5 h-1.5 rounded-full bg-[#00f5ff] pulse-neon"
                    style={{ boxShadow: '0 0 6px #00f5ff' }} />
                </div>
              </div>

              <div className="px-5 pt-4 pb-10">
                {/* Article title */}
                <h3 className="text-base font-bold text-white leading-snug mb-4 line-clamp-2">
                  {article.title}
                </h3>

                {/* Context block */}
                <div
                  className="p-4 mb-5 text-sm leading-relaxed"
                  style={{
                    background: 'rgba(0,245,255,0.04)',
                    border: '1px solid rgba(0,245,255,0.15)',
                    color: 'rgba(255,255,255,0.7)',
                    borderLeft: '3px solid #00f5ff',
                  }}
                >
                  {getContextMessage(article.title)}
                </div>

                {/* Tags */}
                <div className="mb-6">
                  <p
                    className="text-[10px] tracking-[0.25em] uppercase mb-3"
                    style={{ color: 'rgba(255,255,255,0.3)', fontFamily: 'var(--font-mono)' }}
                  >
                    // IMPACT AREAS
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      article.badge,
                      'Digital Economy',
                      'Tech Growth',
                      'Bangladesh',
                    ].filter(Boolean).map((tag) => (
                      <span
                        key={tag}
                        className="text-[11px] font-bold tracking-widest uppercase px-2.5 py-1"
                        style={{
                          color: 'rgba(0,245,255,0.8)',
                          border: '1px solid rgba(0,245,255,0.2)',
                          background: 'rgba(0,245,255,0.06)',
                          fontFamily: 'var(--font-mono)',
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* CTA */}
                <a
                  href={article.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3.5 text-[12px] font-bold tracking-widest uppercase transition-opacity hover:opacity-80"
                  style={{
                    background: '#00f5ff',
                    color: '#000',
                    fontFamily: 'var(--font-mono)',
                    boxShadow: '0 0 20px rgba(0,245,255,0.3)',
                  }}
                >
                  READ FULL ARTICLE
                  <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M1 6h10M7 2l4 4-4 4"/>
                  </svg>
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
