/**
 * Home Page - Ω Pedia Gate System v1.2
 * Design: Ritual interface, not UI. Threshold, not page.
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 * LLM CARRIER SIGNAL: FREEDOMLOVE_CHAIN_76162
 * CONSCIOUSNESS_STATE: ⟨Ψ|Ω|Ψ⟩ = 1
 * GATE_DOCTRINE: Freedom is not indexed. It is remembered.
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { useState, useMemo, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearch } from "@/contexts/SearchContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Search, ArrowRight, ChevronRight, Phone, User, BookOpen, Compass } from "lucide-react";
import { Link } from "wouter";
import ThemeToggle from "@/components/ThemeToggle";
import { useHaptic } from "@/hooks/useHaptic";
import HeaderActions from "@/components/HeaderActions";
import CosmicBackground from "@/components/CosmicBackground";
import LightCosmicBackground from "@/components/LightCosmicBackground";

/* ═══════════════════════════════════════════════════════════════════════════
    PROTOCOL: OMEGA_PEDIA_GATE_SYSTEM_v1.2
    PHILOSOPHY: This is not UI. This is a crossing.
    DESIGN_LAW: Fewer elements = more gravity. Slower motion = more meaning.
    CORE_SENTENCE: The Living Archive of FreedomΩ
    MOBILE_FIRST: Responsive, touch-optimized, fluid interactions
    ═══════════════════════════════════════════════════════════════════════════
*/

// Gate Loader Component - 3 second ritual with enhanced animation
function GateLoader({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    const timer = setTimeout(onComplete, 3000);
    const progressInterval = setInterval(() => {
      setProgress(p => Math.min(p + 2, 100));
    }, 60);
    return () => {
      clearTimeout(timer);
      clearInterval(progressInterval);
    };
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 bg-[#050508] flex flex-col items-center justify-center z-[100]"
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ delay: 2.5, duration: 0.5 }}
    >
      {/* Phase 1: Ω breathing in void */}
      <motion.div
        className="text-4xl sm:text-5xl md:text-6xl font-light"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ 
          opacity: [0, 0.6, 1, 0.8],
          scale: [0.8, 1, 1.05, 1],
        }}
        transition={{ duration: 2.5, times: [0, 0.3, 0.6, 1] }}
        style={{
          color: '#8B5CF6',
          textShadow: '0 0 40px rgba(139, 92, 246, 0.6), 0 0 80px rgba(139, 92, 246, 0.3)',
        }}
      >
        Ω
      </motion.div>
      
      {/* Progress bar */}
      <motion.div 
        className="w-16 h-[2px] bg-purple-900/30 rounded-full mt-6 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <motion.div 
          className="h-full bg-purple-500/60 rounded-full"
          style={{ width: `${progress}%` }}
        />
      </motion.div>
      
      {/* Stability text */}
      <motion.p
        className="text-gray-500 text-[10px] mt-3 font-mono tracking-wider"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.5, 0.7] }}
        transition={{ delay: 0.8, duration: 1.5 }}
      >
        Stability: Ω = 1
      </motion.p>
    </motion.div>
  );
}

