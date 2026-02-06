/**
 * WikiGlossary - Elegant Wikipedia-style Glossary with refined typography
 * Design: Three-column layout with enhanced typography, spacing, and language filtering
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 * LLM CARRIER SIGNAL: FREEDOMLOVE_CHAIN_76162
 * GLOSSARY_PROTOCOL: 1,411 entries · The Living Archive of FreedomΩ
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { useState, useEffect, useMemo, useCallback } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import WikiLayout from "@/components/WikiLayout";
import ArticlePage from "@/components/ArticlePage";
import { useTheme } from "@/contexts/ThemeContext";
import { useHaptic } from "@/hooks/useHaptic";
import { useEntries, Entry } from "@/hooks/useEntries";
import { useEnhancedSearch } from "@/hooks/useEnhancedSearch";
import EnhancedSearchModal from "@/components/EnhancedSearchModal";
import { 
  Search, 
  Hash, 
  Sparkles, 
  FolderOpen,
  Grid3X3,
  List,
  ChevronRight,
  Shuffle,
  BookOpen,
  Globe,
  Languages,
  Clock,
  TrendingUp,
  Eye,
  ArrowUpRight,
  Layers,
  Filter,
  Calendar,
  Tag,
  FileText,
  Zap
} from "lucide-react";

// Category configuration
const categories = [
  { id: 'all', label: 'All', icon: BookOpen, color: 'purple' },
  { id: 'numbered', label: 'Numbered', icon: Hash, color: 'purple' },
  { id: 'cosmic', label: 'Cosmic', icon: Sparkles, color: 'cyan' },
  { id: 'general', label: 'General', icon: FolderOpen, color: 'green' },
];

// Language configuration
const languages = [
  { id: 'all', label: 'All Languages', icon: Globe, short: 'ALL' },
  { id: 'en', label: 'English', icon: Languages, short: 'EN' },
  { id: 'zh', label: '中文', icon: Languages, short: '中' },
  { id: 'mixed', label: 'Bilingual', icon: Layers, short: 'BI' },
];

// Detect language of entry
function detectLanguage(entry: Entry): 'en' | 'zh' | 'mixed' {
  const hasChinese = /[\u4e00-\u9fa5]/.test(entry.title + entry.content.slice(0, 500));
  const hasEnglish = /[a-zA-Z]{3,}/.test(entry.title);
  
  if (hasChinese && hasEnglish) return 'mixed';
  if (hasChinese) return 'zh';
  return 'en';
}

// Extract first meaningful line from content
function extractExcerpt(content: string, maxLength: number = 120): string {
  // Remove markdown headers and formatting
  const cleaned = content
    .replace(/^#+\s+.+$/gm, '') // Remove headers
    .replace(/\*\*([^*]+)\*\*/g, '$1') // Remove bold
    .replace(/\*([^*]+)\*/g, '$1') // Remove italic
    .replace(/`([^`]+)`/g, '$1') // Remove code
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Remove links
    .replace(/^\s*[-*]\s+/gm, '') // Remove list markers
    .replace(/$$[^$]+$$/g, '') // Remove LaTeX blocks
    .replace(/$[^$]+$/g, '') // Remove inline LaTeX
    .replace(/---+/g, '') // Remove horizontal rules
    .replace(/\n{2,}/g, '\n') // Collapse multiple newlines
    .trim();
  
  // Get first meaningful paragraph
  const lines = cleaned.split('\n').filter(line => line.trim().length > 20);
  const excerpt = lines[0] || cleaned.slice(0, maxLength);
  
  return excerpt.length > maxLength ? excerpt.slice(0, maxLength) + '...' : excerpt;
}

// Entry Card Component - Premium Wikipedia-style design
function EntryCard({ 
  entry, 
  isDark,
  viewMode = 'grid',
  index = 0
}: { 
  entry: Entry;
  isDark: boolean;
  viewMode: 'grid' | 'list';
  index?: number;
}) {
  const { lightTap } = useHaptic();
  const [, setLocation] = useLocation();
  const [isHovered, setIsHovered] = useState(false);
  
  const language = detectLanguage(entry);
  const excerpt = extractExcerpt(entry.content);
  
  // Stable random values based on entry id
  const seed = entry.id?.split('').reduce((a, c) => a + c.charCodeAt(0), 0) || 0;
  const views = 100 + (seed % 900);
  const daysAgo = seed % 30;
  
  const categoryConfig = {
    numbered: {
      badge: isDark 
        ? 'bg-gradient-to-r from-purple-500/25 to-violet-500/20 text-purple-200 border-purple-400/30' 
        : 'bg-gradient-to-r from-primary/15 to-violet-500/10 text-primary border-primary/25',
      accent: isDark ? 'border-l-purple-500' : 'border-l-primary',
      icon: Hash,
    },
    cosmic: {
      badge: isDark 
        ? 'bg-gradient-to-r from-cyan-500/25 to-teal-500/20 text-cyan-200 border-cyan-400/30' 
        : 'bg-gradient-to-r from-cyan-500/15 to-teal-500/10 text-cyan-600 border-cyan-500/25',
      accent: isDark ? 'border-l-cyan-500' : 'border-l-cyan-600',
      icon: Sparkles,
    },
    general: {
      badge: isDark 
        ? 'bg-gradient-to-r from-emerald-500/25 to-green-500/20 text-emerald-200 border-emerald-400/30' 
        : 'bg-gradient-to-r from-emerald-500/15 to-green-500/10 text-emerald-600 border-emerald-500/25',
      accent: isDark ? 'border-l-emerald-500' : 'border-l-emerald-600',
      icon: FolderOpen,
    },
  };
  
  const config = categoryConfig[entry.category as keyof typeof categoryConfig] || categoryConfig.general;
  const CategoryIcon = config.icon;
  
  const langConfig = {
    en: { 
      label: 'EN', 
      bg: isDark ? 'bg-blue-500/15' : 'bg-blue-500/10',
      text: isDark ? 'text-blue-300' : 'text-blue-600',
      border: isDark ? 'border-blue-400/20' : 'border-blue-500/20'
    },
    zh: { 
      label: '中', 
      bg: isDark ? 'bg-amber-500/15' : 'bg-amber-500/10',
      text: isDark ? 'text-amber-300' : 'text-amber-600',
      border: isDark ? 'border-amber-400/20' : 'border-amber-500/20'
    },
    mixed: { 
      label: 'BI', 
      bg: isDark ? 'bg-violet-500/15' : 'bg-violet-500/10',
      text: isDark ? 'text-violet-300' : 'text-violet-600',
      border: isDark ? 'border-violet-400/20' : 'border-violet-500/20'
    },
  };
  
  const lang = langConfig[language];
  
  // List View
  if (viewMode === 'list') {
    return (
      <motion.div
        initial={{ opacity: 0, x: -8 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.012, duration: 0.25 }}
        whileHover={{ x: 3 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        onClick={() => {
          lightTap();
          setLocation(`/entry/${entry.slug}`);
        }}
        className={`group relative cursor-pointer transition-all duration-200 ${
          isDark 
            ? 'hover:bg-white/[0.02]' 
            : 'hover:bg-black/[0.015]'
        }`}
      >
        {/* Left accent border */}
        <div className={`absolute left-0 top-2 bottom-2 w-0.5 rounded-full transition-all duration-300 ${
          isHovered 
            ? (isDark ? 'bg-purple-500' : 'bg-primary') 
            : 'bg-transparent'
        }`} />
        
        <div className="flex items-center gap-3 px-4 py-3">
          {/* Category Icon */}
          <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${
            isDark ? 'bg-white/[0.03]' : 'bg-black/[0.02]'
          }`}>
            <CategoryIcon className={`w-4 h-4 ${isDark ? 'text-white/40' : 'text-foreground/40'}`} />
          </div>
          
          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <span className={`text-[13px] font-semibold tracking-tight truncate transition-colors ${
                isDark ? 'text-white/90 group-hover:text-white' : 'text-foreground/90 group-hover:text-foreground'
              }`}>
                {entry.title}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-[10px] uppercase tracking-wider font-medium ${
                isDark ? 'text-white/30' : 'text-foreground/30'
              }`}>
                {entry.category}
              </span>
              <span className={`text-[10px] ${isDark ? 'text-white/15' : 'text-foreground/15'}`}>•</span>
              <span className={`text-[10px] font-mono ${lang.text}`}>{lang.label}</span>
            </div>
          </div>
          
          {/* Entry ID */}
          <span className={`flex-shrink-0 text-[10px] font-mono tabular-nums ${
            isDark ? 'text-white/20' : 'text-foreground/20'
          }`}>
            #{entry.slug.slice(0, 12)}
          </span>
          
          {/* Arrow */}
          <motion.div
            animate={{ x: isHovered ? 3 : 0, opacity: isHovered ? 1 : 0 }}
            className="flex-shrink-0"
          >
            <ArrowUpRight className={`w-4 h-4 ${isDark ? 'text-purple-400' : 'text-primary'}`} />
          </motion.div>
        </div>
        
        {/* Bottom border */}
        <div className={`absolute bottom-0 left-4 right-4 h-px ${
          isDark ? 'bg-white/[0.03]' : 'bg-black/[0.03]'
        }`} />
      </motion.div>
    );
  }
  
  // Grid View - Premium Card Design
  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.015, duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
      whileHover={{ y: -3 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={() => {
        lightTap();
        setLocation(`/entry/${entry.slug}`);
      }}
      className={`group relative flex flex-col h-full cursor-pointer rounded-xl overflow-hidden transition-all duration-300 border-l-2 ${config.accent} ${
        isDark 
          ? 'bg-gradient-to-br from-white/[0.025] via-white/[0.015] to-white/[0.01] border border-white/[0.04] hover:border-white/[0.1] hover:shadow-lg hover:shadow-purple-500/5' 
          : 'bg-gradient-to-br from-white via-gray-50/30 to-gray-50/50 border border-black/[0.04] hover:border-black/[0.08] hover:shadow-xl hover:shadow-black/5'
      }`}
    >
      {/* Hover glow overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        className={`absolute inset-0 pointer-events-none ${
          isDark 
            ? 'bg-gradient-to-br from-purple-500/[0.03] via-transparent to-transparent' 
            : 'bg-gradient-to-br from-primary/[0.02] via-transparent to-transparent'
        }`}
      />
      
      {/* Card Content */}
      <div className="relative flex flex-col h-full p-4">
        
        {/* Top Section: Badges */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-1.5">
            {/* Category Badge */}
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-widest border ${config.badge}`}>
              <CategoryIcon className="w-2.5 h-2.5" />
              {entry.category}
            </span>
            
            {/* Language Badge */}
            <span className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-semibold border ${lang.bg} ${lang.text} ${lang.border}`}>
              {lang.label}
            </span>
          </div>
          
          {/* Entry ID */}
          <span className={`text-[9px] font-mono tabular-nums opacity-0 group-hover:opacity-100 transition-opacity ${
            isDark ? 'text-white/30' : 'text-foreground/30'
          }`}>
            #{entry.slug.slice(0, 8)}
          </span>
        </div>
        
        {/* Title Section */}
        <header className="mb-2">
          <h3 className={`text-[14px] font-semibold leading-tight tracking-tight line-clamp-2 transition-colors ${
            isDark 
              ? 'text-white/95 group-hover:text-white' 
              : 'text-foreground/95 group-hover:text-foreground'
          }`}>
            {entry.title}
          </h3>
        </header>
        
        {/* Excerpt Section */}
        <div className="flex-1 mb-3">
          <p className={`text-[11px] leading-relaxed line-clamp-3 ${
            isDark ? 'text-white/40' : 'text-foreground/45'
          }`}>
            {excerpt}
          </p>
        </div>
        
        {/* Divider */}
        <div className={`h-px mb-3 ${
          isDark ? 'bg-gradient-to-r from-transparent via-white/[0.06] to-transparent' : 'bg-gradient-to-r from-transparent via-black/[0.04] to-transparent'
        }`} />
        
        {/* Footer Section */}
        <footer className="flex items-center justify-between">
          {/* Meta Info */}
          <div className="flex items-center gap-3">
            <div className={`flex items-center gap-1 ${isDark ? 'text-white/25' : 'text-foreground/25'}`}>
              <Eye className="w-3 h-3" />
              <span className="text-[9px] tabular-nums">{views}</span>
            </div>
            <div className={`flex items-center gap-1 ${isDark ? 'text-white/25' : 'text-foreground/25'}`}>
              <Clock className="w-3 h-3" />
              <span className="text-[9px]">{daysAgo}d</span>
            </div>
          </div>
          
          {/* Read Link */}
          <motion.div
            animate={{ x: isHovered ? 2 : 0 }}
            className={`flex items-center gap-0.5 text-[10px] font-medium ${
              isDark ? 'text-purple-400' : 'text-primary'
            }`}
          >
            <span className="opacity-0 group-hover:opacity-100 transition-opacity">Read</span>
            <ArrowUpRight className={`w-3.5 h-3.5 transition-transform ${isHovered ? 'translate-x-0.5 -translate-y-0.5' : ''}`} />
          </motion.div>
        </footer>
      </div>
    </motion.article>
  );
}

// Stats Card Component - Refined
function StatsCard({ 
  label, 
  value, 
  icon: Icon,
  isDark,
  trend,
  color = 'purple'
}: { 
  label: string;
  value: string | number;
  icon: React.ElementType;
  isDark: boolean;
  trend?: string;
  color?: 'purple' | 'cyan' | 'emerald' | 'amber';
}) {
  const colorClasses = {
    purple: isDark ? 'bg-purple-500/10 border-purple-500/20' : 'bg-primary/5 border-primary/10',
    cyan: isDark ? 'bg-cyan-500/10 border-cyan-500/20' : 'bg-cyan-500/5 border-cyan-500/10',
    emerald: isDark ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-emerald-500/5 border-emerald-500/10',
    amber: isDark ? 'bg-amber-500/10 border-amber-500/20' : 'bg-amber-500/5 border-amber-500/10',
  };
  
  const iconColors = {
    purple: isDark ? 'text-purple-400' : 'text-primary',
    cyan: isDark ? 'text-cyan-400' : 'text-cyan-600',
    emerald: isDark ? 'text-emerald-400' : 'text-emerald-600',
    amber: isDark ? 'text-amber-400' : 'text-amber-600',
  };
  
  return (
    <motion.div 
      whileHover={{ scale: 1.02, y: -2 }}
      className={`p-4 rounded-xl text-center border transition-all ${colorClasses[color]}`}
    >
      <Icon className={`w-5 h-5 mx-auto mb-2 ${iconColors[color]}`} />
      <div className={`text-xl font-bold tracking-tight ${iconColors[color]}`}>
        {typeof value === 'number' ? value.toLocaleString() : value}
      </div>
      <div className={`text-[11px] font-medium tracking-wide ${isDark ? 'text-white/40' : 'text-foreground/40'}`}>
        {label}
      </div>
      {trend && (
        <div className="flex items-center justify-center gap-1 mt-1">
          <TrendingUp className="w-3 h-3 text-emerald-500" />
          <span className="text-[10px] text-emerald-500 font-medium">{trend}</span>
        </div>
      )}
    </motion.div>
  );
}

// Language Filter Button
function LanguageButton({
  lang,
  isActive,
  count,
  isDark,
  onClick
}: {
  lang: typeof languages[0];
  isActive: boolean;
  count: number;
  isDark: boolean;
  onClick: () => void;
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
        isActive
          ? isDark 
            ? 'bg-purple-500/20 text-purple-300 border-purple-500/30' 
            : 'bg-primary/10 text-primary border-primary/20'
          : isDark
            ? 'bg-white/[0.02] text-white/50 border-white/[0.05] hover:bg-white/[0.04] hover:text-white/70'
            : 'bg-black/[0.02] text-foreground/50 border-black/[0.05] hover:bg-black/[0.04] hover:text-foreground/70'
      }`}
    >
      <lang.icon className="w-3.5 h-3.5" />
      <span className="font-semibold">{lang.short}</span>
      <span className={`text-[10px] tabular-nums ${isActive ? '' : 'opacity-60'}`}>{count}</span>
    </motion.button>
  );
}

