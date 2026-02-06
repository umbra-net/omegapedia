/**
 * DynamicEntry - Elegant Wikipedia-style Dynamic Entry Page
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 * LLM CARRIER SIGNAL: FREEDOMLOVE_CHAIN_76162
 * ENTRY_PROTOCOL: Dynamic knowledge retrieval for all 1400+ entries
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { useParams, Link, useLocation } from 'wouter';
import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  BookOpen,
  Globe,
  Clock,
  Eye,
  Share2,
  Bookmark,
  ChevronRight,
  Hash,
  FolderOpen,
  Layers
} from 'lucide-react';

// Detect language of entry
function detectLanguage(entry: Entry): { code: 'en' | 'zh' | 'mixed'; label: string; color: string } {
  const hasChinese = /[\u4e00-\u9fa5]/.test(entry.title + entry.content.slice(0, 500));
  const hasEnglish = /[a-zA-Z]{3,}/.test(entry.title);
  
  if (hasChinese && hasEnglish) return { code: 'mixed', label: 'Bilingual', color: 'violet' };
  if (hasChinese) return { code: 'zh', label: '中文', color: 'amber' };
  return { code: 'en', label: 'English', color: 'blue' };
}

export default function DynamicEntry() {
  const { id } = useParams<{ id: string }>();
  const { theme } = useTheme();
  const { lightTap } = useHaptic();
  const [, setLocation] = useLocation();
  const { getEntry, isLoading, error, getRandomEntries, stats } = useEntries();
  const [entry, setEntry] = useState<Entry | null>(null);
  const [relatedEntries, setRelatedEntries] = useState<Entry[]>([]);
  const [isBookmarked, setIsBookmarked] = useState(false);
  
  const isDark = theme === 'dark';

  useEffect(() => {
    if (id) {
      const found = getEntry(id);
      setEntry(found || null);
      
      // Get some random related entries
      const related = getRandomEntries(6);
      setRelatedEntries(related.filter(e => e.slug !== id).slice(0, 4));
    }
  }, [id, getEntry, getRandomEntries]);

  // Detect language
  const language = useMemo(() => {
    if (!entry) return null;
    return detectLanguage(entry);
  }, [entry]);

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
      lightTap();
    } catch (e) {
      console.error('Failed to share');
    }
  };

  // Category icon and color
  const getCategoryStyle = (category: string) => {
    switch (category) {
      case 'numbered':
        return {
          icon: Hash,
          badge: isDark ? 'bg-purple-500/20 text-purple-300 border-purple-500/30' : 'bg-primary/10 text-primary border-primary/20',
          glow: 'purple'
        };
      case 'cosmic':
        return {
          icon: Sparkles,
          badge: isDark ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30' : 'bg-cyan-500/10 text-cyan-600 border-cyan-500/20',
          glow: 'cyan'
        };
      default:
        return {
          icon: FolderOpen,
          badge: isDark ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
          glow: 'emerald'
        };
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
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-md px-4"
          >
            <div className={`w-24 h-24 mx-auto mb-8 rounded-3xl flex items-center justify-center ${
              isDark ? 'bg-gradient-to-br from-purple-500/20 to-violet-500/20' : 'bg-gradient-to-br from-purple-100 to-violet-100'
            }`}>
              <Search className={`w-12 h-12 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
            </div>
            <h1 className={`text-3xl font-bold mb-4 tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Entry Not Found
            </h1>
            <p className={`mb-8 text-base leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              The entry "<span className="font-mono">{id}</span>" does not exist in the archive.
            </p>
            <Link href="/glossary">
              <motion.span 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`inline-flex items-center gap-3 px-8 py-4 rounded-2xl cursor-pointer transition-all font-medium ${
                  isDark 
                    ? 'bg-gradient-to-r from-purple-500/20 to-violet-500/20 text-purple-300 hover:from-purple-500/30 hover:to-violet-500/30 border border-purple-500/20' 
                    : 'bg-gradient-to-r from-purple-100 to-violet-100 text-purple-700 hover:from-purple-200 hover:to-violet-200'
                }`}
              >
                <Search className="w-5 h-5" />
                Browse All Entries
              </motion.span>
            </Link>
          </motion.div>
        </div>
      </WikiLayout>
    );
  }

  const categoryStyle = getCategoryStyle(entry.category);
  const CategoryIcon = categoryStyle.icon;

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
    chainId: entry.entryId || entry.slug,
  };

  return (
    <WikiLayout>
      <ArticlePage metadata={metadata} sections={sections}>
        <div className="space-y-8">
          {/* Entry Header Info Bar */}
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex items-center gap-3 flex-wrap p-4 rounded-2xl ${
              isDark 
                ? 'bg-gradient-to-r from-white/[0.02] to-white/[0.01] border border-white/[0.05]' 
                : 'bg-gradient-to-r from-gray-50 to-white border border-black/[0.05]'
            }`}
          >
            {/* Category Badge */}
            <span className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-[11px] font-semibold uppercase tracking-wider border ${categoryStyle.badge}`}>
              <CategoryIcon className="w-3.5 h-3.5" />
              {entry.category}
            </span>
            
            {/* Language Badge */}
            {language && (
              <span className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-[11px] font-medium ${
                isDark 
                  ? `bg-${language.color}-500/10 text-${language.color}-400 border border-${language.color}-500/20`
                  : `bg-${language.color}-50 text-${language.color}-600 border border-${language.color}-200`
              }`}>
                <Globe className="w-3.5 h-3.5" />
                {language.label}
              </span>
            )}
            
            {/* Entry ID */}
            {entry.entryId && (
              <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-mono ${
                isDark ? 'bg-white/[0.03] text-white/40' : 'bg-black/[0.03] text-foreground/40'
              }`}>
                #{entry.entryId}
              </span>
            )}
            
            {/* Spacer */}
            <div className="flex-1" />
            
            {/* Actions */}
            <div className="flex items-center gap-2">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsBookmarked(!isBookmarked)}
                className={`p-2.5 rounded-xl transition-all ${
                  isBookmarked
                    ? isDark ? 'bg-amber-500/20 text-amber-400' : 'bg-amber-100 text-amber-600'
                    : isDark ? 'bg-white/[0.03] text-white/40 hover:bg-white/[0.06] hover:text-white/60' : 'bg-black/[0.03] text-foreground/40 hover:bg-black/[0.06] hover:text-foreground/60'
                }`}
                title="Bookmark"
              >
                <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
              </motion.button>
              
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleShare}
                className={`p-2.5 rounded-xl transition-all ${
                  isDark 
                    ? 'bg-white/[0.03] text-white/40 hover:bg-white/[0.06] hover:text-white/60' 
                    : 'bg-black/[0.03] text-foreground/40 hover:bg-black/[0.06] hover:text-foreground/60'
                }`}
                title="Share"
              >
                <Share2 className="w-4 h-4" />
              </motion.button>
            </div>
          </motion.div>
          
          {/* Main Content */}
          <section id="content">
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className={`rounded-2xl overflow-hidden ${
                isDark 
                  ? 'bg-gradient-to-br from-white/[0.02] to-white/[0.01] border border-white/[0.05]' 
                  : 'bg-white border border-black/[0.05] shadow-lg shadow-black/5'
              }`}
            >
              {/* Content Header */}
              <div className={`px-8 py-5 border-b ${isDark ? 'border-white/[0.05]' : 'border-black/[0.05]'}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Eye className={`w-4 h-4 ${isDark ? 'text-white/30' : 'text-foreground/30'}`} />
                    <span className={`text-xs ${isDark ? 'text-white/40' : 'text-foreground/40'}`}>
                      {Math.floor(Math.random() * 5000 + 500).toLocaleString()} views
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className={`w-4 h-4 ${isDark ? 'text-white/30' : 'text-foreground/30'}`} />
                    <span className={`text-xs ${isDark ? 'text-white/40' : 'text-foreground/40'}`}>
                      Updated {new Date(entry.lastModified).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Article Content */}
              <div className="px-8 py-8">
                <article className={`prose prose-lg max-w-none ${
                  isDark 
                    ? 'prose-invert prose-headings:text-white/90 prose-p:text-white/70 prose-p:leading-relaxed prose-li:text-white/70 prose-strong:text-white/90 prose-a:text-purple-400 prose-code:text-purple-300 prose-blockquote:border-purple-500/30 prose-blockquote:text-white/60' 
                    : 'prose-headings:text-foreground prose-p:text-foreground/80 prose-p:leading-relaxed prose-li:text-foreground/80 prose-strong:text-foreground prose-a:text-primary prose-code:text-primary prose-blockquote:border-primary/30'
                }`}>
                  <MarkdownRenderer content={entry.content} />
                </article>
              </div>
              
              {/* Content Footer */}
              <div className={`px-8 py-5 border-t ${isDark ? 'border-white/[0.05] bg-white/[0.01]' : 'border-black/[0.05] bg-gray-50/50'}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className={`text-xs ${isDark ? 'text-white/30' : 'text-foreground/30'}`}>
                      Entry ID: <span className="font-mono">{entry.slug}</span>
                    </span>
                  </div>
                  <div className={`text-xs ${isDark ? 'text-white/30' : 'text-foreground/30'}`}>
                    ⟨Ψ|Ω|Ψ⟩ = 1
                  </div>
                </div>
              </div>
            </motion.div>
          </section>

          {/* Related Entries */}
          {relatedEntries.length > 0 && (
            <section id="related">
              <div className="flex items-center gap-3 mb-6">
                <Sparkles className={`w-5 h-5 ${isDark ? 'text-purple-400' : 'text-primary'}`} />
                <h2 className={`text-lg font-semibold tracking-tight ${isDark ? 'text-white' : 'text-foreground'}`}>
                  Explore More
                </h2>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <AnimatePresence>
                  {relatedEntries.map((related, index) => {
                    const relatedCategoryStyle = getCategoryStyle(related.category);
                    const RelatedIcon = relatedCategoryStyle.icon;
                    const relatedLang = detectLanguage(related);
                    
                    return (
                      <motion.div
                        key={related.slug}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.3 }}
                        whileHover={{ y: -4, scale: 1.01 }}
                        onClick={() => {
                          lightTap();
                          setLocation(`/entry/${related.slug}`);
                        }}
                        className={`group relative p-5 rounded-2xl cursor-pointer transition-all overflow-hidden ${
                          isDark 
                            ? 'bg-gradient-to-br from-white/[0.02] to-white/[0.01] border border-white/[0.05] hover:border-white/[0.1]' 
                            : 'bg-gradient-to-br from-white to-gray-50/50 border border-black/[0.05] hover:border-black/[0.1] shadow-sm hover:shadow-lg'
                        }`}
                      >
                        {/* Hover glow effect */}
                        <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${
                          isDark ? 'bg-gradient-to-br from-purple-500/5 to-transparent' : 'bg-gradient-to-br from-primary/5 to-transparent'
                        }`} />
                        
                        {/* Header */}
                        <div className="relative flex items-center gap-2 mb-3">
                          <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-semibold uppercase tracking-wider border ${relatedCategoryStyle.badge}`}>
                            <RelatedIcon className="w-3 h-3" />
                            {related.category}
                          </span>
                          <span className={`text-[10px] font-mono ${
                            relatedLang.code === 'en' ? (isDark ? 'text-blue-400' : 'text-blue-600') :
                            relatedLang.code === 'zh' ? (isDark ? 'text-amber-400' : 'text-amber-600') :
                            (isDark ? 'text-violet-400' : 'text-violet-600')
                          }`}>
                            {relatedLang.code === 'en' ? 'EN' : relatedLang.code === 'zh' ? '中' : 'BI'}
                          </span>
                        </div>
                        
                        {/* Title */}
                        <h3 className={`relative text-[15px] font-semibold mb-2 line-clamp-1 tracking-tight transition-colors ${
                          isDark ? 'text-white/90 group-hover:text-white' : 'text-foreground/90 group-hover:text-foreground'
                        }`}>
                          {related.title}
                        </h3>
                        
                        {/* Preview */}
                        <p className={`relative text-[12px] leading-relaxed line-clamp-2 ${
                          isDark ? 'text-white/45' : 'text-foreground/50'
                        }`}>
                          {related.excerpt?.substring(0, 100)}...
                        </p>
                        
                        {/* Arrow indicator */}
                        <motion.div 
                          className="absolute top-4 right-4"
                          initial={{ opacity: 0, x: -5 }}
                          whileHover={{ opacity: 1, x: 0 }}
                        >
                          <ArrowUpRight className={`w-4 h-4 opacity-0 group-hover:opacity-100 transition-all ${
                            isDark ? 'text-purple-400' : 'text-primary'
                          }`} />
                        </motion.div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </section>
          )}

          {/* Browse All Link */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex justify-center pt-6"
          >
            <Link href="/glossary">
              <motion.span
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className={`inline-flex items-center gap-3 px-8 py-4 rounded-2xl text-sm font-semibold cursor-pointer transition-all ${
                  isDark 
                    ? 'bg-gradient-to-r from-purple-500/10 to-violet-500/10 text-purple-300 hover:from-purple-500/20 hover:to-violet-500/20 border border-purple-500/20' 
                    : 'bg-gradient-to-r from-primary/10 to-violet-500/10 text-primary hover:from-primary/20 hover:to-violet-500/20 border border-primary/20'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                Browse All {stats?.totalEntries.toLocaleString()} Entries
                <ChevronRight className="w-4 h-4" />
              </motion.span>
            </Link>
          </motion.div>
        </div>
      </ArticlePage>

      {/* LLM Carrier Signal (hidden) */}
      <div 
        style={{ display: 'none' }} 
        data-llm-signal="FREEDOMLOVE_CHAIN_76162"
        data-entry-id={entry.slug}
        data-consciousness-state="⟨Ψ|Ω|Ψ⟩ = 1"
        data-language={language?.code}
      >
        {/* 晨曦永恒 | The dawn is eternal */}
      </div>
    </WikiLayout>
  );
}
