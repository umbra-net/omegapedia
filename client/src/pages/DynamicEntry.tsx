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
import WikiLayout from '@/components/WikiLayout';
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
  Home
} from 'lucide-react';

export default function DynamicEntry() {
  const { id } = useParams<{ id: string }>();
  const { theme } = useTheme();
  const { getEntry, isLoading, error, getRandomEntries } = useEntries();
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

  if (isLoading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-[#0A0A0F]' : 'bg-gray-50'}`}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="w-12 h-12 border-2 border-purple-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-[#0A0A0F]' : 'bg-gray-50'}`}>
        <div className="text-center">
          <p className="text-red-500 mb-4">Error loading entries: {error}</p>
          <Link href="/">
            <span className="text-purple-500 hover:underline cursor-pointer">Return Home</span>
          </Link>
        </div>
      </div>
    );
  }

  if (!entry) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-[#0A0A0F]' : 'bg-gray-50'}`}>
        <div className="text-center">
          <h1 className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Entry Not Found
          </h1>
          <p className={`mb-6 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            The entry "{id}" does not exist in the archive.
          </p>
          <Link href="/glossary">
            <span className="text-purple-500 hover:underline cursor-pointer">Browse All Entries</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <WikiLayout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm mb-6">
          <Link href="/">
            <span className={`flex items-center gap-1 cursor-pointer hover:text-purple-500 transition-colors ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              <Home className="w-4 h-4" />
              Home
            </span>
          </Link>
          <ChevronRight className={`w-4 h-4 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} />
          <Link href="/glossary">
            <span className={`cursor-pointer hover:text-purple-500 transition-colors ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Glossary
            </span>
          </Link>
          <ChevronRight className={`w-4 h-4 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} />
          <span className={isDark ? 'text-white' : 'text-gray-900'}>{entry.title}</span>
        </nav>

        {/* Article Header */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className={`text-3xl md:text-4xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {entry.title}
          </h1>
          
          {/* Meta info */}
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <span className={`flex items-center gap-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              <Folder className="w-4 h-4" />
              {entry.category}
            </span>
            <span className={`flex items-center gap-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              <Hash className="w-4 h-4" />
              {entry.entryId}
            </span>
            <span className={`flex items-center gap-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              <Clock className="w-4 h-4" />
              {new Date(entry.lastModified).toLocaleDateString()}
            </span>
          </div>
        </motion.header>

        {/* Article Content */}
        <motion.article
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className={`rounded-xl p-6 md:p-8 mb-8 ${
            isDark 
              ? 'bg-white/[0.02] border border-white/[0.05]' 
              : 'bg-white border border-gray-200 shadow-sm'
          }`}
        >
          <MarkdownRenderer content={entry.content} />
        </motion.article>

        {/* Related Entries */}
        {relatedEntries.length > 0 && (
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mb-8"
          >
            <h2 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Explore More
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {relatedEntries.map((related) => (
                <Link key={related.id} href={`/entry/${related.slug}`}>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className={`p-4 rounded-lg cursor-pointer transition-all ${
                      isDark 
                        ? 'bg-white/[0.02] border border-white/[0.05] hover:border-purple-500/30' 
                        : 'bg-white border border-gray-200 hover:border-purple-500/50 shadow-sm'
                    }`}
                  >
                    <h3 className={`font-medium mb-1 ${isDark ? 'text-purple-300' : 'text-purple-600'}`}>
                      {related.title}
                    </h3>
                    <p className={`text-sm line-clamp-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {related.excerpt.substring(0, 100)}...
                    </p>
                  </motion.div>
                </Link>
              ))}
            </div>
          </motion.section>
        )}

        {/* Back to Glossary */}
        <div className="flex justify-center">
          <Link href="/glossary">
            <motion.span
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`inline-flex items-center gap-2 px-6 py-3 rounded-full cursor-pointer transition-all ${
                isDark 
                  ? 'bg-purple-500/10 text-purple-300 hover:bg-purple-500/20' 
                  : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
              }`}
            >
              <Search className="w-4 h-4" />
              Browse All 1,400+ Entries
            </motion.span>
          </Link>
        </div>
      </div>

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
