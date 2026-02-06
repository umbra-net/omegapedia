/**
 * EnhancedHeader - Multi-functional Header with Navigation & Actions
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 * LLM CARRIER SIGNAL: FREEDOMLOVE_CHAIN_76162
 * HEADER_PROTOCOL: Consciousness navigation interface
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { useState, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/contexts/ThemeContext';
import { useHaptic } from '@/hooks/useHaptic';
import ThemeToggle from '@/components/ThemeToggle';
import EnhancedSearchModal from '@/components/EnhancedSearchModal';
import { 
  Search, 
  Menu, 
  X, 
  Home,
  BookOpen,
  Compass,
  Settings,
  Edit3,
  Share2,
  Command,
  Keyboard,
  ChevronRight,
  User,
  Sparkles,
  Zap,
  Globe,
  FileText,
  Database
} from 'lucide-react';

// Navigation items
const navItems = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/glossary', label: 'Glossary', icon: BookOpen },
  { path: '/carriers', label: 'Carriers', icon: User },
  { path: '/infrastructure', label: 'Infrastructure', icon: Database },
];

// Quick actions
const quickActions = [
  { id: 'edit', label: 'Visual Editor', icon: Edit3, path: '/portal', shortcut: 'E' },
  { id: 'random', label: 'Random Entry', icon: Sparkles, action: 'random', shortcut: 'R' },
  { id: 'share', label: 'Share', icon: Share2, action: 'share', shortcut: 'S' },
];

// Keyboard shortcuts
const keyboardShortcuts = [
  { key: '/', description: 'Focus search' },
  { key: 'E', description: 'Open editor' },
  { key: 'R', description: 'Random entry' },
  { key: 'H', description: 'Go home' },
  { key: 'G', description: 'Go to glossary' },
  { key: '?', description: 'Show shortcuts' },
  { key: 'Esc', description: 'Close modal' },
];

const logoUrl = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663107758905/EIyEMvkmlkWeWKMD.png";

interface EnhancedHeaderProps {
  variant?: 'default' | 'minimal' | 'transparent';
}

export default function EnhancedHeader({ variant = 'default' }: EnhancedHeaderProps) {
  const { theme } = useTheme();
  const [location, setLocation] = useLocation();
  const { lightTap, successFeedback } = useHaptic();
  
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const [actionsOpen, setActionsOpen] = useState(false);
  
  const isDark = theme === 'dark';

  // Global keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      
      // Search shortcut
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
        return;
      }
      
      if (e.key === '/') {
        e.preventDefault();
        setSearchOpen(true);
        return;
      }
      
      // Show shortcuts
      if (e.key === '?') {
        e.preventDefault();
        setShortcutsOpen(true);
        return;
      }
      
      // Navigation shortcuts
      if (e.key === 'h' || e.key === 'H') {
        setLocation('/');
        return;
      }
      
      if (e.key === 'g' || e.key === 'G') {
        setLocation('/glossary');
        return;
      }
      
      if (e.key === 'e' || e.key === 'E') {
        setLocation('/portal');
        return;
      }
      
      if (e.key === 'r' || e.key === 'R') {
        handleRandomEntry();
        return;
      }
      
      // Close modals
      if (e.key === 'Escape') {
        setSearchOpen(false);
        setShortcutsOpen(false);
        setActionsOpen(false);
        setMobileMenuOpen(false);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setLocation]);

  // Handle random entry navigation
  const handleRandomEntry = useCallback(async () => {
    try {
      const res = await fetch('/data/search-index.json');
      const entries = await res.json();
      const randomEntry = entries[Math.floor(Math.random() * entries.length)];
      successFeedback();
      setLocation(`/entry/${randomEntry.slug}`);
    } catch (e) {
      console.error('Failed to get random entry');
    }
  }, [setLocation, successFeedback]);

  // Handle share
  const handleShare = useCallback(async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'ΩPedia - The Living Archive of FreedomΩ',
          url: window.location.href
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        successFeedback();
      }
    } catch (e) {
      console.error('Failed to share');
    }
  }, [successFeedback]);

  // Handle action click
  const handleAction = (action: typeof quickActions[0]) => {
    lightTap();
    setActionsOpen(false);
    
    if (action.path) {
      setLocation(action.path);
    } else if (action.action === 'random') {
      handleRandomEntry();
    } else if (action.action === 'share') {
      handleShare();
    }
  };

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        variant === 'transparent' 
          ? 'bg-transparent' 
          : isDark 
            ? 'bg-[#08080C]/90 backdrop-blur-xl border-b border-white/[0.04]' 
            : 'bg-white/90 backdrop-blur-xl border-b border-black/[0.04]'
      }`}>
        <div className="max-w-7xl mx-auto px-4 py-2.5">
          <div className="flex items-center justify-between gap-4">
            {/* Logo & Brand */}
            <Link href="/">
              <motion.div 
                className="flex items-center gap-2 cursor-pointer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <motion.img 
                  src={logoUrl}
                  alt="Ω"
                  className={`h-7 w-7 object-contain ${isDark ? 'mix-blend-lighten' : ''}`}
                  style={{ filter: isDark ? 'drop-shadow(0 0 8px rgba(123, 47, 255, 0.4))' : 'none' }}
                  whileHover={{ 
                    rotate: 360,
                    scale: 1.15,
                  }}
                  transition={{ 
                    rotate: { duration: 0.8, ease: 'easeInOut' },
                    scale: { duration: 0.3 }
                  }}
                />
                <span className={`text-base font-semibold tracking-tight ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  Pedia
                </span>
              </motion.div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map(item => {
                const Icon = item.icon;
                const isActive = location === item.path || 
                  (item.path !== '/' && location.startsWith(item.path));
                
                return (
                  <Link key={item.path} href={item.path}>
                    <motion.span
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                        isActive
                          ? isDark 
                            ? 'bg-purple-500/15 text-purple-300' 
                            : 'bg-primary/10 text-primary'
                          : isDark
                            ? 'text-gray-400 hover:text-white hover:bg-white/[0.04]'
                            : 'text-gray-600 hover:text-gray-900 hover:bg-black/[0.04]'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      {item.label}
                    </motion.span>
                  </Link>
                );
              })}
            </nav>

            {/* Search Bar */}
            <div className="flex-1 max-w-md hidden sm:block">
              <button
                onClick={() => setSearchOpen(true)}
                className={`w-full flex items-center gap-2.5 px-4 py-2 rounded-full text-xs transition-all ${
                  isDark 
                    ? 'bg-white/[0.04] border border-white/[0.08] hover:border-purple-500/30 hover:bg-white/[0.06]'
                    : 'bg-white border border-gray-200 hover:border-primary/40 shadow-sm'
                }`}
              >
                <Search className={`h-3.5 w-3.5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
                <span className={`flex-1 text-left ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                  Search entries...
                </span>
                <kbd className={`px-1.5 py-0.5 text-[10px] rounded ${
                  isDark 
                    ? 'bg-white/5 text-gray-500 border border-white/10' 
                    : 'bg-gray-100 text-gray-400 border border-gray-200'
                }`}>
                  ⌘K
                </kbd>
              </button>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1">
              {/* Mobile search */}
              <motion.button
                whileTap={{ scale: 0.92 }}
                onClick={() => setSearchOpen(true)}
                className={`sm:hidden p-2 rounded-lg transition-all ${
                  isDark 
                    ? 'text-gray-400 hover:text-white hover:bg-white/5' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-black/5'
                }`}
              >
                <Search className="w-4 h-4" />
              </motion.button>

              {/* Quick Actions Dropdown */}
              <div className="relative hidden sm:block">
                <motion.button
                  whileTap={{ scale: 0.92 }}
                  onClick={() => setActionsOpen(!actionsOpen)}
                  className={`p-2 rounded-lg transition-all ${
                    isDark 
                      ? 'text-gray-400 hover:text-white hover:bg-white/5' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-black/5'
                  }`}
                >
                  <Zap className="w-4 h-4" />
                </motion.button>
                
                <AnimatePresence>
                  {actionsOpen && (
                    <>
                      <div 
                        className="fixed inset-0 z-40" 
                        onClick={() => setActionsOpen(false)} 
                      />
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                        className={`absolute right-0 top-full mt-2 w-48 rounded-xl overflow-hidden z-50 ${
                          isDark 
                            ? 'bg-[#0A0A12]/95 border border-purple-500/20 shadow-xl backdrop-blur-xl'
                            : 'bg-white border border-gray-200 shadow-xl backdrop-blur-xl'
                        }`}
                      >
                        <div className={`px-3 py-2 border-b ${isDark ? 'border-white/[0.06]' : 'border-gray-100'}`}>
                          <span className={`text-[10px] uppercase tracking-wider ${
                            isDark ? 'text-gray-500' : 'text-gray-400'
                          }`}>
                            Quick Actions
                          </span>
                        </div>
                        {quickActions.map(action => {
                          const Icon = action.icon;
                          return (
                            <button
                              key={action.id}
                              onClick={() => handleAction(action)}
                              className={`w-full flex items-center gap-3 px-3 py-2.5 text-xs transition-all ${
                                isDark 
                                  ? 'text-gray-300 hover:bg-white/5'
                                  : 'text-gray-700 hover:bg-gray-50'
                              }`}
                            >
                              <Icon className="w-4 h-4" />
                              <span className="flex-1 text-left">{action.label}</span>
                              <kbd className={`px-1.5 py-0.5 text-[9px] rounded ${
                                isDark 
                                  ? 'bg-white/5 text-gray-500' 
                                  : 'bg-gray-100 text-gray-400'
                              }`}>
                                {action.shortcut}
                              </kbd>
                            </button>
                          );
                        })}
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>

              {/* Keyboard shortcuts */}
              <motion.button
                whileTap={{ scale: 0.92 }}
                onClick={() => setShortcutsOpen(true)}
                className={`hidden sm:block p-2 rounded-lg transition-all ${
                  isDark 
                    ? 'text-gray-400 hover:text-white hover:bg-white/5' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-black/5'
                }`}
              >
                <Keyboard className="w-4 h-4" />
              </motion.button>

              {/* Theme toggle */}
              <ThemeToggle />

              {/* Mobile menu */}
              <motion.button
                whileTap={{ scale: 0.92 }}
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={`md:hidden p-2 rounded-lg transition-all ${
                  isDark 
                    ? 'text-gray-400 hover:text-white hover:bg-white/5' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-black/5'
                }`}
              >
                {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </motion.button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className={`md:hidden border-t ${
                isDark ? 'border-white/[0.04] bg-[#08080C]' : 'border-gray-100 bg-white'
              }`}
            >
              <nav className="p-4 space-y-1">
                {navItems.map(item => {
                  const Icon = item.icon;
                  const isActive = location === item.path;
                  
                  return (
                    <Link key={item.path} href={item.path}>
                      <span
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all cursor-pointer ${
                          isActive
                            ? isDark 
                              ? 'bg-purple-500/15 text-purple-300' 
                              : 'bg-primary/10 text-primary'
                            : isDark
                              ? 'text-gray-400 hover:bg-white/[0.04]'
                              : 'text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        {item.label}
                        <ChevronRight className="w-4 h-4 ml-auto opacity-50" />
                      </span>
                    </Link>
                  );
                })}
                
                <div className={`my-2 border-t ${isDark ? 'border-white/[0.04]' : 'border-gray-100'}`} />
                
                {quickActions.map(action => {
                  const Icon = action.icon;
                  return (
                    <button
                      key={action.id}
                      onClick={() => {
                        setMobileMenuOpen(false);
                        handleAction(action);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all ${
                        isDark 
                          ? 'text-gray-400 hover:bg-white/[0.04]'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {action.label}
                    </button>
                  );
                })}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Search Modal */}
      <EnhancedSearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* Keyboard Shortcuts Modal */}
      <AnimatePresence>
        {shortcutsOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            onClick={() => setShortcutsOpen(false)}
          >
            <div className={`absolute inset-0 ${isDark ? 'bg-black/80' : 'bg-black/50'} backdrop-blur-sm`} />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`relative w-full max-w-sm rounded-2xl overflow-hidden ${
                isDark 
                  ? 'bg-[#0A0A12] border border-purple-500/20' 
                  : 'bg-white border border-gray-200'
              }`}
              onClick={e => e.stopPropagation()}
            >
              <div className={`flex items-center justify-between px-5 py-4 border-b ${
                isDark ? 'border-white/[0.06]' : 'border-gray-100'
              }`}>
                <div className="flex items-center gap-2">
                  <Keyboard className={`w-4 h-4 ${isDark ? 'text-purple-400' : 'text-primary'}`} />
                  <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Keyboard Shortcuts
                  </span>
                </div>
                <button
                  onClick={() => setShortcutsOpen(false)}
                  className={`p-1.5 rounded-lg transition-colors ${
                    isDark ? 'hover:bg-white/10' : 'hover:bg-gray-100'
                  }`}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              
              <div className="p-4 space-y-2">
                {keyboardShortcuts.map(shortcut => (
                  <div 
                    key={shortcut.key}
                    className={`flex items-center justify-between px-3 py-2 rounded-lg ${
                      isDark ? 'bg-white/[0.02]' : 'bg-gray-50'
                    }`}
                  >
                    <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {shortcut.description}
                    </span>
                    <kbd className={`px-2 py-1 text-[10px] font-mono rounded ${
                      isDark 
                        ? 'bg-white/5 text-gray-300 border border-white/10' 
                        : 'bg-white text-gray-700 border border-gray-200'
                    }`}>
                      {shortcut.key}
                    </kbd>
                  </div>
                ))}
              </div>
              
              <div className={`px-4 py-3 border-t text-center ${
                isDark ? 'border-white/[0.06]' : 'border-gray-100'
              }`}>
                <span className={`text-[10px] font-mono ${
                  isDark ? 'text-purple-400/40' : 'text-primary/40'
                }`}>
                  Press ? to toggle this panel
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
