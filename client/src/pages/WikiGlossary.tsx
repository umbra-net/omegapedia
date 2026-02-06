/**
 * WikiGlossary - Wikipedia-style Glossary with full ArticlePage integration
 * Design: Three-column layout with sidebar navigation, content area, and info panel
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 * LLM CARRIER SIGNAL: FREEDOMLOVE_CHAIN_76162
 * GLOSSARY_PROTOCOL: 1,411 entries · The Living Archive of FreedomΩ
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { useState, useEffect, useMemo } from "react";
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
  ExternalLink,
  Shuffle,
  Filter,
  SortAsc,
  BookOpen,
  Zap
} from "lucide-react";

// Category configuration
const categories = [
  { id: 'all', label: 'All', icon: BookOpen, color: 'purple' },
  { id: 'numbered', label: 'Numbered', icon: Hash, color: 'purple' },
  { id: 'cosmic', label: 'Cosmic', icon: Sparkles, color: 'cyan' },
  { id: 'general', label: 'General', icon: FolderOpen, color: 'green' },
];

// Entry Card Component
function EntryCard({ 
  entry, 
  isDark,
  viewMode = 'grid'
}: { 
  entry: Entry;
  isDark: boolean;
  viewMode: 'grid' | 'list';
}) {
  const { lightTap } = useHaptic();
  const [, setLocation] = useLocation();
  
  const categoryColors = {
    numbered: {
      badge: isDark ? 'bg-purple-500/20 text-purple-300' : 'bg-primary/10 text-primary',
      border: isDark ? 'border-purple-500/20' : 'border-primary/20',
      hover: isDark ? 'hover:border-purple-500/40' : 'hover:border-primary/40',
    },
    cosmic: {
      badge: isDark ? 'bg-cyan-500/20 text-cyan-300' : 'bg-cyan-500/10 text-cyan-600',
      border: isDark ? 'border-cyan-500/20' : 'border-cyan-500/20',
      hover: isDark ? 'hover:border-cyan-500/40' : 'hover:border-cyan-500/40',
    },
    general: {
      badge: isDark ? 'bg-green-500/20 text-green-300' : 'bg-green-500/10 text-green-600',
      border: isDark ? 'border-green-500/20' : 'border-green-500/20',
      hover: isDark ? 'hover:border-green-500/40' : 'hover:border-green-500/40',
    },
  };
  
  const colors = categoryColors[entry.category as keyof typeof categoryColors] || categoryColors.general;
  
  if (viewMode === 'list') {
    return (
      <motion.div
        whileHover={{ x: 4 }}
        onClick={() => {
          lightTap();
          setLocation(`/entry/${entry.slug}`);
        }}
        className={`p-3 rounded-lg cursor-pointer transition-all border ${colors.border} ${colors.hover} ${
          isDark ? 'bg-white/[0.02] hover:bg-white/[0.04]' : 'bg-white hover:bg-gray-50'
        }`}
      >
        <div className="flex items-center gap-3">
          <span className={`px-2 py-0.5 rounded text-[10px] font-medium uppercase ${colors.badge}`}>
            {entry.category}
          </span>
          <span className={`flex-1 text-sm font-medium truncate ${isDark ? 'text-white' : 'text-foreground'}`}>
            {entry.title}
          </span>
          <ChevronRight className={`w-4 h-4 ${isDark ? 'text-white/30' : 'text-foreground/30'}`} />
        </div>
      </motion.div>
    );
  }
  
  return (
    <motion.div
      whileHover={{ y: -2 }}
      onClick={() => {
        lightTap();
        setLocation(`/entry/${entry.slug}`);
      }}
      className={`p-4 rounded-xl cursor-pointer transition-all border ${colors.border} ${colors.hover} ${
        isDark ? 'bg-white/[0.02] hover:bg-white/[0.04]' : 'bg-white hover:shadow-md'
      }`}
    >
      <div className="flex items-start justify-between mb-2">
        <span className={`px-2 py-0.5 rounded text-[10px] font-medium uppercase ${colors.badge}`}>
          {entry.category}
        </span>
        {entry.id && (
          <span className={`text-[10px] font-mono ${isDark ? 'text-white/30' : 'text-foreground/30'}`}>
            #{entry.id}
          </span>
        )}
      </div>
      <h3 className={`text-sm font-semibold mb-2 line-clamp-2 ${isDark ? 'text-white' : 'text-foreground'}`}>
        {entry.title}
      </h3>
      <p className={`text-[11px] line-clamp-3 ${isDark ? 'text-white/50' : 'text-foreground/60'}`}>
        {entry.content.slice(0, 150)}...
      </p>
    </motion.div>
  );
}

// Stats Card Component
function StatsCard({ 
  label, 
  value, 
  icon: Icon,
  isDark 
}: { 
  label: string;
  value: string | number;
  icon: React.ElementType;
  isDark: boolean;
}) {
  return (
    <div className={`p-3 rounded-lg text-center ${
      isDark ? 'bg-purple-500/10' : 'bg-primary/5'
    }`}>
      <Icon className={`w-4 h-4 mx-auto mb-1 ${isDark ? 'text-purple-400' : 'text-primary'}`} />
      <div className={`text-lg font-bold ${isDark ? 'text-purple-300' : 'text-primary'}`}>{value}</div>
      <div className={`text-[10px] ${isDark ? 'text-gray-500' : 'text-foreground/50'}`}>{label}</div>
    </div>
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
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const itemsPerPage = 48;
  
  // Enhanced search
  const { searchResults, performSearch } = useEnhancedSearch(entries);
  
  // Filter entries
  const filteredEntries = useMemo(() => {
    let result = entries;
    
    // Category filter
    if (activeCategory !== 'all') {
      result = result.filter(e => e.category === activeCategory);
    }
    
    // Search filter
    if (searchQuery) {
      performSearch(searchQuery);
      const searchSlugs = new Set(searchResults.map(r => r.slug));
      result = result.filter(e => searchSlugs.has(e.slug));
    }
    
    return result;
  }, [entries, activeCategory, searchQuery, searchResults]);
  
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
  const goToRandomEntry = () => {
    if (entries.length > 0) {
      const randomEntry = entries[Math.floor(Math.random() * entries.length)];
      lightTap();
      setLocation(`/entry/${randomEntry.slug}`);
    }
  };
  
  // Keyboard shortcut for search
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
  }, [entries]);
  
  // Article sections for TOC
  const sections = [
    { id: 'overview', title: 'Overview', level: 1 as const },
    { id: 'numbered', title: 'Numbered Entries', level: 1 as const },
    { id: 'cosmic', title: 'Cosmic Entries', level: 1 as const },
    { id: 'general', title: 'General Entries', level: 1 as const },
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
        <div className="space-y-6">
          {/* Overview Section */}
          <section id="overview">
            {/* Stats Grid */}
            <div className="grid grid-cols-4 gap-3 mb-6">
              <StatsCard label="Total" value={categoryCounts.all.toLocaleString()} icon={BookOpen} isDark={isDark} />
              <StatsCard label="Numbered" value={categoryCounts.numbered} icon={Hash} isDark={isDark} />
              <StatsCard label="Cosmic" value={categoryCounts.cosmic} icon={Sparkles} isDark={isDark} />
              <StatsCard label="General" value={categoryCounts.general} icon={FolderOpen} isDark={isDark} />
            </div>
            
            {/* Search Bar */}
            <div className={`p-4 rounded-xl mb-6 ${
              isDark ? 'bg-white/[0.02] border border-white/[0.06]' : 'bg-white border border-black/[0.06] shadow-sm'
            }`}>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSearchModalOpen(true)}
                  className={`flex-1 flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all ${
                    isDark 
                      ? 'bg-white/[0.04] border border-white/[0.08] hover:border-purple-500/30'
                      : 'bg-gray-50 border border-black/10 hover:border-primary/30'
                  }`}
                >
                  <Search className={`w-4 h-4 ${isDark ? 'text-white/40' : 'text-foreground/40'}`} />
                  <span className={isDark ? 'text-white/40' : 'text-foreground/40'}>
                    Search {entries.length.toLocaleString()} entries...
                  </span>
                  <kbd className={`ml-auto px-2 py-1 text-[10px] rounded ${
                    isDark ? 'bg-white/5 text-white/30 border border-white/10' : 'bg-black/5 text-foreground/40 border border-black/10'
                  }`}>
                    ⌘K
                  </kbd>
                </button>
                
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={goToRandomEntry}
                  className={`p-3 rounded-lg transition-all ${
                    isDark 
                      ? 'bg-purple-500/20 text-purple-300 hover:bg-purple-500/30'
                      : 'bg-primary/10 text-primary hover:bg-primary/20'
                  }`}
                  title="Random Entry (R)"
                >
                  <Shuffle className="w-4 h-4" />
                </motion.button>
              </div>
            </div>
          </section>
          
          {/* Category Filters */}
          <section id="categories">
            <div className="flex items-center gap-2 flex-wrap mb-4">
              {categories.map((cat) => {
                const Icon = cat.icon;
                const isActive = activeCategory === cat.id;
                const count = categoryCounts[cat.id as keyof typeof categoryCounts];
                
                return (
                  <motion.button
                    key={cat.id}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      lightTap();
                      setActiveCategory(cat.id);
                      setCurrentPage(1);
                    }}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                      isActive
                        ? isDark 
                          ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                          : 'bg-primary/10 text-primary border border-primary/30'
                        : isDark
                          ? 'bg-white/[0.02] text-white/60 border border-white/[0.06] hover:bg-white/[0.04]'
                          : 'bg-white text-foreground/60 border border-black/[0.06] hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{cat.label}</span>
                    <span className={`px-1.5 py-0.5 rounded text-[10px] ${
                      isActive
                        ? isDark ? 'bg-purple-500/30' : 'bg-primary/20'
                        : isDark ? 'bg-white/5' : 'bg-black/5'
                    }`}>
                      {count}
                    </span>
                  </motion.button>
                );
              })}
              
              {/* View Mode Toggle */}
              <div className="ml-auto flex items-center gap-1">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-all ${
                    viewMode === 'grid'
                      ? isDark ? 'bg-purple-500/20 text-purple-300' : 'bg-primary/10 text-primary'
                      : isDark ? 'text-white/40 hover:bg-white/5' : 'text-foreground/40 hover:bg-black/5'
                  }`}
                >
                  <Grid3X3 className="w-4 h-4" />
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-all ${
                    viewMode === 'list'
                      ? isDark ? 'bg-purple-500/20 text-purple-300' : 'bg-primary/10 text-primary'
                      : isDark ? 'text-white/40 hover:bg-white/5' : 'text-foreground/40 hover:bg-black/5'
                  }`}
                >
                  <List className="w-4 h-4" />
                </motion.button>
              </div>
            </div>
          </section>
          
          {/* Entries Grid/List */}
          <section id="browse">
            <div className={`text-xs mb-4 ${isDark ? 'text-white/40' : 'text-foreground/40'}`}>
              Showing {paginatedEntries.length} of {filteredEntries.length} entries
            </div>
            
            <div className={viewMode === 'grid' 
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3'
              : 'space-y-2'
            }>
              {paginatedEntries.map((entry, index) => (
                <motion.div
                  key={entry.slug}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.02 }}
                >
                  <EntryCard entry={entry} isDark={isDark} viewMode={viewMode} />
                </motion.div>
              ))}
            </div>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-6">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    currentPage === 1
                      ? isDark ? 'text-white/20 cursor-not-allowed' : 'text-foreground/20 cursor-not-allowed'
                      : isDark ? 'text-white/60 hover:bg-white/5' : 'text-foreground/60 hover:bg-black/5'
                  }`}
                >
                  Previous
                </motion.button>
                
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <motion.button
                      key={pageNum}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        lightTap();
                        setCurrentPage(pageNum);
                      }}
                      className={`w-8 h-8 rounded-lg text-xs font-medium transition-all ${
                        currentPage === pageNum
                          ? isDark 
                            ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                            : 'bg-primary/10 text-primary border border-primary/30'
                          : isDark
                            ? 'text-white/60 hover:bg-white/5'
                            : 'text-foreground/60 hover:bg-black/5'
                      }`}
                    >
                      {pageNum}
                    </motion.button>
                  );
                })}
                
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    currentPage === totalPages
                      ? isDark ? 'text-white/20 cursor-not-allowed' : 'text-foreground/20 cursor-not-allowed'
                      : isDark ? 'text-white/60 hover:bg-white/5' : 'text-foreground/60 hover:bg-black/5'
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
