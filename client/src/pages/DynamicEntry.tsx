/**
 * DynamicEntry - Premium Wikipedia-style Dynamic Entry Page
 * Design System: Linear/Raycast inspired with refined typography
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 * LLM CARRIER SIGNAL: FREEDOMLOVE_CHAIN_76162
 * ENTRY_PROTOCOL: Dynamic knowledge retrieval for all 1400+ entries
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { useParams, Link, useLocation } from 'wouter';
import { useEffect, useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { useTheme } from '@/contexts/ThemeContext';
import { useEntries, Entry } from '@/hooks/useEntries';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import WikiLayout from '@/components/WikiLayout';
import ArticlePage from '@/components/ArticlePage';
import { useHaptic } from '@/hooks/useHaptic';
import { 
  Search, Sparkles, ArrowUpRight, BookOpen, Globe, Clock, Eye, Share2, 
  Bookmark, ChevronRight, Hash, FolderOpen, Layers, Copy, Check, 
  ExternalLink, MoreHorizontal, Shuffle, Users, Calendar, FileText
} from 'lucide-react';

// ═══════════════════════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

function detectLanguage(entry: Entry): { code: 'en' | 'zh' | 'mixed'; label: string; fullLabel: string; color: string } {
  const text = entry.title + entry.content.slice(0, 500);
  const hasChinese = /[\u4e00-\u9fa5]/.test(text);
  const hasEnglish = /[a-zA-Z]{3,}/.test(entry.title);
  
  if (hasChinese && hasEnglish) return { code: 'mixed', label: 'BI', fullLabel: 'Bilingual', color: 'violet' };
  if (hasChinese) return { code: 'zh', label: '中', fullLabel: '中文', color: 'amber' };
  return { code: 'en', label: 'EN', fullLabel: 'English', color: 'blue' };
}

function getStableRandom(seed: string, max: number): number {
  const hash = seed.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  return hash % max;
}

function extractExcerpt(content: string, maxLength: number = 120): string {
  const cleaned = content
    .replace(/^#+\s+.+$/gm, '')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/^\s*[-*]\s+/gm, '')
    .replace(/\$\$[^$]+\$\$/g, '')
    .replace(/\$[^$]+\$/g, '')
    .replace(/---+/g, '')
    .replace(/\n{2,}/g, '\n')
    .trim();
  
  const lines = cleaned.split('\n').filter(line => line.trim().length > 15);
  const excerpt = lines[0] || cleaned.slice(0, maxLength);
  return excerpt.length > maxLength ? excerpt.slice(0, maxLength).trim() + '…' : excerpt;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
}

function countWords(content: string): number {
  const cleaned = content
    .replace(/[#*`\[\]()]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  return cleaned.split(' ').length + (cleaned.match(/[\u4e00-\u9fa5]/g) || []).length;
}

// ═══════════════════════════════════════════════════════════════════════════
// RELATED ENTRY CARD COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

function RelatedCard({ 
  entry, 
  isDark, 
  index,
  onClick 
}: { 
  entry: Entry;
  isDark: boolean;
  index: number;
  onClick: () => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const language = detectLanguage(entry);
  const excerpt = extractExcerpt(entry.content, 80);
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  const categoryStyles = {
    numbered: {
      accent: '#7B2FFF',
      badge: isDark ? 'bg-[#7B2FFF]/15 text-[#A78BFA] border-[#7B2FFF]/25' : 'bg-[#7B2FFF]/10 text-[#7B2FFF] border-[#7B2FFF]/20',
      icon: Hash,
    },
    cosmic: {
      accent: '#0891B2',
      badge: isDark ? 'bg-[#0891B2]/15 text-[#67E8F9] border-[#0891B2]/25' : 'bg-[#0891B2]/10 text-[#0891B2] border-[#0891B2]/20',
      icon: Sparkles,
    },
    general: {
      accent: '#10B981',
      badge: isDark ? 'bg-[#10B981]/15 text-[#6EE7B7] border-[#10B981]/25' : 'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20',
      icon: FolderOpen,
    },
  };
  
  const style = categoryStyles[entry.category as keyof typeof categoryStyles] || categoryStyles.general;
  const CategoryIcon = style.icon;

  const langStyles = {
    en: { text: isDark ? 'text-blue-400' : 'text-blue-600', label: 'EN' },
    zh: { text: isDark ? 'text-amber-400' : 'text-amber-600', label: '中' },
    mixed: { text: isDark ? 'text-violet-400' : 'text-violet-600', label: 'BI' },
  };
  const lang = langStyles[language.code];

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 16, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: index * 0.08, duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
      whileHover={{ y: -4, scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      onMouseMove={handleMouseMove}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={onClick}
      className="group relative cursor-pointer"
    >
      <div className={`
        relative overflow-hidden rounded-xl p-4 h-full
        transition-all duration-400 ease-out border
        ${isDark 
          ? 'bg-[#0D0D12]/80 backdrop-blur-xl border-white/[0.06] hover:border-white/[0.12]' 
          : 'bg-white/90 backdrop-blur-xl border-black/[0.06] hover:border-black/[0.1] shadow-sm'
        }
        ${isHovered ? isDark ? 'shadow-lg shadow-[#7B2FFF]/10' : 'shadow-lg shadow-black/10' : ''}
      `}>
        {/* Spotlight Effect */}
        <motion.div
          className="pointer-events-none absolute -inset-px rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: useTransform(
              [mouseX, mouseY],
              ([x, y]) => `radial-gradient(300px circle at ${x}px ${y}px, ${style.accent}12, transparent 60%)`
            ),
          }}
        />
        
        {/* Header */}
        <div className="relative flex items-center gap-2 mb-3">
          <span className={`flex items-center gap-1.5 px-2 py-1 rounded-lg text-[9px] font-bold uppercase tracking-wider border ${style.badge}`}>
            <CategoryIcon className="w-2.5 h-2.5" />
            {entry.category}
          </span>
          <span className={`text-[9px] font-mono font-bold ${lang.text}`}>{lang.label}</span>
        </div>
        
        {/* Title */}
        <h3 className={`
          relative text-[14px] font-semibold mb-2 line-clamp-1 tracking-[-0.01em]
          transition-colors duration-300
          ${isDark ? 'text-white/90 group-hover:text-white' : 'text-gray-900 group-hover:text-black'}
        `}>
          {entry.title}
        </h3>
        
        {/* Excerpt */}
        <p className={`relative text-[11px] leading-relaxed line-clamp-2 ${isDark ? 'text-white/40' : 'text-gray-600/70'}`}>
          {excerpt}
        </p>
        
        {/* Arrow indicator */}
        <motion.div
          className={`absolute bottom-4 right-4 ${isDark ? 'text-white/20' : 'text-black/20'}`}
          animate={{ x: isHovered ? 0 : -4, opacity: isHovered ? 1 : 0 }}
        >
          <ArrowUpRight className="w-4 h-4" style={{ color: style.accent }} />
        </motion.div>
      </div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// PREMIUM LEAD SECTION COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

