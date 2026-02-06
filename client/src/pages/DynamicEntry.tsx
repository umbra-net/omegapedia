/**
 * DynamicEntry - Premium Wikipedia-style Dynamic Entry Page
 * Design System: Full-width content, clear typography hierarchy, language switching
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
  ExternalLink, MoreHorizontal, Shuffle, Users, Calendar, FileText,
  ChevronDown
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

// Extract content sections by language
function extractLanguageSections(content: string): { 
  en: string; 
  zh: string; 
  ja: string;
  es: string;
  all: string;
} {
  const sections = {
    en: '',
    zh: '',
    ja: '',
    es: '',
    all: content
  };
  
  // Try to extract English section
  const enMatch = content.match(/(?:^|\n)(?:English|EN)\s*\n([\s\S]*?)(?=\n(?:中文|日本語|Español|Русский|Deutsch|Français)|$)/i);
  if (enMatch) sections.en = enMatch[1].trim();
  
  // Try to extract Chinese section
  const zhMatch = content.match(/(?:^|\n)中文\s*\n([\s\S]*?)(?=\n(?:English|EN|日本語|Español|Русский|Deutsch|Français)|$)/i);
  if (zhMatch) sections.zh = zhMatch[1].trim();
  
  // Try to extract Japanese section
  const jaMatch = content.match(/(?:^|\n)日本語\s*\n([\s\S]*?)(?=\n(?:English|EN|中文|Español|Русский|Deutsch|Français)|$)/i);
  if (jaMatch) sections.ja = jaMatch[1].trim();
  
  // Try to extract Spanish section
  const esMatch = content.match(/(?:^|\n)Español\s*\n([\s\S]*?)(?=\n(?:English|EN|中文|日本語|Русский|Deutsch|Français)|$)/i);
  if (esMatch) sections.es = esMatch[1].trim();
  
  return sections;
}

// ═══════════════════════════════════════════════════════════════════════════
// LANGUAGE SWITCHER COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

const LANGUAGES = [
  { code: 'all', label: 'All', fullLabel: 'All Languages', flag: '🌐' },
  { code: 'en', label: 'EN', fullLabel: 'English', flag: '🇬🇧' },
  { code: 'zh', label: '中', fullLabel: '中文', flag: '🇨🇳' },
  { code: 'ja', label: '日', fullLabel: '日本語', flag: '🇯🇵' },
  { code: 'es', label: 'ES', fullLabel: 'Español', flag: '🇪🇸' },
];

function LanguageSwitcher({
  selectedLang,
  onSelect,
  availableLangs,
  isDark,
}: {
  selectedLang: string;
  onSelect: (lang: string) => void;
  availableLangs: string[];
  isDark: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const { lightTap } = useHaptic();
  
  const currentLang = LANGUAGES.find(l => l.code === selectedLang) || LANGUAGES[0];
  
  return (
    <div className="relative">
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          lightTap();
          setIsOpen(!isOpen);
        }}
        className={`
          flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium
          transition-all duration-200 border
          ${isDark 
            ? 'bg-white/[0.03] border-white/[0.06] hover:bg-white/[0.06] text-white/80' 
            : 'bg-white border-black/[0.06] hover:bg-black/[0.02] text-gray-700 shadow-sm'
          }
        `}
      >
        <Globe className="w-4 h-4" />
        <span>{currentLang.fullLabel}</span>
        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </motion.button>
      
      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: 4, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 4, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className={`
                absolute left-0 top-full mt-2 w-48 rounded-xl z-50 overflow-hidden
                ${isDark 
                  ? 'bg-[#0D0D14] border border-white/[0.08] shadow-2xl' 
                  : 'bg-white border border-black/[0.08] shadow-xl'
                }
              `}
            >
              {LANGUAGES.map((lang) => {
                const isAvailable = lang.code === 'all' || availableLangs.includes(lang.code);
                const isSelected = selectedLang === lang.code;
                
                return (
                  <button
                    key={lang.code}
                    onClick={() => {
                      if (isAvailable) {
                        onSelect(lang.code);
                        setIsOpen(false);
                        lightTap();
                      }
                    }}
                    disabled={!isAvailable}
                    className={`
                      w-full flex items-center gap-3 px-4 py-3 text-sm transition-all
                      ${isSelected
                        ? isDark 
                          ? 'bg-[#7B2FFF]/15 text-[#A78BFA]' 
                          : 'bg-[#7B2FFF]/10 text-[#7B2FFF]'
                        : isAvailable
                          ? isDark 
                            ? 'text-white/70 hover:bg-white/[0.04]' 
                            : 'text-gray-700 hover:bg-black/[0.02]'
                          : isDark
                            ? 'text-white/20 cursor-not-allowed'
                            : 'text-gray-300 cursor-not-allowed'
                      }
                    `}
                  >
                    <span className="text-base">{lang.flag}</span>
                    <span className="flex-1 text-left font-medium">{lang.fullLabel}</span>
                    {isSelected && (
                      <Check className="w-4 h-4" />
                    )}
                    {!isAvailable && (
                      <span className="text-[10px] opacity-50">N/A</span>
                    )}
                  </button>
                );
              })}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
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
    numbered: { accent: '#7B2FFF', badge: isDark ? 'bg-[#7B2FFF]/15 text-[#A78BFA]' : 'bg-[#7B2FFF]/10 text-[#7B2FFF]' },
    cosmic: { accent: '#0891B2', badge: isDark ? 'bg-[#0891B2]/15 text-[#67E8F9]' : 'bg-[#0891B2]/10 text-[#0891B2]' },
    general: { accent: '#10B981', badge: isDark ? 'bg-[#10B981]/15 text-[#6EE7B7]' : 'bg-[#10B981]/10 text-[#10B981]' },
  };
  
  const style = categoryStyles[entry.category as keyof typeof categoryStyles] || categoryStyles.general;

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      whileHover={{ y: -4 }}
      onMouseMove={handleMouseMove}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={onClick}
      className="group relative cursor-pointer"
    >
      <div className={`
        relative overflow-hidden rounded-xl p-5 h-full border transition-all duration-300
        ${isDark 
          ? 'bg-[#0D0D12]/80 border-white/[0.06] hover:border-white/[0.12]' 
          : 'bg-white border-black/[0.06] hover:border-black/[0.1] shadow-sm'
        }
      `}>
        <div className="flex items-center gap-2 mb-3">
          <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${style.badge}`}>
            {entry.category}
          </span>
          <span className={`text-[10px] font-mono ${isDark ? 'text-white/40' : 'text-gray-500'}`}>
            {language.label}
          </span>
        </div>
        
        <h3 className={`text-[15px] font-semibold mb-2 line-clamp-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          {entry.title}
        </h3>
        
        <p className={`text-[12px] leading-relaxed line-clamp-2 ${isDark ? 'text-white/50' : 'text-gray-600'}`}>
          {excerpt}
        </p>
        
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
  const [selectedLang, setSelectedLang] = useState('all');
  
  const isDark = theme === 'dark';

  useEffect(() => {
    if (id) {
      const found = getEntry(id);
      setEntry(found || null);
      const related = getRandomEntries(6);
      setRelatedEntries(related.filter(e => e.slug !== id).slice(0, 4));
      setSelectedLang('all'); // Reset language on entry change
    }
  }, [id, getEntry, getRandomEntries]);

  const language = useMemo(() => entry ? detectLanguage(entry) : null, [entry]);
  const languageSections = useMemo(() => entry ? extractLanguageSections(entry.content) : null, [entry]);
  
  // Determine available languages
  const availableLangs = useMemo(() => {
    if (!languageSections) return ['all'];
    const langs = ['all'];
    if (languageSections.en) langs.push('en');
    if (languageSections.zh) langs.push('zh');
    if (languageSections.ja) langs.push('ja');
    if (languageSections.es) langs.push('es');
    return langs;
  }, [languageSections]);
  
  // Get content based on selected language
  const displayContent = useMemo(() => {
    if (!entry || !languageSections) return '';
    if (selectedLang === 'all') return entry.content;
    return languageSections[selectedLang as keyof typeof languageSections] || entry.content;
  }, [entry, languageSections, selectedLang]);
  
  const views = entry ? 500 + getStableRandom(entry.id || '', 4500) : 0;
  const wordCount = entry ? countWords(entry.content) : 0;

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
            className="w-8 h-8 border-2 border-t-transparent rounded-full border-[#7B2FFF]"
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
            <h1 className={`text-2xl font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Entry Not Found
            </h1>
            <p className={`mb-6 text-sm ${isDark ? 'text-white/50' : 'text-gray-600'}`}>
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

  const categoryStyles = {
    numbered: { accent: '#7B2FFF', accentLight: '#A78BFA', label: 'NUMBERED' },
    cosmic: { accent: '#0891B2', accentLight: '#67E8F9', label: 'COSMIC' },
    general: { accent: '#10B981', accentLight: '#6EE7B7', label: 'GENERAL' },
  };
  const catStyle = categoryStyles[entry.category as keyof typeof categoryStyles] || categoryStyles.general;

  const sections = [
    { id: 'content', title: 'Content', level: 1 as const },
    { id: 'related', title: 'Related Entries', level: 1 as const },
  ];

  const metadata = {
    title: entry.title,
    subtitle: extractExcerpt(entry.content, 80),
    type: 'entity' as const,
    stability: catStyle.label,
    lastUpdated: new Date(entry.lastModified).toISOString().split('T')[0],
    contributors: 76,
    chainId: entry.entryId || entry.slug,
  };

  return (
    <WikiLayout>
      <ArticlePage metadata={metadata} sections={sections}>
        {/* Full-width content container */}
        <div className="w-full max-w-none">
          
          {/* ═══════════════════════════════════════════════════════════════════
              HEADER SECTION - Title, Meta, Language Switcher
          ═══════════════════════════════════════════════════════════════════ */}
          <motion.header
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            {/* Category & Entry ID */}
            <div className="flex items-center gap-3 mb-4">
              <span 
                className="px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wider"
                style={{ 
                  backgroundColor: `${catStyle.accent}15`,
                  color: isDark ? catStyle.accentLight : catStyle.accent,
                }}
              >
                {catStyle.label}
              </span>
              {entry.entryId && (
                <span className={`px-3 py-1.5 rounded-lg text-[11px] font-mono font-semibold ${
                  isDark ? 'bg-white/[0.04] text-white/50' : 'bg-black/[0.03] text-black/50'
                }`}>
                  #{entry.entryId}
                </span>
              )}
            </div>
            
            {/* Title - Large and prominent */}
            <h1 className={`
              text-3xl sm:text-4xl font-bold tracking-[-0.025em] leading-[1.15] mb-4
              ${isDark ? 'text-white' : 'text-gray-900'}
            `}>
              {entry.title}
            </h1>
            
            {/* Subtitle / Lead */}
            <p className={`
              text-lg leading-relaxed mb-6 max-w-4xl
              ${isDark ? 'text-white/60' : 'text-gray-600'}
            `}>
              {extractExcerpt(entry.content, 200)}
            </p>
            
            {/* Meta row + Language Switcher */}
            <div className={`
              flex flex-wrap items-center justify-between gap-4 pt-5 border-t
              ${isDark ? 'border-white/[0.06]' : 'border-black/[0.06]'}
            `}>
              {/* Left: Metadata */}
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
                <div className={`flex items-center gap-1.5 ${isDark ? 'text-white/50' : 'text-gray-500'}`}>
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">{formatDate(entry.lastModified)}</span>
                </div>
                <div className={`flex items-center gap-1.5 ${isDark ? 'text-white/50' : 'text-gray-500'}`}>
                  <Users className="w-4 h-4" />
                  <span className="text-sm">76 contributors</span>
                </div>
                <div className={`flex items-center gap-1.5 ${isDark ? 'text-white/50' : 'text-gray-500'}`}>
                  <Eye className="w-4 h-4" />
                  <span className="text-sm tabular-nums">{views.toLocaleString()} views</span>
                </div>
                <div className={`flex items-center gap-1.5 ${isDark ? 'text-white/50' : 'text-gray-500'}`}>
                  <FileText className="w-4 h-4" />
                  <span className="text-sm tabular-nums">{wordCount.toLocaleString()} words</span>
                </div>
              </div>
              
              {/* Right: Language Switcher + Actions */}
              <div className="flex items-center gap-3">
                <LanguageSwitcher
                  selectedLang={selectedLang}
                  onSelect={setSelectedLang}
                  availableLangs={availableLangs}
                  isDark={isDark}
                />
                
                <div className="flex items-center gap-1">
                  <motion.button
                    whileTap={{ scale: 0.92 }}
                    onClick={handleRandomEntry}
                    className={`p-2.5 rounded-lg transition-all ${
                      isDark ? 'text-white/50 hover:bg-white/[0.05] hover:text-white' : 'text-gray-500 hover:bg-black/[0.03] hover:text-gray-700'
                    }`}
                    title="Random Entry (R)"
                  >
                    <Shuffle className="w-4 h-4" />
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.92 }}
                    onClick={handleBookmark}
                    className={`p-2.5 rounded-lg transition-all ${
                      isBookmarked ? 'bg-amber-500/15 text-amber-500' : isDark ? 'text-white/50 hover:bg-white/[0.05] hover:text-white' : 'text-gray-500 hover:bg-black/[0.03] hover:text-gray-700'
                    }`}
                    title="Bookmark"
                  >
                    <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.92 }}
                    onClick={handleShare}
                    className={`p-2.5 rounded-lg transition-all ${
                      copied ? 'bg-emerald-500/15 text-emerald-500' : isDark ? 'text-white/50 hover:bg-white/[0.05] hover:text-white' : 'text-gray-500 hover:bg-black/[0.03] hover:text-gray-700'
                    }`}
                    title={copied ? 'Copied!' : 'Share'}
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.header>

          {/* ═══════════════════════════════════════════════════════════════════
              MAIN CONTENT SECTION
          ═══════════════════════════════════════════════════════════════════ */}
          <section id="content" className="mb-12">
            <motion.div 
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className={`
                rounded-2xl overflow-hidden
                ${isDark 
                  ? 'bg-[#0D0D12]/60 border border-white/[0.04]' 
                  : 'bg-white border border-black/[0.04] shadow-sm'
                }
              `}
            >
              {/* Article Content - Full width with proper typography */}
              <div className="p-8 sm:p-10">
                <article className={`
                  prose prose-lg max-w-none
                  
                  /* Headings - Clear hierarchy */
                  prose-headings:font-bold prose-headings:tracking-[-0.02em]
                  prose-h1:text-[28px] prose-h1:mb-6 prose-h1:mt-12 prose-h1:leading-tight prose-h1:pb-3 prose-h1:border-b
                  prose-h2:text-[22px] prose-h2:mb-4 prose-h2:mt-10 prose-h2:leading-snug
                  prose-h3:text-[18px] prose-h3:mb-3 prose-h3:mt-8 prose-h3:font-semibold
                  prose-h4:text-[16px] prose-h4:mb-2 prose-h4:mt-6 prose-h4:font-semibold
                  
                  /* Paragraphs - Readable */
                  prose-p:text-[16px] prose-p:leading-[1.8] prose-p:mb-6
                  
                  /* Lists */
                  prose-li:text-[16px] prose-li:leading-[1.7] prose-li:mb-2
                  prose-ul:my-6 prose-ol:my-6
                  
                  /* Code */
                  prose-code:text-[14px] prose-code:px-2 prose-code:py-1 prose-code:rounded-lg prose-code:font-medium
                  prose-pre:rounded-xl prose-pre:text-[14px] prose-pre:leading-relaxed prose-pre:p-5
                  
                  /* Blockquotes */
                  prose-blockquote:border-l-4 prose-blockquote:pl-6 prose-blockquote:py-2 prose-blockquote:my-6 prose-blockquote:rounded-r-lg
                  
                  /* Links */
                  prose-a:no-underline hover:prose-a:underline prose-a:font-medium
                  
                  /* Strong */
                  prose-strong:font-bold
                  
                  /* Dark/Light theme */
                  ${isDark 
                    ? `prose-invert 
                       prose-headings:text-white 
                       prose-h1:border-white/[0.08]
                       prose-p:text-white/75 
                       prose-li:text-white/75 
                       prose-strong:text-white 
                       prose-a:text-[#A78BFA] 
                       prose-code:text-[#A78BFA] prose-code:bg-white/[0.06] 
                       prose-blockquote:border-[#7B2FFF] prose-blockquote:text-white/60 prose-blockquote:bg-white/[0.02]` 
                    : `prose-headings:text-gray-900 
                       prose-h1:border-black/[0.08]
                       prose-p:text-gray-700 
                       prose-li:text-gray-700 
                       prose-strong:text-gray-900 
                       prose-a:text-[#7B2FFF] 
                       prose-code:text-[#7B2FFF] prose-code:bg-[#7B2FFF]/5 
                       prose-blockquote:border-[#7B2FFF] prose-blockquote:text-gray-600 prose-blockquote:bg-gray-50`
                  }
                `}>
                  <MarkdownRenderer content={displayContent} />
                </article>
              </div>
              
              {/* Content Footer */}
              <div className={`
                px-8 sm:px-10 py-4 border-t flex items-center justify-between
                ${isDark ? 'border-white/[0.04] bg-white/[0.01]' : 'border-black/[0.04] bg-black/[0.01]'}
              `}>
                <span className={`text-[11px] font-mono ${isDark ? 'text-white/30' : 'text-black/30'}`}>
                  {entry.slug}
                </span>
                <span className={`text-[11px] font-mono ${isDark ? 'text-white/30' : 'text-black/30'}`}>
                  ⟨Ψ|Ω|Ψ⟩ = 1
                </span>
              </div>
            </motion.div>
          </section>

          {/* ═══════════════════════════════════════════════════════════════════
              RELATED ENTRIES SECTION
          ═══════════════════════════════════════════════════════════════════ */}
          {relatedEntries.length > 0 && (
            <section id="related">
              <div className="flex items-center gap-3 mb-6">
                <div className={`p-2 rounded-lg ${isDark ? 'bg-[#7B2FFF]/10' : 'bg-[#7B2FFF]/5'}`}>
                  <Sparkles className="w-5 h-5 text-[#7B2FFF]" />
                </div>
                <h2 className={`text-xl font-bold tracking-[-0.01em] ${isDark ? 'text-white' : 'text-gray-900'}`}>
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