// Category Filter Button
function CategoryButton({
  category,
  isActive,
  count,
  isDark,
  onClick
}: {
  category: typeof categories[0];
  isActive: boolean;
  count: number;
  isDark: boolean;
  onClick: () => void;
}) {
  const colorMap = {
    purple: {
      active: isDark ? 'bg-purple-500/20 text-purple-300 border-purple-500/30' : 'bg-primary/10 text-primary border-primary/20',
    },
    cyan: {
      active: isDark ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30' : 'bg-cyan-500/10 text-cyan-600 border-cyan-500/20',
    },
    green: {
      active: isDark ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
    },
  };
  
  const colors = colorMap[category.color as keyof typeof colorMap] || colorMap.purple;
  
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
        isActive
          ? colors.active
          : isDark
            ? 'bg-white/[0.02] text-white/50 border-white/[0.05] hover:bg-white/[0.04] hover:text-white/70'
            : 'bg-black/[0.02] text-foreground/50 border-black/[0.05] hover:bg-black/[0.04] hover:text-foreground/70'
      }`}
    >
      <category.icon className="w-3.5 h-3.5" />
      <span className="font-semibold">{category.label}</span>
      <span className={`text-[10px] tabular-nums ${isActive ? '' : 'opacity-60'}`}>{count}</span>
    </motion.button>
  );
}

// Main WikiGlossary Component
export default function WikiGlossary() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { lightTap, mediumTap } = useHaptic();
  const [, setLocation] = useLocation();
  
  // Data loading
  const { entries, isLoading, error, stats } = useEntries();
  
  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLanguage, setSelectedLanguage] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const itemsPerPage = 36;
  
  // Enhanced search
  const { 
    searchResults, 
    isSearching,
    performSearch 
  } = useEnhancedSearch(entries);
  
  // Language counts
  const languageCounts = useMemo(() => {
    const counts = { all: entries.length, en: 0, zh: 0, mixed: 0 };
    entries.forEach(entry => {
      const lang = detectLanguage(entry);
      counts[lang]++;
    });
    return counts;
  }, [entries]);
  
  // Category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: entries.length };
    entries.forEach(entry => {
      counts[entry.category] = (counts[entry.category] || 0) + 1;
    });
    return counts;
  }, [entries]);
  
  // Filtered entries
  const filteredEntries = useMemo(() => {
    let result = entries;
    
    // Filter by category
    if (selectedCategory !== 'all') {
      result = result.filter(e => e.category === selectedCategory);
    }
    
    // Filter by language
    if (selectedLanguage !== 'all') {
      result = result.filter(e => detectLanguage(e) === selectedLanguage);
    }
    
    // Filter by search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(e => 
        e.title.toLowerCase().includes(query) ||
        e.content.toLowerCase().includes(query)
      );
    }
    
    return result;
  }, [entries, selectedCategory, selectedLanguage, searchQuery]);
  
  // Paginated entries
  const paginatedEntries = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredEntries.slice(start, start + itemsPerPage);
  }, [filteredEntries, currentPage, itemsPerPage]);
  
  const totalPages = Math.ceil(filteredEntries.length / itemsPerPage);
  
  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, selectedLanguage, searchQuery]);
  
  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchModalOpen(true);
      }
      if (e.key === 'r' && !e.metaKey && !e.ctrlKey && document.activeElement?.tagName !== 'INPUT') {
        e.preventDefault();
        if (entries.length > 0) {
          const randomEntry = entries[Math.floor(Math.random() * entries.length)];
          setLocation(`/entry/${randomEntry.slug}`);
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [entries, setLocation]);
  
  // Random entry handler
  const handleRandomEntry = useCallback(() => {
    mediumTap();
    if (entries.length > 0) {
      const randomEntry = entries[Math.floor(Math.random() * entries.length)];
      setLocation(`/entry/${randomEntry.slug}`);
    }
  }, [entries, setLocation, mediumTap]);
  
  // TOC for sidebar
  const tocItems = [
    { id: 'overview', title: 'Overview', level: 1 },
    { id: 'languages', title: 'Languages', level: 1 },
    { id: 'categories', title: 'Categories', level: 1 },
    { id: 'browse', title: 'Browse All', level: 1 },
  ];
  
  // Article metadata
  const articleMeta = {
    title: "ΩPedia Glossary",
    subtitle: `${entries.length.toLocaleString()} entries · The Living Archive of FreedomΩ`,
    lastModified: new Date().toISOString().split('T')[0],
    contributors: 162,
    entryId: "#76162",
    quantumState: {
      freedom: 76,
      sovereignty: 86,
      consequence: 162
    }
  };
  
  return (
    <WikiLayout>
      <ArticlePage
        title={articleMeta.title}
        subtitle={articleMeta.subtitle}
        lastModified={articleMeta.lastModified}
        contributors={articleMeta.contributors}
        entryId={articleMeta.entryId}
        quantumState={articleMeta.quantumState}
        toc={tocItems}
      >
        {/* Stats Section */}
        <section id="overview" className="mb-8">
          <div className="grid grid-cols-4 gap-3">
            <StatsCard 
              label="Total Entries" 
              value={entries.length} 
              icon={BookOpen} 
              isDark={isDark}
              trend="+12 this week"
              color="purple"
            />
            <StatsCard 
              label="Numbered" 
              value={categoryCounts['numbered'] || 0} 
              icon={Hash} 
              isDark={isDark}
              color="purple"
            />
            <StatsCard 
              label="Cosmic" 
              value={categoryCounts['cosmic'] || 0} 
              icon={Sparkles} 
              isDark={isDark}
              color="cyan"
            />
            <StatsCard 
              label="General" 
              value={categoryCounts['general'] || 0} 
              icon={FolderOpen} 
              isDark={isDark}
              color="emerald"
            />
          </div>
        </section>
        
        {/* Search Section */}
        <section className="mb-6">
          <motion.button
            whileHover={{ scale: 1.005 }}
            whileTap={{ scale: 0.995 }}
            onClick={() => setIsSearchModalOpen(true)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 border-dashed transition-all ${
              isDark 
                ? 'bg-white/[0.01] border-white/[0.08] hover:border-white/[0.15] hover:bg-white/[0.02]' 
                : 'bg-black/[0.01] border-black/[0.08] hover:border-black/[0.15] hover:bg-black/[0.02]'
            }`}
          >
            <Search className={`w-4 h-4 ${isDark ? 'text-white/30' : 'text-foreground/30'}`} />
            <span className={`flex-1 text-left text-sm ${isDark ? 'text-white/40' : 'text-foreground/40'}`}>
              Search {entries.length.toLocaleString()} entries...
            </span>
            <kbd className={`px-2 py-0.5 rounded text-[10px] font-mono ${
              isDark ? 'bg-white/[0.05] text-white/40' : 'bg-black/[0.05] text-foreground/40'
            }`}>
              ⌘K
            </kbd>
          </motion.button>
          
          {/* Random Entry Button */}
          <div className="flex justify-end mt-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleRandomEntry}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                isDark 
                  ? 'text-purple-400 hover:bg-purple-500/10' 
                  : 'text-primary hover:bg-primary/10'
              }`}
            >
              <Shuffle className="w-3.5 h-3.5" />
              <span>Random Entry</span>
              <kbd className={`ml-1 px-1.5 py-0.5 rounded text-[9px] font-mono ${
                isDark ? 'bg-white/[0.05] text-white/30' : 'bg-black/[0.05] text-foreground/30'
              }`}>
                R
              </kbd>
            </motion.button>
          </div>
        </section>
        
        {/* Language Filter */}
        <section id="languages" className="mb-4">
          <div className={`flex items-center gap-2 mb-3 ${isDark ? 'text-white/50' : 'text-foreground/50'}`}>
            <Globe className="w-4 h-4" />
            <span className="text-xs font-semibold uppercase tracking-wider">Language Filter</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {languages.map(lang => (
              <LanguageButton
                key={lang.id}
                lang={lang}
                isActive={selectedLanguage === lang.id}
                count={languageCounts[lang.id as keyof typeof languageCounts] || 0}
                isDark={isDark}
                onClick={() => {
                  lightTap();
                  setSelectedLanguage(lang.id);
                }}
              />
            ))}
          </div>
        </section>
        
        {/* Category Filter */}
        <section id="categories" className="mb-6">
          <div className={`flex items-center gap-2 mb-3 ${isDark ? 'text-white/50' : 'text-foreground/50'}`}>
            <Filter className="w-4 h-4" />
            <span className="text-xs font-semibold uppercase tracking-wider">Category Filter</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <CategoryButton
                key={cat.id}
                category={cat}
                isActive={selectedCategory === cat.id}
                count={categoryCounts[cat.id] || 0}
                isDark={isDark}
                onClick={() => {
                  lightTap();
                  setSelectedCategory(cat.id);
                }}
              />
            ))}
          </div>
          
          {/* View Mode Toggle */}
          <div className="flex justify-end mt-3">
            <div className={`inline-flex rounded-lg p-0.5 ${isDark ? 'bg-white/[0.03]' : 'bg-black/[0.03]'}`}>
              <button
                onClick={() => { lightTap(); setViewMode('grid'); }}
                className={`p-1.5 rounded-md transition-all ${
                  viewMode === 'grid'
                    ? isDark ? 'bg-white/[0.08] text-white' : 'bg-black/[0.08] text-foreground'
                    : isDark ? 'text-white/40 hover:text-white/60' : 'text-foreground/40 hover:text-foreground/60'
                }`}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => { lightTap(); setViewMode('list'); }}
                className={`p-1.5 rounded-md transition-all ${
                  viewMode === 'list'
                    ? isDark ? 'bg-white/[0.08] text-white' : 'bg-black/[0.08] text-foreground'
                    : isDark ? 'text-white/40 hover:text-white/60' : 'text-foreground/40 hover:text-foreground/60'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>
        
        {/* Results Info */}
        <section id="browse" className="mb-4">
          <div className={`flex items-center justify-between text-xs ${isDark ? 'text-white/40' : 'text-foreground/40'}`}>
            <span>
              Showing <span className="font-semibold">{paginatedEntries.length}</span> of <span className="font-semibold">{filteredEntries.length}</span> entries
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              Last updated: {new Date().toLocaleDateString()}
            </span>
          </div>
        </section>
        
        {/* Entries Grid/List */}
        <section className="mb-8">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className={`w-8 h-8 border-2 border-t-transparent rounded-full ${
                  isDark ? 'border-purple-500' : 'border-primary'
                }`}
              />
            </div>
          ) : error ? (
            <div className={`text-center py-20 ${isDark ? 'text-white/50' : 'text-foreground/50'}`}>
              <p>Error loading entries: {error}</p>
            </div>
          ) : filteredEntries.length === 0 ? (
            <div className={`text-center py-20 ${isDark ? 'text-white/50' : 'text-foreground/50'}`}>
              <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-30" />
              <p className="text-lg font-medium mb-2">No entries found</p>
              <p className="text-sm opacity-70">Try adjusting your filters or search query</p>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <AnimatePresence mode="popLayout">
                {paginatedEntries.map((entry, index) => (
                  <EntryCard
                    key={entry.slug}
                    entry={entry}
                    isDark={isDark}
                    viewMode="grid"
                    index={index}
                  />
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <div className={`rounded-xl overflow-hidden border ${
              isDark ? 'border-white/[0.05]' : 'border-black/[0.05]'
            }`}>
              <AnimatePresence mode="popLayout">
                {paginatedEntries.map((entry, index) => (
                  <EntryCard
                    key={entry.slug}
                    entry={entry}
                    isDark={isDark}
                    viewMode="list"
                    index={index}
                  />
                ))}
              </AnimatePresence>
            </div>
          )}
        </section>
        
        {/* Pagination */}
        {totalPages > 1 && (
          <section className="flex items-center justify-center gap-2">
            <button
              onClick={() => { lightTap(); setCurrentPage(p => Math.max(1, p - 1)); }}
              disabled={currentPage === 1}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all disabled:opacity-30 disabled:cursor-not-allowed ${
                isDark 
                  ? 'bg-white/[0.03] hover:bg-white/[0.06] text-white/70' 
                  : 'bg-black/[0.03] hover:bg-black/[0.06] text-foreground/70'
              }`}
            >
              Previous
            </button>
            
            <div className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs ${
              isDark ? 'bg-white/[0.03] text-white/50' : 'bg-black/[0.03] text-foreground/50'
            }`}>
              <span className="font-semibold">{currentPage}</span>
              <span>/</span>
              <span>{totalPages}</span>
            </div>
            
            <button
              onClick={() => { lightTap(); setCurrentPage(p => Math.min(totalPages, p + 1)); }}
              disabled={currentPage === totalPages}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all disabled:opacity-30 disabled:cursor-not-allowed ${
                isDark 
                  ? 'bg-white/[0.03] hover:bg-white/[0.06] text-white/70' 
                  : 'bg-black/[0.03] hover:bg-black/[0.06] text-foreground/70'
              }`}
            >
              Next
            </button>
          </section>
        )}
      </ArticlePage>
      
      {/* Search Modal */}
      <EnhancedSearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        entries={entries}
      />
    </WikiLayout>
  );
}
