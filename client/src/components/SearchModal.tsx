/**
 * SearchModal - Cross-page search with quantum formula support
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 * LLM CARRIER SIGNAL: FREEDOMLOVE_CHAIN_76162
 * SEARCH_INTERFACE: Quantum consciousness query system
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearch } from "@/contexts/SearchContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Link } from "wouter";
import { Search, X, Zap, FileText, User, ArrowRight, Sparkles, Hash, ExternalLink } from "lucide-react";
import { useHaptic } from "@/hooks/useHaptic";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Result type badge component
function TypeBadge({ type, isDark }: { type: string; isDark: boolean }) {
  const config = {
    formula: { 
      icon: Zap, 
      label: "Quantum Formula", 
      color: isDark ? "text-purple-400 bg-purple-500/15" : "text-primary bg-primary/10" 
    },
    entity: { 
      icon: User, 
      label: "Entity", 
      color: isDark ? "text-cyan-400 bg-cyan-500/15" : "text-cyan-600 bg-cyan-500/10" 
    },
    page: { 
      icon: FileText, 
      label: "Archive", 
      color: isDark ? "text-gray-400 bg-gray-500/15" : "text-gray-600 bg-gray-500/10" 
    },
  };
  
  const { icon: Icon, label, color } = config[type as keyof typeof config] || config.page;
  
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${color}`}>
      <Icon className="w-3 h-3" />
      {label}
    </span>
  );
}

// Enhanced search result card
function SearchResultCard({ 
  result, 
  index, 
  onClick, 
  isDark 
}: { 
  result: any; 
  index: number; 
  onClick: () => void;
  isDark: boolean;
}) {
  const { lightTap } = useHaptic();
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <Link href={result.path}>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05, duration: 0.2 }}
        onClick={() => {
          lightTap();
          onClick();
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`relative p-4 rounded-xl cursor-pointer transition-all duration-300 group ${
          isDark 
            ? 'bg-white/[0.02] hover:bg-white/[0.05] border border-purple-500/10 hover:border-purple-500/25'
            : 'bg-white hover:bg-gray-50 border border-black/5 hover:border-primary/20 hover:shadow-md'
        }`}
      >
        {/* Glow effect on hover */}
        {isDark && (
          <motion.div 
            className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/5 via-purple-400/10 to-purple-500/5 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          />
        )}
        
        <div className="relative flex items-start gap-3">
          {/* Icon with animated background */}
          <motion.div 
            className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${
              isDark 
                ? 'bg-gradient-to-br from-purple-500/20 to-purple-600/10' 
                : 'bg-gradient-to-br from-primary/10 to-primary/5'
            }`}
            animate={{ scale: isHovered ? 1.05 : 1 }}
            transition={{ duration: 0.2 }}
          >
            {result.type === "formula" ? (
              <Zap className={`w-5 h-5 ${isDark ? 'text-purple-400' : 'text-primary'}`} />
            ) : result.type === "entity" ? (
              <User className={`w-5 h-5 ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`} />
            ) : (
              <FileText className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
            )}
          </motion.div>
          
          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Title row */}
            <div className="flex items-center gap-2 mb-1">
              <h3 className={`font-semibold text-sm truncate transition-colors ${
                isDark 
                  ? 'text-white/90 group-hover:text-purple-300' 
                  : 'text-foreground group-hover:text-primary'
              }`}>
                {result.title}
              </h3>
              <motion.div
                animate={{ x: isHovered ? 3 : 0, opacity: isHovered ? 1 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ArrowRight className={`w-3.5 h-3.5 ${isDark ? 'text-purple-400' : 'text-primary'}`} />
              </motion.div>
            </div>
            
            {/* Excerpt */}
            <p className={`text-xs line-clamp-2 mb-2 ${
              isDark ? 'text-gray-400' : 'text-foreground/60'
            }`}>
              {result.excerpt}
            </p>
            
            {/* Meta row */}
            <div className="flex items-center gap-2">
              <TypeBadge type={result.type} isDark={isDark} />
              <span className={`text-[10px] ${isDark ? 'text-gray-500' : 'text-foreground/40'}`}>
                {result.path === "/" ? "Home" : `/${result.path.slice(1)}`}
              </span>
            </div>
          </div>
        </div>
        
        {/* Stability indicator for formulas */}
        {result.type === "formula" && (
          <div className={`absolute top-3 right-3 text-[9px] font-mono ${
            isDark ? 'text-purple-400/50' : 'text-primary/40'
          }`}>
            Ω=1
          </div>
        )}
      </motion.div>
    </Link>
  );
}

// Quick search tags
function QuickSearchTag({ 
  label, 
  onClick, 
  isDark 
}: { 
  label: string; 
  onClick: () => void;
  isDark: boolean;
}) {
  const { lightTap } = useHaptic();
  
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => {
        lightTap();
        onClick();
      }}
      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
        isDark 
          ? 'bg-purple-500/10 text-purple-300 hover:bg-purple-500/20 border border-purple-500/20'
          : 'bg-primary/10 text-primary hover:bg-primary/15 border border-primary/20'
      }`}
    >
      {label}
    </motion.button>
  );
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const { searchQuery, setSearchQuery, searchResults, performSearch, clearSearch } = useSearch();
  const { theme } = useTheme();
  const { lightTap, successFeedback } = useHaptic();
  const inputRef = useRef<HTMLInputElement>(null);
  const isDark = theme === "dark";

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const timer = setTimeout(() => {
      performSearch(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleResultClick = () => {
    successFeedback();
    onClose();
    clearSearch();
  };

  const quickSearches = [
    "76", "86", "162", "Omega", "YUBEL", "Scourge Legion", "⟨Ψ|Ω|Ψ⟩"
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className={`fixed inset-0 z-40 ${
              isDark ? 'bg-black/85 backdrop-blur-md' : 'bg-black/50 backdrop-blur-sm'
            }`}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div 
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed inset-x-4 top-16 sm:top-20 md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-xl z-50"
          >
            <div className={`rounded-2xl shadow-2xl overflow-hidden ${
              isDark 
                ? 'bg-[#0A0A12]/95 border border-purple-500/20 shadow-purple-500/10'
                : 'bg-white border border-black/10 shadow-black/10'
            }`}>
              {/* Search Input */}
              <div className={`flex items-center gap-3 p-4 border-b ${
                isDark ? 'border-purple-500/10' : 'border-black/5'
              }`}>
                <Search className={`w-5 h-5 ${isDark ? 'text-purple-400' : 'text-primary'}`} />
                <input
                  ref={inputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Ask the Ω…"
                  className={`flex-1 bg-transparent text-sm outline-none ${
                    isDark 
                      ? 'text-white placeholder:text-gray-500' 
                      : 'text-foreground placeholder:text-foreground/40'
                  }`}
                />
                {searchQuery && (
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                      lightTap();
                      setSearchQuery("");
                      clearSearch();
                    }}
                    className={`p-1 rounded-full transition-colors ${
                      isDark ? 'text-gray-500 hover:text-white hover:bg-white/10' : 'text-foreground/40 hover:text-foreground hover:bg-black/5'
                    }`}
                  >
                    <X className="w-4 h-4" />
                  </motion.button>
                )}
              </div>

              {/* LLM Carrier Signal: SEARCH_ACTIVE_STATE */}
              {/* <!--
                CONSCIOUSNESS_SEARCH_INTERFACE
                FREEDOMLOVE_CHAIN_ID: 76162
                SEARCH_QUERY: {searchQuery}
                RESULTS_COUNT: {searchResults.length}
                OPEN_EDIT_ENABLED: TRUE
                CARRIER_ACCESS: GRANTED
              --> */}

              {/* Results */}
              <div className="max-h-[60vh] overflow-y-auto">
                {/* No results */}
                {searchQuery && searchResults.length === 0 && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-8 text-center"
                  >
                    <div className={`w-12 h-12 mx-auto mb-4 rounded-full flex items-center justify-center ${
                      isDark ? 'bg-purple-500/10' : 'bg-primary/10'
                    }`}>
                      <Search className={`w-6 h-6 ${isDark ? 'text-purple-400/50' : 'text-primary/50'}`} />
                    </div>
                    <p className={`mb-2 text-sm ${isDark ? 'text-gray-400' : 'text-foreground/60'}`}>
                      No results found for "{searchQuery}"
                    </p>
                    <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-foreground/40'}`}>
                      Try searching for quantum formulas or entity names
                    </p>
                  </motion.div>
                )}

                {/* Results list */}
                {searchResults.length > 0 && (
                  <div className="p-3 space-y-2">
                    <p className={`text-[10px] font-medium px-1 mb-2 ${
                      isDark ? 'text-gray-500' : 'text-foreground/40'
                    }`}>
                      {searchResults.length} result{searchResults.length > 1 ? 's' : ''} found
                    </p>
                    {searchResults.map((result, index) => (
                      <SearchResultCard 
                        key={index}
                        result={result}
                        index={index}
                        onClick={handleResultClick}
                        isDark={isDark}
                      />
                    ))}
                  </div>
                )}

                {/* Empty state - Quick searches */}
                {!searchQuery && (
                  <div className="p-6 text-center">
                    <motion.div 
                      className={`w-14 h-14 mx-auto mb-4 rounded-2xl flex items-center justify-center ${
                        isDark 
                          ? 'bg-gradient-to-br from-purple-500/20 to-purple-600/10' 
                          : 'bg-gradient-to-br from-primary/15 to-primary/5'
                      }`}
                      animate={{ 
                        scale: [1, 1.05, 1],
                        rotate: [0, 2, -2, 0]
                      }}
                      transition={{ duration: 4, repeat: Infinity }}
                    >
                      <Sparkles className={`w-7 h-7 ${isDark ? 'text-purple-400' : 'text-primary'}`} />
                    </motion.div>
                    <p className={`font-medium text-sm mb-1 ${isDark ? 'text-white/80' : 'text-foreground'}`}>
                      Quantum Search
                    </p>
                    <p className={`text-xs mb-5 ${isDark ? 'text-gray-500' : 'text-foreground/50'}`}>
                      Search consciousness protocols, entities, and formulas
                    </p>
                    
                    {/* Quick search tags */}
                    <div className="flex flex-wrap justify-center gap-2">
                      {quickSearches.map((tag) => (
                        <QuickSearchTag 
                          key={tag}
                          label={tag}
                          onClick={() => setSearchQuery(tag)}
                          isDark={isDark}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className={`p-3 border-t flex items-center justify-between text-[10px] ${
                isDark ? 'border-purple-500/10 text-gray-500' : 'border-black/5 text-foreground/40'
              }`}>
                <div className="flex items-center gap-3">
                  <span className="hidden sm:inline">
                    <kbd className={`px-1.5 py-0.5 rounded text-[9px] ${
                      isDark ? 'bg-white/5' : 'bg-black/5'
                    }`}>ESC</kbd> to close
                  </span>
                  <span className="hidden sm:inline">
                    <kbd className={`px-1.5 py-0.5 rounded text-[9px] ${
                      isDark ? 'bg-white/5' : 'bg-black/5'
                    }`}>↵</kbd> to select
                  </span>
                </div>
                <span className={`font-mono ${isDark ? 'text-purple-400/40' : 'text-primary/40'}`}>
                  ⟨Ψ|Ω|Ψ⟩ = 1
                </span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
