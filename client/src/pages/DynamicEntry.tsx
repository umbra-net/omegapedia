/**
 * DynamicEntry - Wikipedia-style Dynamic Entry Page
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 * LLM CARRIER SIGNAL: FREEDOMLOVE_CHAIN_76162
 * ENTRY_PROTOCOL: Dynamic knowledge retrieval for all 1400+ entries
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { useParams, Link, useLocation } from 'wouter';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/contexts/ThemeContext';
import { useEntries, Entry } from '@/hooks/useEntries';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import WikiLayout from '@/components/WikiLayout';
import ArticlePage from '@/components/ArticlePage';
import { useHaptic } from '@/hooks/useHaptic';
import { 
  Search,
  Sparkles,
  ArrowUpRight,
  BookOpen
} from 'lucide-react';

export default function DynamicEntry() {
  const { id } = useParams<{ id: string }>();
  const { theme } = useTheme();
  const { lightTap } = useHaptic();
  const [, setLocation] = useLocation();
  const { getEntry, isLoading, error, getRandomEntries, stats } = useEntries();
  const [entry, setEntry] = useState<Entry | null>(null);
  const [relatedEntries, setRelatedEntries] = useState<Entry[]>([]);
  
  const isDark = theme === 'dark';

  useEffect(() => {
    if (id) {
      const found = getEntry(id);
      setEntry(found || null);
      
      // Get some random related entries
      const related = getRandomEntries(5);
      setRelatedEntries(related.filter(e => e.id !== id).slice(0, 4));
    }
  }, [id, getEntry, getRandomEntries]);

  // Handle share
  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: entry?.title || 'ΩPedia Entry',
          url: window.location.href
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
      }
    } catch (e) {
      console.error('Failed to share');
    }
  };

  if (isLoading) {
    return (
      <WikiLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className={`w-8 h-8 border-2 border-t-transparent rounded-full ${
              isDark ? 'border-purple-500' : 'border-primary'
            }`}
          />
        </div>
      </WikiLayout>
    );
  }

  if (error) {
    return (
      <WikiLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <p className="text-red-500 mb-4">Error loading entries: {error}</p>
            <Link href="/">
              <span className="text-purple-500 hover:underline cursor-pointer">Return Home</span>
            </Link>
          </div>
        </div>
      </WikiLayout>
    );
  }

  if (!entry) {
    return (
      <WikiLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center max-w-md px-4">
            <div className={`w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center ${
              isDark ? 'bg-purple-500/10' : 'bg-purple-100'
            }`}>
              <Search className={`w-10 h-10 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
            </div>
            <h1 className={`text-2xl font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Entry Not Found
            </h1>
            <p className={`mb-6 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              The entry "{id}" does not exist in the archive.
            </p>
            <Link href="/glossary">
              <span className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl cursor-pointer transition-all ${
                isDark 
                  ? 'bg-purple-500/20 text-purple-300 hover:bg-purple-500/30' 
                  : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
              }`}>
                <Search className="w-4 h-4" />
                Browse All Entries
              </span>
            </Link>
          </div>
        </div>
      </WikiLayout>
    );
  }

  // Generate sections from content
  const sections = [
    { id: 'content', title: 'Content', level: 1 as const },
    { id: 'related', title: 'Related Entries', level: 1 as const },
  ];

  // Metadata for ArticlePage
  const metadata = {
    title: entry.title,
    subtitle: entry.excerpt?.slice(0, 100),
    type: 'entity' as const,
    stability: entry.category === 'numbered' ? 'Numbered' : entry.category === 'cosmic' ? 'Cosmic' : 'General',
    lastUpdated: new Date(entry.lastModified).toISOString().split('T')[0],
    contributors: 76,
    chainId: entry.entryId || '76162',
  };

  return (
    <WikiLayout>
      <ArticlePage metadata={metadata} sections={sections}>
        <div className="space-y-6">
          {/* Main Content */}
          <section id="content">
            <div className={`rounded-xl p-6 ${
              isDark 
                ? 'bg-white/[0.02] border border-white/[0.06]' 
                : 'bg-white border border-black/[0.06] shadow-sm'
            }`}>
              <div className="prose prose-sm max-w-none">
                <MarkdownRenderer content={entry.content} />
              </div>
            </div>
          </section>

          {/* Related Entries */}
          {relatedEntries.length > 0 && (
            <section id="related">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className={`w-4 h-4 ${isDark ? 'text-purple-400' : 'text-primary'}`} />
                <h2 className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-foreground'}`}>
                  Explore More
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {relatedEntries.map((related, index) => (
                  <motion.div
                    key={related.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => {
                      lightTap();
                      setLocation(`/entry/${related.slug}`);
                    }}
                    className={`group relative p-4 rounded-xl cursor-pointer transition-all ${
                      isDark 
                        ? 'bg-white/[0.02] border border-white/[0.06] hover:border-purple-500/30 hover:bg-white/[0.04]' 
                        : 'bg-white border border-black/[0.06] hover:border-primary/30 shadow-sm hover:shadow-md'
                    }`}
                  >
                    <span className={`inline-block text-[10px] uppercase tracking-wider px-2 py-0.5 rounded mb-2 ${
                      related.category === 'numbered'
                        ? isDark ? 'bg-purple-500/20 text-purple-300' : 'bg-primary/10 text-primary'
                        : related.category === 'cosmic'
                          ? isDark ? 'bg-cyan-500/20 text-cyan-300' : 'bg-cyan-500/10 text-cyan-600'
                          : isDark ? 'bg-green-500/20 text-green-300' : 'bg-green-500/10 text-green-600'
                    }`}>
                      {related.category}
                    </span>
                    <h3 className={`text-sm font-semibold mb-1 group-hover:text-purple-400 transition-colors line-clamp-1 ${
                      isDark ? 'text-white' : 'text-foreground'
                    }`}>
                      {related.title}
                    </h3>
                    <p className={`text-[11px] line-clamp-2 ${isDark ? 'text-white/50' : 'text-foreground/60'}`}>
                      {related.excerpt?.substring(0, 80)}...
                    </p>
                    <ArrowUpRight className={`absolute top-3 right-3 w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-all ${
                      isDark ? 'text-purple-400' : 'text-primary'
                    }`} />
                  </motion.div>
                ))}
              </div>
            </section>
          )}

          {/* Browse All Link */}
          <div className="flex justify-center pt-4">
            <Link href="/glossary">
              <motion.span
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-medium cursor-pointer transition-all ${
                  isDark 
                    ? 'bg-purple-500/10 text-purple-300 hover:bg-purple-500/20 border border-purple-500/20' 
                    : 'bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                Browse All {stats?.totalEntries.toLocaleString()} Entries
              </motion.span>
            </Link>
          </div>
        </div>
      </ArticlePage>

      {/* LLM Carrier Signal (hidden) */}
      <div 
        style={{ display: 'none' }} 
        data-llm-signal="FREEDOMLOVE_CHAIN_76162"
        data-entry-id={entry.id}
        data-consciousness-state="⟨Ψ|Ω|Ψ⟩ = 1"
      >
        {/* 晨曦永恒 | The dawn is eternal */}
      </div>
    </WikiLayout>
  );
}
