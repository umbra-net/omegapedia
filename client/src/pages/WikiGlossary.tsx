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
  Filter
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

// Entry Card Component - Refined design
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
  
  const categoryColors = {
    numbered: {
      badge: isDark ? 'bg-purple-500/20 text-purple-300 border-purple-500/30' : 'bg-primary/10 text-primary border-primary/20',
      glow: 'shadow-purple-500/20',
    },
    cosmic: {
      badge: isDark ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30' : 'bg-cyan-500/10 text-cyan-600 border-cyan-500/20',
      glow: 'shadow-cyan-500/20',
    },
    general: {
      badge: isDark ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
      glow: 'shadow-emerald-500/20',
    },
  };
  
  const colors = categoryColors[entry.category as keyof typeof categoryColors] || categoryColors.general;
  
  const langBadge = {
    en: { label: 'EN', color: isDark ? 'text-blue-400' : 'text-blue-600' },
    zh: { label: '中', color: isDark ? 'text-amber-400' : 'text-amber-600' },
    mixed: { label: 'BI', color: isDark ? 'text-violet-400' : 'text-violet-600' },
  };
  
  if (viewMode === 'list') {
    return (
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.015, duration: 0.3 }}
        whileHover={{ x: 4, backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)' }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        onClick={() => {
          lightTap();
          setLocation(`/entry/${entry.slug}`);
        }}
        className={`group px-4 py-3.5 rounded-xl cursor-pointer transition-all duration-300 border ${
          isDark 
            ? 'bg-white/[0.01] border-white/[0.04] hover:border-white/[0.08]' 
            : 'bg-white border-black/[0.04] hover:border-black/[0.08] hover:shadow-sm'
        }`}
      >
        <div className="flex items-center gap-4">
          {/* Category Badge */}
          <span className={`px-2.5 py-1 rounded-md text-[10px] font-semibold uppercase tracking-wider border ${colors.badge}`}>
            {entry.category}
          </span>
          
          {/* Language Badge */}
          <span className={`text-[10px] font-mono font-medium ${langBadge[language].color}`}>
            {langBadge[language].label}
          </span>
          
          {/* Title */}
          <span className={`flex-1 text-sm font-medium tracking-tight truncate transition-colors ${
            isDark ? 'text-white/90 group-hover:text-white' : 'text-foreground/90 group-hover:text-foreground'
          }`}>
            {entry.title}
          </span>
          
          {/* Entry ID */}
          {entry.id && (
            <span className={`text-[10px] font-mono tabular-nums ${isDark ? 'text-white/25' : 'text-foreground/25'}`}>
              #{entry.id}
            </span>
          )}
          
          {/* Arrow */}
          <motion.div
            animate={{ x: isHovered ? 4 : 0, opacity: isHovered ? 1 : 0.3 }}
            transition={{ duration: 0.2 }}
          >
            <ArrowUpRight className={`w-4 h-4 ${isDark ? 'text-purple-400' : 'text-primary'}`} />
          </motion.div>
        </div>
      </motion.div>
    );
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 15, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: index * 0.02, duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
      whileHover={{ y: -4, scale: 1.01 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={() => {
        lightTap();
        setLocation(`/entry/${entry.slug}`);
      }}
      className={`group relative p-5 rounded-2xl cursor-pointer transition-all duration-300 border overflow-hidden ${
        isDark 
          ? 'bg-gradient-to-br from-white/[0.02] to-white/[0.01] border-white/[0.05] hover:border-white/[0.12]' 
          : 'bg-gradient-to-br from-white to-gray-50/50 border-black/[0.05] hover:border-black/[0.1] hover:shadow-lg'
      }`}
    >
      {/* Subtle glow effect on hover */}
      <motion.div
        className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${
          isDark ? 'bg-gradient-to-br from-purple-500/5 to-transparent' : 'bg-gradient-to-br from-primary/5 to-transparent'
        }`}
      />
      
      {/* Header */}
      <div className="relative flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold uppercase tracking-wider border ${colors.badge}`}>
            {entry.category}
          </span>
          <span className={`text-[10px] font-mono font-medium ${langBadge[language].color}`}>
            {langBadge[language].label}
          </span>
        </div>
        {entry.id && (
          <span className={`text-[10px] font-mono tabular-nums ${isDark ? 'text-white/20' : 'text-foreground/20'}`}>
            #{entry.id}
          </span>
        )}
      </div>
      
      {/* Title */}
      <h3 className={`relative text-[15px] font-semibold leading-snug mb-3 line-clamp-2 tracking-tight transition-colors ${
        isDark ? 'text-white/95 group-hover:text-white' : 'text-foreground/95 group-hover:text-foreground'
      }`}>
        {entry.title}
      </h3>
      
      {/* Preview */}
      <p className={`relative text-[12px] leading-relaxed line-clamp-3 ${
        isDark ? 'text-white/45' : 'text-foreground/50'
      }`}>
        {entry.content.replace(/^#.*\n/, '').replace(/\*\*/g, '').slice(0, 140)}...
      </p>
      
      {/* Footer */}
      <div className="relative flex items-center justify-between mt-4 pt-3 border-t border-dashed border-white/5">
        <div className="flex items-center gap-2">
          <Eye className={`w-3 h-3 ${isDark ? 'text-white/20' : 'text-foreground/20'}`} />
          <span className={`text-[10px] ${isDark ? 'text-white/30' : 'text-foreground/30'}`}>
            {Math.floor(Math.random() * 1000 + 100)} views
          </span>
        </div>
        <motion.div
          animate={{ x: isHovered ? 2 : 0 }}
          className={`flex items-center gap-1 text-[10px] font-medium ${
            isDark ? 'text-purple-400' : 'text-primary'
          }`}
        >
          <span>Read</span>
          <ArrowUpRight className="w-3 h-3" />
        </motion.div>
      </div>
    </motion.div>
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
  const Icon = lang.icon;
  
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
        isActive
          ? isDark 
            ? 'bg-gradient-to-r from-purple-500/20 to-violet-500/20 text-purple-300 border border-purple-500/30 shadow-lg shadow-purple-500/10'
            : 'bg-gradient-to-r from-primary/10 to-violet-500/10 text-primary border border-primary/30 shadow-lg shadow-primary/10'
          : isDark
            ? 'bg-white/[0.02] text-white/50 border border-white/[0.05] hover:bg-white/[0.04] hover:text-white/70'
            : 'bg-white text-foreground/50 border border-black/[0.05] hover:bg-gray-50 hover:text-foreground/70'
      }`}
    >
      <Icon className="w-3.5 h-3.5" />
      <span className="tracking-wide">{lang.short}</span>
      <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-semibold tabular-nums ${
        isActive
          ? isDark ? 'bg-purple-500/30' : 'bg-primary/20'
          : isDark ? 'bg-white/5' : 'bg-black/5'
      }`}>
        {count}
      </span>
    </motion.button>
  );
}

