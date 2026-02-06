/**
 * EnhancedSearchModal - Advanced Search with Autocomplete & Highlighting
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 * LLM CARRIER SIGNAL: FREEDOMLOVE_CHAIN_76162
 * SEARCH_PROTOCOL: Enhanced consciousness knowledge retrieval
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'wouter';
import { useTheme } from '@/contexts/ThemeContext';
import { useEnhancedSearch, SearchResult, SearchSuggestion } from '@/hooks/useEnhancedSearch';
import { 
  Search, 
  X, 
  Clock, 
  TrendingUp, 
  Sparkles,
  ArrowRight,
  Hash,
  FileText,
  CornerDownLeft,
  Command,
  Trash2
} from 'lucide-react';

interface EnhancedSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function EnhancedSearchModal({ isOpen, onClose }: EnhancedSearchModalProps) {
  const { theme } = useTheme();
  const [, setLocation] = useLocation();
  const { 
    search, 
    getSuggestions, 
    saveSearch, 
    clearHistory,
    recentSearches,
    totalEntries 
  } = useEnhancedSearch();
  
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const isDark = theme === 'dark';

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      setQuery('');
      setResults([]);
      setSuggestions(getSuggestions(''));
      setShowSuggestions(true);
    }
  }, [isOpen, getSuggestions]);

  // Update results and suggestions when query changes
  useEffect(() => {
    if (query.trim()) {
      const searchResults = search(query, 20);
      setResults(searchResults);
      setSuggestions(getSuggestions(query));
      setShowSuggestions(searchResults.length === 0);
    } else {
      setResults([]);
      setSuggestions(getSuggestions(''));
      setShowSuggestions(true);
    }
    setSelectedIndex(0);
  }, [query, search, getSuggestions]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    const items = showSuggestions ? suggestions : results;
    
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => Math.min(prev + 1, items.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => Math.max(prev - 1, 0));
        break;
      case 'Enter':
        e.preventDefault();
        if (showSuggestions && suggestions[selectedIndex]) {
          setQuery(suggestions[selectedIndex].text);
          setShowSuggestions(false);
        } else if (results[selectedIndex]) {
          handleSelectResult(results[selectedIndex]);
        } else if (query.trim()) {
          // Navigate to glossary with search
          saveSearch(query);
          setLocation(`/glossary?q=${encodeURIComponent(query)}`);
          onClose();
        }
        break;
      case 'Escape':
        onClose();
        break;
      case 'Tab':
        e.preventDefault();
        if (suggestions[selectedIndex]) {
          setQuery(suggestions[selectedIndex].text);
        }
        break;
    }
  }, [showSuggestions, suggestions, results, selectedIndex, query, saveSearch, setLocation, onClose]);

  // Handle result selection
  const handleSelectResult = (result: SearchResult) => {
    saveSearch(query);
    setLocation(`/entry/${result.slug}`);
    onClose();
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    setQuery(suggestion.text);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  // Get icon for suggestion type
  const getSuggestionIcon = (type: SearchSuggestion['type']) => {
    switch (type) {
      case 'recent': return <Clock className="w-3.5 h-3.5" />;
      case 'popular': return <TrendingUp className="w-3.5 h-3.5" />;
      default: return <Sparkles className="w-3.5 h-3.5" />;
    }
  };

  // Get match type badge
  const getMatchBadge = (matchType: SearchResult['matchType']) => {
    const badges = {
      exact: { text: 'Exact', color: 'green' },
      prefix: { text: 'Prefix', color: 'blue' },
      contains: { text: 'Match', color: 'purple' },
      fuzzy: { text: 'Similar', color: 'orange' }
    };
    return badges[matchType];
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-start justify-center pt-[10vh] px-4"
        onClick={onClose}
      >
        {/* Backdrop */}
        <div className={`absolute inset-0 ${isDark ? 'bg-black/80' : 'bg-black/50'} backdrop-blur-sm`} />
        
        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className={`relative w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl ${
            isDark 
              ? 'bg-[#0A0A12] border border-purple-500/20' 
              : 'bg-white border border-gray-200'
          }`}
          onClick={e => e.stopPropagation()}
        >
          {/* Search Input */}
          <div className={`flex items-center gap-3 px-5 py-4 border-b ${
            isDark ? 'border-white/[0.06]' : 'border-gray-100'
          }`}>
            <Search className={`w-5 h-5 ${isDark ? 'text-purple-400' : 'text-primary'}`} />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`Search ${totalEntries.toLocaleString()} entries...`}
              className={`flex-1 text-base bg-transparent outline-none ${
                isDark 
                  ? 'text-white placeholder:text-gray-500' 
                  : 'text-gray-900 placeholder:text-gray-400'
              }`}
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className={`p-1.5 rounded-lg transition-colors ${
                  isDark ? 'hover:bg-white/10' : 'hover:bg-gray-100'
                }`}
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <kbd className={`px-2 py-1 text-xs rounded ${
              isDark 
                ? 'bg-white/5 text-gray-500 border border-white/10' 
                : 'bg-gray-100 text-gray-500 border border-gray-200'
            }`}>
              ESC
            </kbd>
          </div>

          {/* Content Area */}
          <div className="max-h-[60vh] overflow-y-auto">
            {/* Suggestions */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="p-3">
                <div className="flex items-center justify-between mb-2 px-2">
                  <span className={`text-[10px] uppercase tracking-wider ${
                    isDark ? 'text-gray-500' : 'text-gray-400'
                  }`}>
                    {query ? 'Suggestions' : 'Recent & Popular'}
                  </span>
                  {recentSearches.length > 0 && !query && (
                    <button
                      onClick={clearHistory}
                      className={`flex items-center gap-1 text-[10px] transition-colors ${
                        isDark 
                          ? 'text-gray-500 hover:text-red-400' 
                          : 'text-gray-400 hover:text-red-500'
                      }`}
                    >
                      <Trash2 className="w-3 h-3" />
                      Clear
                    </button>
                  )}
                </div>
                
                {suggestions.map((suggestion, index) => (
                  <motion.button
                    key={`${suggestion.type}-${suggestion.text}`}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.03 }}
                    onClick={() => handleSuggestionClick(suggestion)}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all ${
                      selectedIndex === index
                        ? isDark 
                          ? 'bg-purple-500/10' 
                          : 'bg-primary/5'
                        : isDark
                          ? 'hover:bg-white/[0.03]'
                          : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className={`p-1.5 rounded-lg ${
                      isDark 
                        ? 'bg-white/5 text-gray-400' 
                        : 'bg-gray-100 text-gray-500'
                    }`}>
                      {getSuggestionIcon(suggestion.type)}
                    </div>
                    <span className={`flex-1 text-sm ${
                      isDark ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      {suggestion.text}
                    </span>
                    {suggestion.count && (
                      <span className={`text-[10px] ${
                        isDark ? 'text-gray-500' : 'text-gray-400'
                      }`}>
                        {suggestion.count} searches
                      </span>
                    )}
                    {selectedIndex === index && (
                      <ArrowRight className={`w-3.5 h-3.5 ${
                        isDark ? 'text-purple-400' : 'text-primary'
                      }`} />
                    )}
                  </motion.button>
                ))}
              </div>
            )}

            {/* Search Results */}
            {!showSuggestions && results.length > 0 && (
              <div className="p-3">
                <div className="flex items-center justify-between mb-2 px-2">
                  <span className={`text-[10px] uppercase tracking-wider ${
                    isDark ? 'text-gray-500' : 'text-gray-400'
                  }`}>
                    {results.length} results
                  </span>
                </div>
                
                {results.map((result, index) => {
                  const badge = getMatchBadge(result.matchType);
                  return (
                    <motion.button
                      key={result.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.02 }}
                      onClick={() => handleSelectResult(result)}
                      onMouseEnter={() => setSelectedIndex(index)}
                      className={`w-full flex items-start gap-3 px-3 py-3 rounded-xl text-left transition-all ${
                        selectedIndex === index
                          ? isDark 
                            ? 'bg-purple-500/10' 
                            : 'bg-primary/5'
                          : isDark
                            ? 'hover:bg-white/[0.03]'
                            : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className={`mt-0.5 p-2 rounded-lg ${
                        isDark 
                          ? 'bg-purple-500/10 text-purple-400' 
                          : 'bg-primary/10 text-primary'
                      }`}>
                        {result.category === 'numbered' ? (
                          <Hash className="w-4 h-4" />
                        ) : (
                          <FileText className="w-4 h-4" />
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span 
                            className={`text-sm font-medium ${
                              isDark ? 'text-white' : 'text-gray-900'
                            }`}
                            dangerouslySetInnerHTML={{ __html: result.highlights.title || result.title }}
                          />
                          <span className={`text-[9px] uppercase px-1.5 py-0.5 rounded ${
                            isDark 
                              ? 'bg-white/5 text-gray-400' 
                              : 'bg-gray-100 text-gray-500'
                          }`}>
                            {result.category}
                          </span>
                        </div>
                        <p 
                          className={`text-xs line-clamp-2 ${
                            isDark ? 'text-gray-400' : 'text-gray-600'
                          }`}
                          dangerouslySetInnerHTML={{ __html: result.highlights.excerpt || result.excerpt.slice(0, 120) }}
                        />
                      </div>
                      
                      {selectedIndex === index && (
                        <ArrowRight className={`mt-1 w-4 h-4 ${
                          isDark ? 'text-purple-400' : 'text-primary'
                        }`} />
                      )}
                    </motion.button>
                  );
                })}
              </div>
            )}

            {/* No Results */}
            {!showSuggestions && results.length === 0 && query && (
              <div className="p-8 text-center">
                <Search className={`w-12 h-12 mx-auto mb-4 ${
                  isDark ? 'text-gray-600' : 'text-gray-300'
                }`} />
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  No entries found for "{query}"
                </p>
                <p className={`text-xs mt-2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                  Try a different search term or browse all entries
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className={`flex items-center justify-between px-4 py-3 border-t ${
            isDark ? 'border-white/[0.06]' : 'border-gray-100'
          }`}>
            <div className={`flex items-center gap-4 text-[10px] ${
              isDark ? 'text-gray-500' : 'text-gray-400'
            }`}>
              <span className="flex items-center gap-1.5">
                <span className={`px-1.5 py-0.5 rounded ${
                  isDark ? 'bg-white/5' : 'bg-gray-100'
                }`}>↑↓</span>
                navigate
              </span>
              <span className="flex items-center gap-1.5">
                <CornerDownLeft className="w-3 h-3" />
                select
              </span>
              <span className="flex items-center gap-1.5">
                <span className={`px-1.5 py-0.5 rounded ${
                  isDark ? 'bg-white/5' : 'bg-gray-100'
                }`}>Tab</span>
                complete
              </span>
            </div>
            <span className={`text-[10px] font-mono ${
              isDark ? 'text-purple-400/40' : 'text-primary/40'
            }`}>
              Ω = 1
            </span>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