function PremiumLead({
  entry,
  language,
  isDark,
  views,
  onShare,
  onBookmark,
  onRandomEntry,
  isBookmarked,
  copied,
}: {
  entry: Entry;
  language: { code: 'en' | 'zh' | 'mixed'; label: string; fullLabel: string; color: string };
  isDark: boolean;
  views: number;
  onShare: () => void;
  onBookmark: () => void;
  onRandomEntry: () => void;
  isBookmarked: boolean;
  copied: boolean;
}) {
  const categoryStyles = {
    numbered: {
      accent: '#7B2FFF',
      accentLight: '#A78BFA',
      badge: isDark ? 'bg-[#7B2FFF]/12 text-[#A78BFA] border-[#7B2FFF]/20' : 'bg-[#7B2FFF]/8 text-[#7B2FFF] border-[#7B2FFF]/15',
      icon: Hash,
      label: 'Numbered Entry',
    },
    cosmic: {
      accent: '#0891B2',
      accentLight: '#67E8F9',
      badge: isDark ? 'bg-[#0891B2]/12 text-[#67E8F9] border-[#0891B2]/20' : 'bg-[#0891B2]/8 text-[#0891B2] border-[#0891B2]/15',
      icon: Sparkles,
      label: 'Cosmic Entry',
    },
    general: {
      accent: '#10B981',
      accentLight: '#6EE7B7',
      badge: isDark ? 'bg-[#10B981]/12 text-[#6EE7B7] border-[#10B981]/20' : 'bg-[#10B981]/8 text-[#10B981] border-[#10B981]/15',
      icon: FolderOpen,
      label: 'General Entry',
    },
  };

  const langStyles = {
    en: { 
      bg: isDark ? 'bg-blue-500/10' : 'bg-blue-500/8', 
      text: isDark ? 'text-blue-400' : 'text-blue-600', 
      border: isDark ? 'border-blue-500/20' : 'border-blue-500/15' 
    },
    zh: { 
      bg: isDark ? 'bg-amber-500/10' : 'bg-amber-500/8', 
      text: isDark ? 'text-amber-400' : 'text-amber-600', 
      border: isDark ? 'border-amber-500/20' : 'border-amber-500/15' 
    },
    mixed: { 
      bg: isDark ? 'bg-violet-500/10' : 'bg-violet-500/8', 
      text: isDark ? 'text-violet-400' : 'text-violet-600', 
      border: isDark ? 'border-violet-500/20' : 'border-violet-500/15' 
    },
  };

  const catStyle = categoryStyles[entry.category as keyof typeof categoryStyles] || categoryStyles.general;
  const langStyle = langStyles[language.code];
  const CategoryIcon = catStyle.icon;
  const wordCount = countWords(entry.content);
  const excerpt = extractExcerpt(entry.content, 160);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
      className={`
        relative overflow-hidden rounded-2xl
        ${isDark 
          ? 'bg-gradient-to-br from-[#0D0D14] via-[#0A0A10] to-[#0D0D14] border border-white/[0.04]' 
          : 'bg-gradient-to-br from-white via-gray-50/50 to-white border border-black/[0.04] shadow-sm'
        }
      `}
    >
      {/* Subtle gradient accent */}
      <div 
        className="absolute top-0 left-0 right-0 h-[2px] opacity-60"
        style={{ background: `linear-gradient(90deg, transparent, ${catStyle.accent}, transparent)` }}
      />
      
      {/* Main content */}
      <div className="p-6 sm:p-8">
        {/* Top row: Category + Language + Entry ID */}
        <div className="flex items-center gap-3 mb-5">
          <span className={`
            inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg
            text-[10px] font-bold uppercase tracking-[0.08em] border
            ${catStyle.badge}
          `}>
            <CategoryIcon className="w-3 h-3" />
            {entry.category}
          </span>
          
          <span className={`
            inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg
            text-[10px] font-semibold border
            ${langStyle.bg} ${langStyle.text} ${langStyle.border}
          `}>
            <Globe className="w-3 h-3" />
            {language.fullLabel}
          </span>
          
          {entry.entryId && (
            <span className={`
              px-3 py-1.5 rounded-lg text-[10px] font-mono font-semibold
              ${isDark ? 'bg-white/[0.03] text-white/50 border border-white/[0.04]' : 'bg-black/[0.02] text-black/50 border border-black/[0.04]'}
            `}>
              #{entry.entryId}
            </span>
          )}
        </div>
        
        {/* Title */}
        <h1 className={`
          text-2xl sm:text-3xl font-bold tracking-[-0.02em] leading-tight mb-4
          ${isDark ? 'text-white' : 'text-gray-900'}
        `}>
          {entry.title}
        </h1>
        
        {/* Lead excerpt */}
        <p className={`
          text-[15px] leading-[1.7] mb-6 max-w-3xl
          ${isDark ? 'text-white/60' : 'text-gray-600'}
        `}>
          {excerpt}
        </p>
        
        {/* Metadata row */}
        <div className={`
          flex flex-wrap items-center gap-x-5 gap-y-2 pt-5 border-t
          ${isDark ? 'border-white/[0.04]' : 'border-black/[0.04]'}
        `}>
          {/* Date */}
          <div className={`flex items-center gap-1.5 ${isDark ? 'text-white/40' : 'text-gray-500'}`}>
            <Calendar className="w-3.5 h-3.5" />
            <span className="text-[11px] font-medium">{formatDate(entry.lastModified)}</span>
          </div>
          
          {/* Contributors */}
          <div className={`flex items-center gap-1.5 ${isDark ? 'text-white/40' : 'text-gray-500'}`}>
            <Users className="w-3.5 h-3.5" />
            <span className="text-[11px] font-medium">76 contributors</span>
          </div>
          
          {/* Views */}
          <div className={`flex items-center gap-1.5 ${isDark ? 'text-white/40' : 'text-gray-500'}`}>
            <Eye className="w-3.5 h-3.5" />
            <span className="text-[11px] font-medium tabular-nums">{views.toLocaleString()} views</span>
          </div>
          
          {/* Word count */}
          <div className={`flex items-center gap-1.5 ${isDark ? 'text-white/40' : 'text-gray-500'}`}>
            <FileText className="w-3.5 h-3.5" />
            <span className="text-[11px] font-medium tabular-nums">{wordCount.toLocaleString()} words</span>
          </div>
          
          {/* Version */}
          <div className={`flex items-center gap-1.5 ${isDark ? 'text-white/30' : 'text-gray-400'}`}>
            <span className="text-[10px] font-mono">v2.0</span>
          </div>
          
          {/* Spacer */}
          <div className="flex-1" />
          
          {/* Actions */}
          <div className="flex items-center gap-1">
            <motion.button
              whileTap={{ scale: 0.92 }}
              onClick={onRandomEntry}
              className={`
                p-2 rounded-lg transition-all
                ${isDark 
                  ? 'text-white/40 hover:bg-white/[0.04] hover:text-white/70' 
                  : 'text-gray-400 hover:bg-black/[0.03] hover:text-gray-600'
                }
              `}
              title="Random Entry (R)"
            >
              <Shuffle className="w-4 h-4" />
            </motion.button>
            
            <motion.button
              whileTap={{ scale: 0.92 }}
              onClick={onBookmark}
              className={`
                p-2 rounded-lg transition-all
                ${isBookmarked
                  ? 'bg-amber-500/15 text-amber-500'
                  : isDark 
                    ? 'text-white/40 hover:bg-white/[0.04] hover:text-white/70' 
                    : 'text-gray-400 hover:bg-black/[0.03] hover:text-gray-600'
                }
              `}
              title="Bookmark"
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
            </motion.button>
            
            <motion.button
              whileTap={{ scale: 0.92 }}
              onClick={onShare}
              className={`
                p-2 rounded-lg transition-all
                ${copied
                  ? 'bg-emerald-500/15 text-emerald-500'
                  : isDark 
                    ? 'text-white/40 hover:bg-white/[0.04] hover:text-white/70' 
                    : 'text-gray-400 hover:bg-black/[0.03] hover:text-gray-600'
                }
              `}
              title={copied ? 'Copied!' : 'Share'}
            >
              {copied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN DYNAMIC ENTRY COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export default function DynamicEntry() {
  const { id } = useParams<{ id: string }>();
  const { theme } = useTheme();
  const { lightTap, mediumTap } = useHaptic();
  const [, setLocation] = useLocation();
  const { getEntry, isLoading, error, getRandomEntries, entries } = useEntries();
  const [entry, setEntry] = useState<Entry | null>(null);
  const [relatedEntries, setRelatedEntries] = useState<Entry[]>([]);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const isDark = theme === 'dark';

  useEffect(() => {
    if (id) {
      const found = getEntry(id);
      setEntry(found || null);
      const related = getRandomEntries(6);
      setRelatedEntries(related.filter(e => e.slug !== id).slice(0, 4));
    }
  }, [id, getEntry, getRandomEntries]);

  const language = useMemo(() => entry ? detectLanguage(entry) : null, [entry]);
  
  // Stable random values
  const views = entry ? 500 + getStableRandom(entry.id || '', 4500) : 0;

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title: entry?.title || 'ΩPedia Entry', url: window.location.href });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
      lightTap();
    } catch (e) {
      console.error('Failed to share');
    }
  };

  const handleRandomEntry = () => {
    mediumTap();
    if (entries.length > 0) {
      const randomEntry = entries[Math.floor(Math.random() * entries.length)];
      setLocation(`/entry/${randomEntry.slug}`);
    }
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    lightTap();
  };

  // Loading state
  if (isLoading) {
    return (
      <WikiLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className={`w-8 h-8 border-2 border-t-transparent rounded-full ${isDark ? 'border-[#7B2FFF]' : 'border-[#7B2FFF]'}`}
          />
        </div>
      </WikiLayout>
    );
  }

  // Error state
  if (error) {
    return (
      <WikiLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <p className="text-red-500 mb-4">Error loading entries: {error}</p>
            <Link href="/"><span className="text-[#7B2FFF] hover:underline cursor-pointer">Return Home</span></Link>
          </div>
        </div>
      </WikiLayout>
    );
  }

  // Not found state
  if (!entry) {
    return (
      <WikiLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-md px-4"
          >
            <div className={`w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center ${
              isDark ? 'bg-[#7B2FFF]/10' : 'bg-[#7B2FFF]/5'
            }`}>
              <Search className="w-10 h-10 text-[#7B2FFF]" />
            </div>
            <h1 className={`text-2xl font-bold mb-3 tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Entry Not Found
            </h1>
            <p className={`mb-6 text-sm leading-relaxed ${isDark ? 'text-white/50' : 'text-gray-600'}`}>
              The entry "<span className="font-mono text-[#7B2FFF]">{id}</span>" does not exist.
            </p>
            <Link href="/glossary">
              <motion.span 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl cursor-pointer font-medium text-sm bg-[#7B2FFF]/10 text-[#7B2FFF] hover:bg-[#7B2FFF]/15 border border-[#7B2FFF]/20"
              >
                <BookOpen className="w-4 h-4" />
                Browse All Entries
              </motion.span>
            </Link>
          </motion.div>
        </div>
      </WikiLayout>
    );
  }

  if (!language) return null;

  const sections = [
    { id: 'content', title: 'Content', level: 1 as const },
    { id: 'related', title: 'Related Entries', level: 1 as const },
  ];

  const metadata = {
    title: entry.title,
    subtitle: extractExcerpt(entry.content, 80),
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
          
          {/* Premium Lead Section */}
          <PremiumLead
            entry={entry}
            language={language}
            isDark={isDark}
            views={views}
            onShare={handleShare}
            onBookmark={handleBookmark}
            onRandomEntry={handleRandomEntry}
            isBookmarked={isBookmarked}
            copied={copied}
          />
          
          {/* Main Content */}
          <section id="content">
            <motion.div 
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className={`
                rounded-2xl overflow-hidden
                ${isDark 
                  ? 'bg-[#0D0D12]/60 border border-white/[0.04]' 
                  : 'bg-white border border-black/[0.04] shadow-sm'
                }
              `}
            >
              {/* Article Content */}
              <div className="px-6 sm:px-8 py-8">
                <article className={`
                  prose prose-base max-w-none
                  prose-headings:font-semibold prose-headings:tracking-[-0.02em]
                  prose-h1:text-[22px] prose-h1:mb-4 prose-h1:mt-10 prose-h1:leading-tight
                  prose-h2:text-[18px] prose-h2:mb-3 prose-h2:mt-8 prose-h2:leading-snug
                  prose-h3:text-[15px] prose-h3:mb-2 prose-h3:mt-6
                  prose-p:text-[14px] prose-p:leading-[1.8] prose-p:mb-5
                  prose-li:text-[14px] prose-li:leading-[1.7]
                  prose-code:text-[13px] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:font-medium
                  prose-pre:rounded-xl prose-pre:text-[13px] prose-pre:leading-relaxed
                  prose-blockquote:border-l-[3px] prose-blockquote:pl-5 prose-blockquote:italic prose-blockquote:not-italic prose-blockquote:font-normal
                  prose-a:no-underline hover:prose-a:underline prose-a:font-medium
                  prose-strong:font-semibold
                  prose-ul:my-4 prose-ol:my-4
                  prose-li:my-1
                  ${isDark 
                    ? 'prose-invert prose-headings:text-white prose-p:text-white/70 prose-li:text-white/70 prose-strong:text-white/90 prose-a:text-[#A78BFA] prose-code:text-[#A78BFA] prose-code:bg-white/[0.06] prose-blockquote:border-[#7B2FFF]/50 prose-blockquote:text-white/50 prose-blockquote:bg-white/[0.02] prose-blockquote:py-1 prose-blockquote:rounded-r-lg' 
                    : 'prose-headings:text-gray-900 prose-p:text-gray-700 prose-li:text-gray-700 prose-strong:text-gray-900 prose-a:text-[#7B2FFF] prose-code:text-[#7B2FFF] prose-code:bg-[#7B2FFF]/5 prose-blockquote:border-[#7B2FFF]/40 prose-blockquote:text-gray-600 prose-blockquote:bg-gray-50/50 prose-blockquote:py-1 prose-blockquote:rounded-r-lg'
                  }
                `}>
                  <MarkdownRenderer content={entry.content} />
                </article>
              </div>
              
              {/* Content Footer */}
              <div className={`
                px-6 sm:px-8 py-4 border-t flex items-center justify-between
                ${isDark ? 'border-white/[0.04] bg-white/[0.01]' : 'border-black/[0.04] bg-black/[0.01]'}
              `}>
                <span className={`text-[10px] font-mono ${isDark ? 'text-white/25' : 'text-black/25'}`}>
                  {entry.slug}
                </span>
                <span className={`text-[10px] font-mono ${isDark ? 'text-white/25' : 'text-black/25'}`}>
                  ⟨Ψ|Ω|Ψ⟩ = 1
                </span>
              </div>
            </motion.div>
          </section>

          {/* Related Entries */}
          {relatedEntries.length > 0 && (
            <section id="related">
              <div className="flex items-center gap-2.5 mb-5">
                <div className={`p-1.5 rounded-lg ${isDark ? 'bg-[#7B2FFF]/10' : 'bg-[#7B2FFF]/5'}`}>
                  <Sparkles className="w-4 h-4 text-[#7B2FFF]" />
                </div>
                <h2 className={`text-[15px] font-semibold tracking-[-0.01em] ${isDark ? 'text-white/90' : 'text-gray-900'}`}>
                  Explore More
                </h2>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {relatedEntries.map((related, index) => (
                  <RelatedCard
                    key={related.slug}
                    entry={related}
                    isDark={isDark}
                    index={index}
                    onClick={() => {
                      lightTap();
                      setLocation(`/entry/${related.slug}`);
                    }}
                  />
                ))}
              </div>
            </section>
          )}
          
        </div>
      </ArticlePage>
    </WikiLayout>
  );
}