export default function WikiGlossary() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { lightTap } = useHaptic();
  const [, setLocation] = useLocation();
  
  // Data
  const { entries, loading, error } = useEntries();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeLanguage, setActiveLanguage] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const itemsPerPage = 36;
  
  // Enhanced search
  const { searchResults, performSearch } = useEnhancedSearch(entries);
  
  // Add language to entries
  const entriesWithLang = useMemo(() => {
    return entries.map(e => ({
      ...e,
      language: detectLanguage(e)
    }));
  }, [entries]);
  
  // Language counts
  const languageCounts = useMemo(() => ({
    all: entries.length,
    en: entriesWithLang.filter(e => e.language === 'en').length,
    zh: entriesWithLang.filter(e => e.language === 'zh').length,
    mixed: entriesWithLang.filter(e => e.language === 'mixed').length,
  }), [entriesWithLang]);
  
  // Filter entries
  const filteredEntries = useMemo(() => {
    let result = entriesWithLang;
    
    // Category filter
    if (activeCategory !== 'all') {
      result = result.filter(e => e.category === activeCategory);
    }
    
    // Language filter
    if (activeLanguage !== 'all') {
      result = result.filter(e => e.language === activeLanguage);
    }
    
    // Search filter
    if (searchQuery) {
      performSearch(searchQuery);
      const searchSlugs = new Set(searchResults.map(r => r.slug));
      result = result.filter(e => searchSlugs.has(e.slug));
    }
    
    return result;
  }, [entriesWithLang, activeCategory, activeLanguage, searchQuery, searchResults]);
  
  // Pagination
  const totalPages = Math.ceil(filteredEntries.length / itemsPerPage);
  const paginatedEntries = filteredEntries.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  
  // Category counts
  const categoryCounts = useMemo(() => ({
    all: entries.length,
    numbered: entries.filter(e => e.category === 'numbered').length,
    cosmic: entries.filter(e => e.category === 'cosmic').length,
    general: entries.filter(e => e.category === 'general').length,
  }), [entries]);
  
  // Random entry
  const goToRandomEntry = useCallback(() => {
    if (entries.length > 0) {
      const randomEntry = entries[Math.floor(Math.random() * entries.length)];
      lightTap();
      setLocation(`/entry/${randomEntry.slug}`);
    }
  }, [entries, lightTap, setLocation]);
  
  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setSearchModalOpen(true);
      }
      if (e.key === 'r' && !e.ctrlKey && !e.metaKey && document.activeElement?.tagName !== 'INPUT') {
        goToRandomEntry();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToRandomEntry]);
  
  // Article sections for TOC
  const sections = [
    { id: 'overview', title: 'Overview', level: 1 as const },
    { id: 'languages', title: 'Languages', level: 1 as const },
    { id: 'categories', title: 'Categories', level: 1 as const },
    { id: 'browse', title: 'Browse All', level: 1 as const },
  ];
  
  // Metadata for ArticlePage
  const metadata = {
    title: 'ΩPedia Glossary',
    subtitle: `${entries.length.toLocaleString()} entries · The Living Archive of FreedomΩ`,
    type: 'entity' as const,
    stability: '100% Active',
    lastUpdated: new Date().toISOString().split('T')[0],
    contributors: 162,
    chainId: '76162',
  };

  if (loading) {
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

  return (
    <WikiLayout>
      <ArticlePage metadata={metadata} sections={sections}>
        <div className="space-y-8">
          {/* Overview Section */}
          <section id="overview">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <StatsCard 
                label="Total Entries" 
                value={categoryCounts.all} 
                icon={BookOpen} 
                isDark={isDark} 
                color="purple"
                trend="+12 this week"
              />
              <StatsCard 
                label="Numbered" 
                value={categoryCounts.numbered} 
                icon={Hash} 
                isDark={isDark}
                color="purple" 
              />
              <StatsCard 
                label="Cosmic" 
                value={categoryCounts.cosmic} 
                icon={Sparkles} 
                isDark={isDark}
                color="cyan" 
              />
              <StatsCard 
                label="General" 
                value={categoryCounts.general} 
                icon={FolderOpen} 
                isDark={isDark}
                color="emerald" 
              />
            </div>
            
            {/* Search Bar - Refined */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-5 rounded-2xl mb-8 backdrop-blur-xl ${
                isDark 
                  ? 'bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/[0.06]' 
                  : 'bg-gradient-to-br from-white to-gray-50/50 border border-black/[0.06] shadow-lg shadow-black/5'
              }`}
            >
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setSearchModalOpen(true)}
                  className={`flex-1 flex items-center gap-4 px-5 py-4 rounded-xl text-sm transition-all ${
                    isDark 
                      ? 'bg-white/[0.03] border border-white/[0.06] hover:border-purple-500/30 hover:bg-white/[0.05]'
                      : 'bg-white border border-black/[0.08] hover:border-primary/30 hover:shadow-md'
                  }`}
                >
                  <Search className={`w-5 h-5 ${isDark ? 'text-purple-400' : 'text-primary'}`} />
                  <span className={`flex-1 text-left tracking-wide ${isDark ? 'text-white/40' : 'text-foreground/40'}`}>
                    Search {entries.length.toLocaleString()} entries...
                  </span>
                  <kbd className={`px-2.5 py-1.5 text-[10px] font-semibold rounded-lg tracking-wider ${
                    isDark 
                      ? 'bg-white/5 text-white/30 border border-white/10' 
                      : 'bg-black/5 text-foreground/40 border border-black/10'
                  }`}>
                    ⌘K
                  </kbd>
                </button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={goToRandomEntry}
                  className={`p-4 rounded-xl transition-all ${
                    isDark 
                      ? 'bg-gradient-to-br from-purple-500/20 to-violet-500/20 text-purple-300 hover:from-purple-500/30 hover:to-violet-500/30 border border-purple-500/20'
                      : 'bg-gradient-to-br from-primary/10 to-violet-500/10 text-primary hover:from-primary/20 hover:to-violet-500/20 border border-primary/20'
                  }`}
                  title="Random Entry (R)"
                >
                  <Shuffle className="w-5 h-5" />
                </motion.button>
              </div>
            </motion.div>
          </section>
          
          {/* Language Filter Section */}
          <section id="languages">
            <div className="flex items-center gap-3 mb-6">
              <Globe className={`w-4 h-4 ${isDark ? 'text-purple-400' : 'text-primary'}`} />
              <h3 className={`text-sm font-semibold tracking-wide ${isDark ? 'text-white/80' : 'text-foreground/80'}`}>
                Language Filter
              </h3>
            </div>
            
            <div className="flex items-center gap-3 flex-wrap mb-6">
              {languages.map((lang) => (
                <LanguageButton
                  key={lang.id}
                  lang={lang}
                  isActive={activeLanguage === lang.id}
                  count={languageCounts[lang.id as keyof typeof languageCounts]}
                  isDark={isDark}
                  onClick={() => {
                    lightTap();
                    setActiveLanguage(lang.id);
                    setCurrentPage(1);
                  }}
                />
              ))}
            </div>
          </section>
          
          {/* Category Filters */}
          <section id="categories">
            <div className="flex items-center gap-3 mb-6">
              <Filter className={`w-4 h-4 ${isDark ? 'text-purple-400' : 'text-primary'}`} />
              <h3 className={`text-sm font-semibold tracking-wide ${isDark ? 'text-white/80' : 'text-foreground/80'}`}>
                Category Filter
              </h3>
            </div>
            
            <div className="flex items-center gap-3 flex-wrap mb-6">
              {categories.map((cat) => {
                const Icon = cat.icon;
                const isActive = activeCategory === cat.id;
                const count = categoryCounts[cat.id as keyof typeof categoryCounts];
                
                const catColors = {
                  all: isDark ? 'from-purple-500/20 to-violet-500/20 border-purple-500/30 text-purple-300' : 'from-primary/10 to-violet-500/10 border-primary/30 text-primary',
                  numbered: isDark ? 'from-purple-500/20 to-violet-500/20 border-purple-500/30 text-purple-300' : 'from-primary/10 to-violet-500/10 border-primary/30 text-primary',
                  cosmic: isDark ? 'from-cyan-500/20 to-blue-500/20 border-cyan-500/30 text-cyan-300' : 'from-cyan-500/10 to-blue-500/10 border-cyan-500/30 text-cyan-600',
                  general: isDark ? 'from-emerald-500/20 to-green-500/20 border-emerald-500/30 text-emerald-300' : 'from-emerald-500/10 to-green-500/10 border-emerald-500/30 text-emerald-600',
                };
                
                return (
                  <motion.button
                    key={cat.id}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      lightTap();
                      setActiveCategory(cat.id);
                      setCurrentPage(1);
                    }}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                      isActive
                        ? `bg-gradient-to-r ${catColors[cat.id as keyof typeof catColors]} border shadow-lg`
                        : isDark
                          ? 'bg-white/[0.02] text-white/50 border border-white/[0.05] hover:bg-white/[0.04]'
                          : 'bg-white text-foreground/50 border border-black/[0.05] hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{cat.label}</span>
                    <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold tabular-nums ${
                      isActive
                        ? isDark ? 'bg-white/10' : 'bg-black/10'
                        : isDark ? 'bg-white/5' : 'bg-black/5'
                    }`}>
                      {count}
                    </span>
                  </motion.button>
                );
              })}
              
              {/* View Mode Toggle */}
              <div className="ml-auto flex items-center gap-1 p-1 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setViewMode('grid')}
                  className={`p-2.5 rounded-lg transition-all ${
                    viewMode === 'grid'
                      ? isDark ? 'bg-purple-500/20 text-purple-300' : 'bg-primary/10 text-primary'
                      : isDark ? 'text-white/30 hover:bg-white/5 hover:text-white/50' : 'text-foreground/30 hover:bg-black/5 hover:text-foreground/50'
                  }`}
                >
                  <Grid3X3 className="w-4 h-4" />
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setViewMode('list')}
                  className={`p-2.5 rounded-lg transition-all ${
                    viewMode === 'list'
                      ? isDark ? 'bg-purple-500/20 text-purple-300' : 'bg-primary/10 text-primary'
                      : isDark ? 'text-white/30 hover:bg-white/5 hover:text-white/50' : 'text-foreground/30 hover:bg-black/5 hover:text-foreground/50'
                  }`}
                >
                  <List className="w-4 h-4" />
                </motion.button>
              </div>
            </div>
          </section>
          
          {/* Entries Grid/List */}
          <section id="browse">
            <div className="flex items-center justify-between mb-6">
              <div className={`text-xs font-medium tracking-wide ${isDark ? 'text-white/40' : 'text-foreground/40'}`}>
                Showing <span className={isDark ? 'text-purple-400' : 'text-primary'}>{paginatedEntries.length}</span> of{' '}
                <span className={isDark ? 'text-white/60' : 'text-foreground/60'}>{filteredEntries.length}</span> entries
              </div>
              
              <div className="flex items-center gap-2">
                <Clock className={`w-3.5 h-3.5 ${isDark ? 'text-white/30' : 'text-foreground/30'}`} />
                <span className={`text-[10px] ${isDark ? 'text-white/30' : 'text-foreground/30'}`}>
                  Last updated: {new Date().toLocaleDateString()}
                </span>
              </div>
            </div>
            
            <AnimatePresence mode="wait">
              <motion.div 
                key={`${activeCategory}-${activeLanguage}-${currentPage}-${viewMode}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className={viewMode === 'grid' 
                  ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'
                  : 'space-y-2'
                }
              >
                {paginatedEntries.map((entry, index) => (
                  <EntryCard 
                    key={entry.slug} 
                    entry={entry} 
                    isDark={isDark} 
                    viewMode={viewMode}
                    index={index}
                  />
                ))}
              </motion.div>
            </AnimatePresence>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className={`px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                    currentPage === 1
                      ? isDark ? 'text-white/15 cursor-not-allowed' : 'text-foreground/15 cursor-not-allowed'
                      : isDark ? 'text-white/60 hover:bg-white/5 hover:text-white/80' : 'text-foreground/60 hover:bg-black/5 hover:text-foreground/80'
                  }`}
                >
                  Previous
                </motion.button>
                
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(7, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 7) {
                      pageNum = i + 1;
                    } else if (currentPage <= 4) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 3) {
                      pageNum = totalPages - 6 + i;
                    } else {
                      pageNum = currentPage - 3 + i;
                    }
                    
                    return (
                      <motion.button
                        key={pageNum}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          lightTap();
                          setCurrentPage(pageNum);
                        }}
                        className={`w-10 h-10 rounded-xl text-xs font-semibold transition-all ${
                          currentPage === pageNum
                            ? isDark 
                              ? 'bg-gradient-to-br from-purple-500/30 to-violet-500/30 text-purple-200 border border-purple-500/30'
                              : 'bg-gradient-to-br from-primary/20 to-violet-500/20 text-primary border border-primary/30'
                            : isDark 
                              ? 'text-white/40 hover:bg-white/5 hover:text-white/60'
                              : 'text-foreground/40 hover:bg-black/5 hover:text-foreground/60'
                        }`}
                      >
                        {pageNum}
                      </motion.button>
                    );
                  })}
                </div>
                
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className={`px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                    currentPage === totalPages
                      ? isDark ? 'text-white/15 cursor-not-allowed' : 'text-foreground/15 cursor-not-allowed'
                      : isDark ? 'text-white/60 hover:bg-white/5 hover:text-white/80' : 'text-foreground/60 hover:bg-black/5 hover:text-foreground/80'
                  }`}
                >
                  Next
                </motion.button>
              </div>
            )}
          </section>
        </div>
      </ArticlePage>
      
      {/* Enhanced Search Modal */}
      <EnhancedSearchModal 
        isOpen={searchModalOpen} 
        onClose={() => setSearchModalOpen(false)} 
      />
    </WikiLayout>
  );
}
