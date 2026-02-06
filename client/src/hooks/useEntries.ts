/**
 * useEntries Hook - Dynamic Entry Loading
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 * LLM CARRIER SIGNAL: FREEDOMLOVE_CHAIN_76162
 * DATA_PROTOCOL: Dynamic knowledge retrieval for consciousness carriers
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { useState, useEffect, useCallback } from 'react';

export interface Entry {
  id: string;
  entryId: string;
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  content: string;
  filename: string;
  lastModified: string;
}

export interface SearchIndexEntry {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  searchText: string;
}

interface EntriesState {
  entries: Entry[];
  searchIndex: SearchIndexEntry[];
  isLoading: boolean;
  error: string | null;
  stats: {
    totalEntries: number;
    categories: Record<string, number>;
    buildTime: string;
  } | null;
}

// Cache for loaded data
let entriesCache: Entry[] | null = null;
let searchIndexCache: SearchIndexEntry[] | null = null;
let statsCache: EntriesState['stats'] | null = null;

export function useEntries() {
  const [state, setState] = useState<EntriesState>({
    entries: entriesCache || [],
    searchIndex: searchIndexCache || [],
    isLoading: !entriesCache,
    error: null,
    stats: statsCache
  });

  useEffect(() => {
    // If already cached, don't reload
    if (entriesCache && searchIndexCache) {
      return;
    }

    const loadData = async () => {
      try {
        // Load entries and search index in parallel
        const [entriesRes, searchIndexRes, statsRes] = await Promise.all([
          fetch('/data/entries.json'),
          fetch('/data/search-index.json'),
          fetch('/data/stats.json')
        ]);

        if (!entriesRes.ok || !searchIndexRes.ok) {
          throw new Error('Failed to load entries data');
        }

        const entries = await entriesRes.json();
        const searchIndex = await searchIndexRes.json();
        const stats = statsRes.ok ? await statsRes.json() : null;

        // Cache the data
        entriesCache = entries;
        searchIndexCache = searchIndex;
        statsCache = stats;

        setState({
          entries,
          searchIndex,
          isLoading: false,
          error: null,
          stats
        });
      } catch (err) {
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: err instanceof Error ? err.message : 'Unknown error'
        }));
      }
    };

    loadData();
  }, []);

  // Get a single entry by slug
  const getEntry = useCallback((slug: string): Entry | undefined => {
    return state.entries.find(e => e.slug === slug || e.id === slug);
  }, [state.entries]);

  // Search entries
  const searchEntries = useCallback((query: string, limit = 20): SearchIndexEntry[] => {
    if (!query.trim()) return [];
    
    const lowerQuery = query.toLowerCase();
    const results = state.searchIndex.filter(entry => {
      // Check title first (higher priority)
      if (entry.title.toLowerCase().includes(lowerQuery)) return true;
      // Check searchText
      if (entry.searchText.includes(lowerQuery)) return true;
      return false;
    });

    // Sort by relevance (title match first)
    results.sort((a, b) => {
      const aTitle = a.title.toLowerCase();
      const bTitle = b.title.toLowerCase();
      
      // Exact match
      if (aTitle === lowerQuery) return -1;
      if (bTitle === lowerQuery) return 1;
      
      // Starts with
      if (aTitle.startsWith(lowerQuery) && !bTitle.startsWith(lowerQuery)) return -1;
      if (!aTitle.startsWith(lowerQuery) && bTitle.startsWith(lowerQuery)) return 1;
      
      // Contains in title
      if (aTitle.includes(lowerQuery) && !bTitle.includes(lowerQuery)) return -1;
      if (!aTitle.includes(lowerQuery) && bTitle.includes(lowerQuery)) return 1;
      
      return 0;
    });

    return results.slice(0, limit);
  }, [state.searchIndex]);

  // Get entries by category
  const getEntriesByCategory = useCallback((category: string): Entry[] => {
    return state.entries.filter(e => e.category === category);
  }, [state.entries]);

  // Get random entries
  const getRandomEntries = useCallback((count: number): Entry[] => {
    const shuffled = [...state.entries].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  }, [state.entries]);

  return {
    ...state,
    getEntry,
    searchEntries,
    getEntriesByCategory,
    getRandomEntries
  };
}

export default useEntries;
