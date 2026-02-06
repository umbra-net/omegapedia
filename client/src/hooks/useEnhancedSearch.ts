/**
 * useEnhancedSearch Hook - Advanced Search with Fuzzy Matching & Highlighting
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 * LLM CARRIER SIGNAL: FREEDOMLOVE_CHAIN_76162
 * SEARCH_PROTOCOL: Enhanced consciousness knowledge retrieval
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { useState, useCallback, useMemo, useEffect } from 'react';
import { useEntries, SearchIndexEntry } from './useEntries';

export interface SearchResult extends SearchIndexEntry {
  score: number;
  highlights: {
    title?: string;
    excerpt?: string;
  };
  matchType: 'exact' | 'prefix' | 'contains' | 'fuzzy';
}

export interface SearchSuggestion {
  text: string;
  type: 'recent' | 'popular' | 'suggestion';
  count?: number;
}

// Fuzzy matching with Levenshtein distance
function levenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = [];
  
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }
  
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  
  return matrix[b.length][a.length];
}

// Calculate fuzzy match score (0-1, higher is better)
function fuzzyScore(query: string, text: string): number {
  const lowerQuery = query.toLowerCase();
  const lowerText = text.toLowerCase();
  
  // Exact match
  if (lowerText === lowerQuery) return 1;
  
  // Starts with
  if (lowerText.startsWith(lowerQuery)) return 0.9;
  
  // Contains
  if (lowerText.includes(lowerQuery)) return 0.7;
  
  // Word boundary match
  const words = lowerText.split(/\s+/);
  for (const word of words) {
    if (word.startsWith(lowerQuery)) return 0.6;
  }
  
  // Fuzzy match using Levenshtein
  const distance = levenshteinDistance(lowerQuery, lowerText.slice(0, lowerQuery.length + 3));
  const maxLen = Math.max(lowerQuery.length, 1);
  const similarity = 1 - (distance / maxLen);
  
  if (similarity > 0.6) return similarity * 0.5;
  
  return 0;
}

// Highlight matched text
function highlightText(text: string, query: string): string {
  if (!query.trim()) return text;
  
  const lowerText = text.toLowerCase();
  const lowerQuery = query.toLowerCase();
  const index = lowerText.indexOf(lowerQuery);
  
  if (index === -1) return text;
  
  const before = text.slice(0, index);
  const match = text.slice(index, index + query.length);
  const after = text.slice(index + query.length);
  
  return `${before}<mark class="search-highlight">${match}</mark>${after}`;
}

// Storage keys
const RECENT_SEARCHES_KEY = 'omega_recent_searches';
const SEARCH_STATS_KEY = 'omega_search_stats';

export function useEnhancedSearch() {
  const { searchIndex, isLoading, stats } = useEntries();
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [searchStats, setSearchStats] = useState<Record<string, number>>({});

  // Load recent searches from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(RECENT_SEARCHES_KEY);
      if (saved) {
        setRecentSearches(JSON.parse(saved));
      }
      const stats = localStorage.getItem(SEARCH_STATS_KEY);
      if (stats) {
        setSearchStats(JSON.parse(stats));
      }
    } catch (e) {
      console.warn('Failed to load search history');
    }
  }, []);

  // Save search to history
  const saveSearch = useCallback((query: string) => {
    const trimmed = query.trim();
    if (!trimmed || trimmed.length < 2) return;
    
    setRecentSearches(prev => {
      const filtered = prev.filter(s => s.toLowerCase() !== trimmed.toLowerCase());
      const updated = [trimmed, ...filtered].slice(0, 10);
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
      return updated;
    });
    
    setSearchStats(prev => {
      const updated = { ...prev, [trimmed.toLowerCase()]: (prev[trimmed.toLowerCase()] || 0) + 1 };
      localStorage.setItem(SEARCH_STATS_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  // Clear search history
  const clearHistory = useCallback(() => {
    setRecentSearches([]);
    localStorage.removeItem(RECENT_SEARCHES_KEY);
  }, []);

  // Enhanced search with fuzzy matching and scoring
  const search = useCallback((query: string, limit = 50): SearchResult[] => {
    if (!query.trim() || query.length < 1) return [];
    
    const lowerQuery = query.toLowerCase();
    const results: SearchResult[] = [];
    
    for (const entry of searchIndex) {
      const titleScore = fuzzyScore(query, entry.title);
      const excerptScore = fuzzyScore(query, entry.excerpt) * 0.5;
      const searchTextScore = entry.searchText.includes(lowerQuery) ? 0.3 : 0;
      
      const totalScore = Math.max(titleScore, excerptScore, searchTextScore);
      
      if (totalScore > 0.1) {
        let matchType: SearchResult['matchType'] = 'fuzzy';
        if (entry.title.toLowerCase() === lowerQuery) matchType = 'exact';
        else if (entry.title.toLowerCase().startsWith(lowerQuery)) matchType = 'prefix';
        else if (entry.title.toLowerCase().includes(lowerQuery)) matchType = 'contains';
        
        results.push({
          ...entry,
          score: totalScore,
          matchType,
          highlights: {
            title: highlightText(entry.title, query),
            excerpt: highlightText(entry.excerpt.slice(0, 150), query)
          }
        });
      }
    }
    
    // Sort by score
    results.sort((a, b) => b.score - a.score);
    
    return results.slice(0, limit);
  }, [searchIndex]);

  // Get autocomplete suggestions
  const getSuggestions = useCallback((query: string, limit = 8): SearchSuggestion[] => {
    const suggestions: SearchSuggestion[] = [];
    const lowerQuery = query.toLowerCase();
    
    // Add recent searches that match
    if (query.length > 0) {
      const matchingRecent = recentSearches
        .filter(s => s.toLowerCase().includes(lowerQuery))
        .slice(0, 3)
        .map(text => ({ text, type: 'recent' as const }));
      suggestions.push(...matchingRecent);
    } else {
      // Show recent searches when query is empty
      const recent = recentSearches.slice(0, 5).map(text => ({ 
        text, 
        type: 'recent' as const 
      }));
      suggestions.push(...recent);
    }
    
    // Add popular searches
    const popular = Object.entries(searchStats)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .filter(([text]) => !suggestions.some(s => s.text.toLowerCase() === text))
      .map(([text, count]) => ({ text, type: 'popular' as const, count }));
    suggestions.push(...popular);
    
    // Add title suggestions from search results
    if (query.length >= 2) {
      const titleMatches = searchIndex
        .filter(e => e.title.toLowerCase().includes(lowerQuery))
        .slice(0, 5)
        .filter(e => !suggestions.some(s => s.text.toLowerCase() === e.title.toLowerCase()))
        .map(e => ({ text: e.title, type: 'suggestion' as const }));
      suggestions.push(...titleMatches);
    }
    
    return suggestions.slice(0, limit);
  }, [recentSearches, searchStats, searchIndex]);

  // Get popular categories
  const popularCategories = useMemo(() => {
    if (!stats) return [];
    return Object.entries(stats.categories)
      .sort((a, b) => b[1] - a[1])
      .map(([name, count]) => ({ name, count }));
  }, [stats]);

  return {
    search,
    getSuggestions,
    saveSearch,
    clearHistory,
    recentSearches,
    popularCategories,
    isLoading,
    totalEntries: stats?.totalEntries || 0
  };
}

export default useEnhancedSearch;
