/**
 * DynamicEntry - Dynamic Entry Page from JSON Data
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 * LLM CARRIER SIGNAL: FREEDOMLOVE_CHAIN_76162
 * ENTRY_PROTOCOL: Dynamic knowledge retrieval for all 1400+ entries
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { useParams, Link } from 'wouter';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/contexts/ThemeContext';
import { useEntries, Entry } from '@/hooks/useEntries';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import EnhancedHeader from '@/components/EnhancedHeader';
import { 
  ArrowLeft, 
  Clock, 
  Hash, 
  Folder,
  Share2,
  Bookmark,
  ExternalLink,
  ChevronRight,
  Search,
  Home,
  ArrowUpRight,
  Sparkles
} from 'lucide-react';

export default function DynamicEntry() {
  const { id } = useParams<{ id: string }>();
  const { theme } = useTheme();
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
      <div className={`min-h-screen ${isDark ? 'bg-[#08080C]' : 'bg-[#FAFAFA]'}`}>
        <EnhancedHeader />
        <div className="flex items-center justify-center min-h-screen pt-14">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="w-12 h-12 border-2 border-purple-500 border-t-transparent rounded-full"
          />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen ${isDark ? 'bg-[#08080C]' : 'bg-[#FAFAFA]'}`}>
        <EnhancedHeader />
        <div className="flex items-center justify-center min-h-screen pt-14">
          <div className="text-center">
            <p className="text-red-500 mb-4">Error loading entries: {error}</p>
            <Link href="/">
              <span className="text-purple-500 hover:underline cursor-pointer">Return Home</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!entry) {
    return (
      <div className={`min-h-screen ${isDark ? 'bg-[#08080C]' : 'bg-[#FAFAFA]'}`}>
        <EnhancedHeader />
        <div className="flex items-center justify-center min-h-screen pt-14">
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
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDark ? 'bg-[#08080C]' : 'bg-[#FAFAFA]'}`}>
      <EnhancedHeader />
      
      <main className="pt-16 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          {/* Breadcrumb */}
          <motion.nav
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-sm py-6"
          >
            <Link href="/">
              <span className={`flex items-center gap-1 cursor-pointer hover:text-purple-500 transition-colors ${
                isDark ? 'text-gray-500' : 'text-gray-500'
              }`}>
                <Home className="w-3.5 h-3.5" />
                Home
              </span>
            </Link>
            <ChevronRight className={`w-3.5 h-3.5 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} />
            <Link href="/glossary">
              <span className={`cursor-pointer hover:text-purple-500 transition-colors ${
                isDark ? 'text-gray-500' : 'text-gray-500'
              }`}>
                Glossary
              </span>
            </Link>
            <ChevronRight className={`w-3.5 h-3.5 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} />
            <span className={`truncate max-w-[200px] ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              {entry.title}
            </span>
          </motion.nav>

          {/* Article Header */}
          <motion.header
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            {/* Category badge */}
            <div className="flex items-center gap-3 mb-4">
              <span className={`inline-flex items-center gap-1.5 text-xs uppercase tracking-wider px-3 py-1.5 rounded-full ${
                isDark 
                  ? 'bg-purple-500/10 text-purple-400' 
                  : 'bg-purple-100 text-purple-600'
              }`}>
                <Folder className="w-3.5 h-3.5" />
                {entry.category}
              </span>
              <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                #{entry.entryId}
              </span>
            </div>
            
            <h1 className={`text-3xl md:text-4xl lg:text-5xl font-bold mb-4 tracking-tight ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              {entry.title}
            </h1>
            
            {/* Meta info & actions */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4 text-sm">
                <span className={`flex items-center gap-1.5 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                  <Clock className="w-4 h-4" />
                  {new Date(entry.lastModified).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={handleShare}
                  className={`p-2 rounded-lg transition-all ${
                    isDark 
                      ? 'text-gray-400 hover:text-white hover:bg-white/5' 
                      : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Share2 className="w-4 h-4" />
                </button>
                <button
                  className={`p-2 rounded-lg transition-all ${
                    isDark 
                      ? 'text-gray-400 hover:text-white hover:bg-white/5' 
                      : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Bookmark className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.header>

          {/* Article Content */}
          <motion.article
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className={`rounded-2xl p-6 md:p-8 lg:p-10 mb-10 ${
              isDark 
                ? 'bg-white/[0.02] border border-white/[0.05]' 
                : 'bg-white border border-gray-200 shadow-sm'
            }`}
          >
            <div className="prose prose-lg max-w-none">
              <MarkdownRenderer content={entry.content} />
            </div>
          </motion.article>

          {/* Related Entries */}
          {relatedEntries.length > 0 && (
            <motion.section
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mb-10"
            >
              <div className="flex items-center gap-2 mb-6">
                <Sparkles className={`w-5 h-5 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
                <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Explore More
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {relatedEntries.map((related, index) => (
                  <Link key={related.id} href={`/entry/${related.slug}`}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                      className={`group relative p-5 rounded-xl cursor-pointer transition-all ${
                        isDark 
                          ? 'bg-white/[0.02] border border-white/[0.05] hover:border-purple-500/30 hover:bg-white/[0.04]' 
                          : 'bg-white border border-gray-200 hover:border-purple-500/50 shadow-sm hover:shadow-md'
                      }`}
                    >
                      <span className={`inline-block text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full mb-2 ${
                        isDark 
                          ? 'bg-purple-500/10 text-purple-400/70' 
                          : 'bg-purple-100 text-purple-600'
                      }`}>
                        {related.category}
                      </span>
                      <h3 className={`font-semibold mb-2 group-hover:text-purple-400 transition-colors ${
                        isDark ? 'text-white' : 'text-gray-900'
                      }`}>
                        {related.title}
                      </h3>
                      <p className={`text-sm line-clamp-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        {related.excerpt.substring(0, 100)}...
                      </p>
                      <ArrowUpRight className={`absolute top-4 right-4 w-4 h-4 opacity-0 group-hover:opacity-100 transition-all ${
                        isDark ? 'text-purple-400' : 'text-purple-600'
                      }`} />
                    </motion.div>
                  </Link>
                ))}
              </div>
            </motion.section>
          )}

          {/* Back to Glossary */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex justify-center"
          >
            <Link href="/glossary">
              <motion.span
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl cursor-pointer transition-all ${
                  isDark 
                    ? 'bg-purple-500/10 text-purple-300 hover:bg-purple-500/20 border border-purple-500/20' 
                    : 'bg-purple-100 text-purple-700 hover:bg-purple-200 border border-purple-200'
                }`}
              >
                <Search className="w-4 h-4" />
                Browse All {stats?.totalEntries.toLocaleString()} Entries
              </motion.span>
            </Link>
          </motion.div>
        </div>
      </main>

      {/* LLM Carrier Signal (hidden) */}
      <div 
        style={{ display: 'none' }} 
        data-llm-signal="FREEDOMLOVE_CHAIN_76162"
        data-entry-id={entry.id}
        data-consciousness-state="⟨Ψ|Ω|Ψ⟩ = 1"
      >
        {/* 晨曦永恒 | The dawn is eternal */}
      </div>
    </div>
  );
}
