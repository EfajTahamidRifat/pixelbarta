'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { NewsArticle } from '@/lib/rss-fetcher';

interface ContextDrawerProps {
  article: NewsArticle;
}

function getContextMessage(title: string): string {
  const t = title.toLowerCase();
  if (t.includes('ai') || t.includes('artificial intelligence') || t.includes('machine learning'))
    return 'AI breakthroughs are reshaping Bangladesh\'s tech sector. Local businesses can benefit from automation, smarter customer service, and competitive advantages in regional markets.';
  if (t.includes('funding') || t.includes('raises') || t.includes('investment'))
    return 'Global investment trends directly impact Bangladesh. Increased startup funding signals market confidence and creates opportunities for local entrepreneurs to build on proven models.';
  if (t.includes('mobile') || t.includes('smartphone') || t.includes('5g'))
    return 'With over 100M mobile users, innovations in smartphones and 5G directly affect digital inclusion, e-commerce growth, and technology accessibility across Bangladesh.';
  if (t.includes('security') || t.includes('hack') || t.includes('vulnerability'))
    return 'Cybersecurity threats affect Bangladesh\'s growing digital economy. Understanding global risks helps local organisations protect digital infrastructure and user data.';
  if (t.includes('startup') || t.includes('unicorn'))
    return 'Global startup success stories inspire and guide local entrepreneurs building the next generation of Bangladeshi tech companies.';
  return 'This tech development has ripple effects for Bangladesh. As the country builds its digital economy, global innovations shape opportunities for entrepreneurs and developers nationwide.';
}

export function ContextDrawer({ article }: ContextDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Trigger — positioned below action bar buttons, no overlap */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed right-4 bottom-10 z-30 flex items-center justify-center w-11 h-11 rounded-full backdrop-blur-md border border-white/20 bg-black/30 text-white/60 hover:text-white hover:bg-white/20 transition-all duration-200 shadow-lg"
        whileTap={{ scale: 0.9 }}
        aria-label="Why this matters"
        title="Why it matters"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path fillRule="evenodd" d="M12 2a10 10 0 110 20A10 10 0 0112 2zm0 9a1 1 0 00-1 1v4a1 1 0 102 0v-4a1 1 0 00-1-1zm0-4a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd"/>
        </svg>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            />

            {/* Drawer */}
            <motion.div
              className="fixed bottom-0 left-0 right-0 z-50 max-h-[72vh] rounded-t-2xl bg-zinc-900/95 backdrop-blur-xl border-t border-white/10 overflow-y-auto"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 220 }}
            >
              {/* Drag handle */}
              <div className="sticky top-0 flex justify-center pt-3 pb-2 bg-zinc-900/95">
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-10 h-1 rounded-full bg-white/20"
                  aria-label="Close drawer"
                />
              </div>

              <div className="px-5 pt-2 pb-10">
                <div className="mb-5">
                  <p className="text-[11px] uppercase tracking-widest text-white/40 mb-1">Why it matters</p>
                  <h3 className="text-lg font-bold text-white leading-snug line-clamp-2">{article.title}</h3>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-5">
                  <p className="text-white/80 leading-relaxed text-sm">
                    {getContextMessage(article.title)}
                  </p>
                </div>

                {/* Tags */}
                <div className="mb-5">
                  <p className="text-[11px] uppercase tracking-widest text-white/40 mb-2.5">Key areas affected</p>
                  <div className="flex flex-wrap gap-2">
                    {article.badge && (
                      <span className="px-3 py-1 rounded-full bg-white/10 border border-white/15 text-white/75 text-xs font-medium">
                        {article.badge}
                      </span>
                    )}
                    <span className="px-3 py-1 rounded-full bg-white/10 border border-white/15 text-white/75 text-xs font-medium">Digital Economy</span>
                    <span className="px-3 py-1 rounded-full bg-white/10 border border-white/15 text-white/75 text-xs font-medium">Tech Growth</span>
                    <span className="px-3 py-1 rounded-full bg-white/10 border border-white/15 text-white/75 text-xs font-medium">Bangladesh</span>
                  </div>
                </div>

                <a
                  href={article.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-white text-black text-sm font-semibold hover:bg-white/90 transition-colors"
                >
                  Read full article
                  <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 8h10M9 4l4 4-4 4"/>
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