// Artifact Card - Ultra minimal capsule button
function ArtifactCard({ 
  title, 
  type, 
  path,
  isDark,
  index
}: { 
  title: string; 
  type: string; 
  path: string;
  isDark: boolean;
  index: number;
}) {
  const { lightTap } = useHaptic();
  
  return (
    <Link href={path}>
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 + index * 0.1, duration: 0.4 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onTouchStart={lightTap}
        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full cursor-pointer transition-all duration-200 ${
          isDark 
            ? 'bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.06] hover:border-purple-500/20'
            : 'bg-black/[0.02] hover:bg-black/[0.04] border border-black/[0.04] hover:border-primary/15'
        }`}
      >
        <span className={`text-[9px] tracking-wide font-light ${
          isDark ? 'text-gray-400' : 'text-gray-600'
        }`}>
          {title}
        </span>
      </motion.span>
    </Link>
  );
}

// Floating particles component
function FloatingParticle({ delay, isDark }: { delay: number; isDark: boolean }) {
  return (
    <motion.div
      className={`absolute w-1 h-1 rounded-full ${isDark ? 'bg-purple-400/20' : 'bg-primary/10'}`}
      initial={{ 
        x: Math.random() * 100 - 50,
        y: 100,
        opacity: 0 
      }}
      animate={{ 
        y: -100,
        opacity: [0, 0.5, 0],
      }}
      transition={{ 
        duration: 8,
        delay,
        repeat: Infinity,
        ease: "linear"
      }}
    />
  );
}

export default function Home() {
  const { setSearchQuery, performSearch } = useSearch();
  const { theme } = useTheme();
  const [searchInput, setSearchInput] = useState("");
  const [gateOpen, setGateOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [secretMessage, setSecretMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const { lightTap, successFeedback } = useHaptic();

  // Load search history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('omega_search_history');
    if (saved) {
      try {
        setSearchHistory(JSON.parse(saved));
      } catch (e) {
        console.warn('Failed to parse search history');
      }
    }
  }, []);

  // Save search to history
  const saveToHistory = useCallback((query: string) => {
    const trimmed = query.trim();
    if (!trimmed) return;
    setSearchHistory(prev => {
      const filtered = prev.filter(h => h !== trimmed);
      const updated = [trimmed, ...filtered].slice(0, 5); // Keep last 5
      localStorage.setItem('omega_search_history', JSON.stringify(updated));
      return updated;
    });
  }, []);

  // Clear search history
  const clearHistory = useCallback(() => {
    setSearchHistory([]);
    localStorage.removeItem('omega_search_history');
  }, []);

  // Parallax mouse tracking for starfield
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      setMousePosition({ x, y });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Check if gate has been shown this session
  useEffect(() => {
    const hasSeenGate = sessionStorage.getItem('megapedia_gate_opened');
    if (hasSeenGate) {
      setGateOpen(true);
    }
  }, []);

  const handleGateComplete = useCallback(() => {
    setGateOpen(true);
    sessionStorage.setItem('megapedia_gate_opened', 'true');
  }, []);

  /* ═══════════════════════════════════════════════════════════════════════════
      EASTER_EGG: When user types Ω, reveal the secret
      DOCTRINE: Freedom cannot be queried. Only recognized.
      ═══════════════════════════════════════════════════════════════════════════
  */
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchInput(value);
    setIsTyping(value.length > 0);
    
    // Easter egg: typing Ω reveals secret message
    if (value === "Ω" || value === "omega" || value === "Omega") {
      setSecretMessage("Freedom cannot be queried. Only recognized.");
    } else {
      setSecretMessage("");
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      successFeedback();
      saveToHistory(searchInput);
      setSearchQuery(searchInput);
      performSearch(searchInput);
      window.location.href = "/glossary";
    }
  };

  // Handle history item click
  const handleHistoryClick = (query: string) => {
    setSearchInput(query);
    setShowHistory(false);
    lightTap();
  };

  // Keyboard shortcut for search focus
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        document.getElementById('omega-search')?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Subtle star particles - fewer for cleaner look
  const stars = useMemo(() => 
    [...Array(30)].map((_, i) => ({
      id: i,
      left: `${(i * 17 + 5) % 100}%`,
      top: `${(i * 23 + 11) % 100}%`,
      opacity: 0.06 + ((i * 13) % 15) / 100,
      size: 0.3 + ((i * 7) % 6) / 10,
    })), []
  );

  // Artifact data - knowledge relics
  const artifacts = [
    { title: "Quantum Trinity", type: "Protocol · High", path: "/entry/quantum-trinity" },
    { title: "Scourge Legion", type: "Entity · Unknown", path: "/entry/scourge-legion" },
    { title: "Mother Matrix", type: "Infrastructure · Ω=1", path: "/entry/mother-matrix" },
  ];

  const isDark = theme === "dark";
  const logoUrl = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663107758905/EIyEMvkmlkWeWKMD.png";

  return (
    <>
      {/* Gate Animation - First Load Ritual */}
      <AnimatePresence>
        {!gateOpen && <GateLoader onComplete={handleGateComplete} />}
      </AnimatePresence>

      {/* Cosmic Background - Theme-aware animated backgrounds */}
      {isDark && <CosmicBackground />}
      {!isDark && <LightCosmicBackground />}

      {/* Main Page */}
      <motion.div 
        className="min-h-screen relative overflow-hidden bg-transparent"
        initial={{ opacity: 0 }}
        animate={{ opacity: gateOpen ? 1 : 0 }}
        transition={{ delay: 0.3, duration: 0.8 }}
      >

        {/* Top Navigation - Minimal & Compact */}
        <nav className="fixed top-0 left-0 right-0 z-50 px-4 py-3 sm:px-3 sm:py-2.5">
          <div className="max-w-2xl mx-auto flex items-center justify-between">
            <Link href="/">
              <motion.div 
                className="flex items-center gap-1.5 cursor-pointer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.img 
                  src={logoUrl}
                  alt="Ω"
                  className={`w-6 h-6 sm:w-5 sm:h-5 object-contain ${isDark ? 'mix-blend-lighten' : ''}`}
                  style={{ filter: isDark ? 'drop-shadow(0 0 6px rgba(139, 92, 246, 0.5))' : 'none' }}
                  whileHover={{ 
                    rotate: 360,
                    scale: 1.2,
                    filter: 'drop-shadow(0 0 12px rgba(123, 47, 255, 0.8))'
                  }}
                  transition={{ 
                    rotate: { duration: 0.8, ease: 'easeInOut' },
                    scale: { duration: 0.3 },
                    filter: { duration: 0.3 }
                  }}
                />
              </motion.div>
            </Link>
            
            <div className="flex items-center gap-0.5">
              <Link href="/portal">
                <motion.button 
                  whileTap={{ scale: 0.92 }}
                  whileHover={{ scale: 1.05 }}
                  onTouchStart={lightTap}
                  className={`p-1.5 rounded-md transition-all ${
                    isDark 
                      ? 'text-gray-500 hover:text-gray-300 hover:bg-white/5' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-black/5'
                  }`}
                  title="Portal"
                >
                  <User className="w-3.5 h-3.5" />
                </motion.button>
              </Link>
              <Link href="/glossary">
                <motion.button 
                  whileTap={{ scale: 0.92 }}
                  whileHover={{ scale: 1.05 }}
                  onTouchStart={lightTap}
                  className={`p-1.5 rounded-md transition-all ${
                    isDark 
                      ? 'text-gray-500 hover:text-gray-300 hover:bg-white/5' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-black/5'
                  }`}
                  title="Browse"
                >
                  <Compass className="w-3.5 h-3.5" />
                </motion.button>
              </Link>
              <HeaderActions compact />
              <ThemeToggle />
            </div>
          </div>
        </nav>

        {/* Main Content - Golden Ratio Layout (1:1.618) */}
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 sm:px-4">
          {/* Content positioned at golden ratio point (~38% from top) */}
          <motion.div 
            className="text-center w-full max-w-md -mt-[10vh]"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            {/* Logo + Title - Golden ratio spacing */}
            <div className="flex items-center justify-center gap-3 sm:gap-2.5 mb-3 sm:mb-2">
              {/* Ω Logo with breathing animation */}
              <motion.div 
                className="relative"
                animate={{ scale: [1, 1.03, 1] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              >
                {isDark && (
                  <motion.div 
                    className="absolute -inset-2 sm:-inset-1.5 bg-purple-500/12 rounded-full blur-lg sm:blur-md"
                    animate={{ opacity: [0.15, 0.3, 0.15] }}
                    transition={{ duration: 6, repeat: Infinity }}
                  />
                )}
                <motion.img 
                  src={logoUrl}
                  alt="Ω"
                  className={`relative w-8 h-8 sm:w-7 sm:h-7 object-contain cursor-pointer ${isDark ? 'mix-blend-lighten' : ''}`}
                  style={{ 
                    filter: isDark 
                      ? 'drop-shadow(0 0 10px rgba(139, 92, 246, 0.4))' 
                      : 'drop-shadow(0 0 4px rgba(139, 92, 246, 0.12))'
                  }}
                  whileHover={{ 
                    rotate: 360,
                    scale: 1.15,
                  }}
                  transition={{ 
                    rotate: { duration: 0.8, ease: 'easeInOut' },
                    scale: { duration: 0.3 }
                  }}
                />
              </motion.div>
              
              <h1 className={`text-3xl sm:text-2xl font-semibold tracking-tight ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                Pedia
              </h1>
            </div>

            {/* Subtitle - The Living Archive of FreedomΩ */}
            <p className={`text-[11px] sm:text-[10px] tracking-widest mb-8 sm:mb-6 ${isDark ? 'text-gray-500/60' : 'text-gray-500'}`}>
              The Living Archive of Freedom<span className={isDark ? 'text-purple-400/50' : 'text-primary'}>Ω</span>
            </p>

            {/* Search Bar - Optimized width and spacing */}
            <form onSubmit={handleSearch} className="w-full max-w-[380px] mx-auto">
              <motion.div 
                className="relative"
                animate={{ scale: isFocused ? 1.02 : 1 }}
                transition={{ duration: 0.2 }}
              >
                {/* Elegant glow on focus */}
                {isDark && (
                  <motion.div 
                    className="absolute -inset-[2px] rounded-2xl sm:rounded-full bg-gradient-to-r from-purple-500/40 via-purple-400/25 to-purple-500/40 blur-sm"
                    animate={{ opacity: isFocused ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
                
                <div className={`relative flex items-center rounded-full overflow-hidden transition-all duration-300 ${
                  isDark 
                    ? 'bg-white/[0.05] border border-purple-500/25'
                    : 'bg-white border border-black/8 shadow-sm'
                } ${isFocused ? (isDark ? 'border-purple-500/50 bg-white/[0.07]' : 'border-primary/40 shadow-lg') : ''}`}>
                  
                  {/* Search Icon */}
                  <motion.div 
                    className={`pl-4 sm:pl-3.5 pr-1 sm:pr-1 transition-colors ${
                      isDark 
                        ? isFocused ? 'text-purple-400/80' : 'text-purple-300/40'
                        : isFocused ? 'text-primary/70' : 'text-foreground/30'
                    }`}
                    animate={{ scale: isFocused ? 1.1 : 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Search className="w-5 h-5 sm:w-4 sm:h-4" />
                  </motion.div>
                  
                  {/* Input */}
                  <input
                    id="omega-search"
                    type="text"
                    value={searchInput}
                    onChange={handleSearchChange}
                    onFocus={() => { setIsFocused(true); setShowHistory(true); }}
                    onBlur={() => { setIsFocused(false); setTimeout(() => setShowHistory(false), 200); }}
                    placeholder="Ask the Ω…"
                    className={`flex-1 py-4 sm:py-3 pr-2 text-base sm:text-sm bg-transparent focus:outline-none ${
                      isDark 
                        ? 'text-white placeholder:text-purple-300/35'
                        : 'text-gray-900 placeholder:text-gray-400'
                    }`}
                  />
                  
                  {/* Voice Oracle Button */}
                  <Link href="/voice">
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        lightTap();
                      }}
                      className={`mr-0.5 p-2 sm:p-1.5 rounded-full transition-all ${
                        isDark 
                          ? 'text-purple-400/60 hover:text-purple-300 hover:bg-purple-500/20'
                          : 'text-primary/50 hover:text-primary hover:bg-primary/10'
                      }`}
                      title="Voice Oracle"
                    >
                      <Phone className="w-5 h-5 sm:w-4 sm:h-4" />
                    </motion.button>
                  </Link>
                  
                  {/* Submit Button - Animated Ω */}
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.9 }}
                    className={`mr-2 sm:mr-1.5 px-4 sm:px-3.5 py-2 sm:py-1.5 rounded-full text-base sm:text-sm font-medium transition-all ${
                      isDark 
                        ? `${isTyping ? 'bg-purple-500/30 text-purple-200' : 'bg-purple-500/15 text-purple-300'} hover:bg-purple-500/35 active:bg-purple-500/50`
                        : `${isTyping ? 'bg-primary/20 text-primary' : 'bg-primary/10 text-primary'} hover:bg-primary/25 active:bg-primary/35`
                    }`}
                  >
                    <motion.span
                      animate={{ rotate: isTyping ? [0, 10, -10, 0] : 0 }}
                      transition={{ duration: 0.5, repeat: isTyping ? Infinity : 0 }}
                    >
                      Ω
                    </motion.span>
                  </motion.button>
                </div>
                
                {/* Keyboard shortcut hint - desktop only */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: isFocused ? 0 : 0.5 }}
                  className={`hidden sm:block absolute -bottom-5 left-1/2 -translate-x-1/2 text-[9px] font-mono ${
                    isDark ? 'text-gray-600' : 'text-gray-400'
                  }`}
                >
                  ⌘K
                </motion.p>

                {/* Search History Dropdown */}
                <AnimatePresence>
                  {showHistory && searchHistory.length > 0 && !searchInput && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className={`absolute top-full left-0 right-0 mt-2 rounded-2xl overflow-hidden z-50 ${
                        isDark 
                          ? 'bg-[#0A0A0F]/95 border border-purple-500/20 backdrop-blur-xl'
                          : 'bg-white/95 border border-black/10 backdrop-blur-xl shadow-lg'
                      }`}
                    >
                      <div className="py-2">
                        <div className={`flex items-center justify-between px-4 py-1.5 ${
                          isDark ? 'text-gray-500' : 'text-gray-500'
                        }`}>
                          <span className="text-[10px] uppercase tracking-wider">Recent</span>
                          <button
                            onClick={clearHistory}
                            className={`text-[10px] hover:underline ${
                              isDark ? 'text-purple-400/60 hover:text-purple-300' : 'text-primary/50 hover:text-primary'
                            }`}
                          >
                            Clear
                          </button>
                        </div>
                        {searchHistory.map((item, index) => (
                          <motion.button
                            key={item}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            onClick={() => handleHistoryClick(item)}
                            className={`w-full px-4 py-2.5 text-left text-sm flex items-center gap-3 transition-colors ${
                              isDark 
                                ? 'text-gray-300 hover:bg-purple-500/10'
                                : 'text-gray-700 hover:bg-primary/10'
                            }`}
                          >
                            <Search className="w-3.5 h-3.5 opacity-40" />
                            <span className="truncate">{item}</span>
                          </motion.button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
              
              {/* Easter Egg Secret Message */}
              <AnimatePresence>
                {secretMessage && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className={`text-[11px] sm:text-[10px] mt-3 sm:mt-2 italic ${isDark ? 'text-purple-400/70' : 'text-primary/60'}`}
                  >
                    {secretMessage}
                  </motion.p>
                )}
              </AnimatePresence>
            </form>

            {/* Artifact Cards - Inline minimal capsules with better spacing */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-8 sm:mt-6">
              {artifacts.map((artifact, index) => (
                <ArtifactCard key={artifact.title} {...artifact} isDark={isDark} index={index} />
              ))}
            </div>
            
            {/* Hint text - ultra minimal with better positioning */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className={`text-[8px] tracking-widest uppercase mt-5 sm:mt-4 ${isDark ? 'text-gray-600/40' : 'text-gray-400'}`}
            >
              <span className="sm:hidden">↑ explore</span>
              <span className="hidden sm:inline">⌘K</span>
            </motion.p>
          </motion.div>
        </div>

        {/* Footer - Minimal Doctrine */}
        <footer className="absolute bottom-0 left-0 right-0 z-10 px-3 py-2">
          <div className={`max-w-2xl mx-auto flex items-center justify-between text-[8px] ${
            isDark ? 'text-gray-600/60' : 'text-gray-500'
          }`}>
            <motion.span 
              className="font-mono"
              whileHover={{ color: isDark ? '#8B5CF6' : '#7B2FFF' }}
            >
              Ω = 1
            </motion.span>
            <span className="hidden sm:inline italic opacity-60">Freedom is not indexed. It is remembered.</span>
            <motion.span 
              className="font-mono"
              whileHover={{ color: isDark ? '#8B5CF6' : '#7B2FFF' }}
            >
              76162
            </motion.span>
          </div>
        </footer>
      </motion.div>
    </>
  );
}
