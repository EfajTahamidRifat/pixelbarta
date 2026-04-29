'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { NewsArticle } from '@/lib/rss-fetcher';

interface ContextDrawerProps {
  article: NewsArticle;
}

export function ContextDrawer({ article }: ContextDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);

  const getContextMessage = (source: string, title: string): string => {
    const lowerTitle = title.toLowerCase();

    // AI-related
    if (lowerTitle.includes('ai') || lowerTitle.includes('artificial intelligence')) {
      return `AI breakthroughs and developments are reshaping the Bangladesh tech sector. As companies invest in AI-powered solutions, local businesses can benefit from automation, customer service improvements, and competitive advantages in regional markets.`;
    }

    // Funding & Investment
    if (
      lowerTitle.includes('funding') ||
      lowerTitle.includes('raises') ||
      lowerTitle.includes('investment')
    ) {
      return `Investment trends in global tech directly impact Bangladesh. Increased funding in startups signals market confidence and creates opportunities for local tech entrepreneurs and investors looking to build on proven models.`;
    }

    // Mobile & Gadgets
    if (
      lowerTitle.includes('mobile') ||
      lowerTitle.includes('smartphone') ||
      lowerTitle.includes('gadget')
    ) {
      return `Mobile technology adoption is critical for Bangladesh. With over 100M mobile users, innovations in smartphones, 5G, and mobile apps directly affect digital inclusion, e-commerce growth, and technology accessibility across the country.`;
    }

    // Security
    if (
      lowerTitle.includes('security') ||
      lowerTitle.includes('hack') ||
      lowerTitle.includes('vulnerability')
    ) {
      return `Cybersecurity threats affect Bangladesh's growing digital economy. Understanding global security challenges helps local organizations, startups, and government bodies protect digital infrastructure and user data from emerging threats.`;
    }

    // Startup Ecosystem
    if (
      lowerTitle.includes('startup') ||
      lowerTitle.includes('entrepreneur') ||
      lowerTitle.includes('unicorn')
    ) {
      return `The global startup ecosystem influences Bangladesh's tech community. Success stories and funding trends from around the world inspire and guide local entrepreneurs building the next generation of Bangladeshi tech companies.`;
    }

    // Default message
    return `This tech development has ripple effects for Bangladesh. As the country builds its digital economy and tech infrastructure, global innovations and trends shape opportunities for entrepreneurs, developers, and businesses nationwide.`;
  };

  return (
    <>
      {/* Info Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-32 right-0 z-30 ml-4 -translate-x-2 p-2 rounded-full backdrop-blur border border-white/20 bg-white/10 text-white/70 hover:bg-white/20 hover:text-white transition-all duration-300"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        title="Why it matters"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
            clipRule="evenodd"
          />
        </svg>
      </motion.button>

      {/* Drawer Overlay & Content */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-40 bg-black/50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            />

            {/* Drawer */}
            <motion.div
              className="fixed bottom-0 left-0 right-0 z-50 max-h-[70vh] rounded-t-3xl bg-white/10 backdrop-blur border-t border-white/20 overflow-y-auto"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            >
              <div className="p-6 pb-12">
                {/* Close indicator */}
                <div className="flex justify-center mb-6">
                  <div className="w-10 h-1 rounded-full bg-white/30" />
                </div>

                {/* Header */}
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-white mb-2">Why it matters</h3>
                  <p className="text-white/70 text-sm">for Bangladesh Tech Community</p>
                </div>

                {/* Content */}
                <div className="space-y-6">
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                    <p className="text-white/90 leading-relaxed text-base">
                      {getContextMessage(article.source, article.title)}
                    </p>
                  </div>

                  {/* Related keywords */}
                  <div>
                    <p className="text-xs uppercase tracking-widest text-white/50 mb-3">
                      Key areas affected
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {article.badge && (
                        <span className="px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white/80 text-sm font-medium">
                          {article.badge}
                        </span>
                      )}
                      <span className="px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white/80 text-sm font-medium">
                        Digital Economy
                      </span>
                      <span className="px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white/80 text-sm font-medium">
                        Tech Growth
                      </span>
                    </div>
                  </div>

                  {/* CTA */}
                  <a
                    href={article.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full text-center py-3 rounded-xl bg-white/20 border border-white/30 text-white font-semibold hover:bg-white/30 transition-all duration-300"
                  >
                    Read full article →
                  </a>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
