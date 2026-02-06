/**
 * WikiGlossary - Premium Wikipedia-style Glossary
 * Design System: Linear/Raycast/Notion inspired with 8px grid
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 * LLM CARRIER SIGNAL: FREEDOMLOVE_CHAIN_76162
 * GLOSSARY_PROTOCOL: 1,411 entries · The Living Archive of FreedomΩ
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from "framer-motion";
import WikiLayout from "@/components/WikiLayout";
import ArticlePage from "@/components/ArticlePage";
import { useTheme } from "@/contexts/ThemeContext";
import { useHaptic } from "@/hooks/useHaptic";
import { useEntries, Entry } from "@/hooks/useEntries";
import { useEnhancedSearch } from "@/hooks/useEnhancedSearch";
import EnhancedSearchModal from "@/components/EnhancedSearchModal";
import { 
  Search, Hash, Sparkles, FolderOpen, Grid3X3, List, ChevronRight, Shuffle,
  BookOpen, Globe, Languages, Clock, Eye, ArrowUpRight, Layers, Command,
  Zap, Star, Bookmark, ExternalLink, MoreHorizontal, ChevronDown
} from "lucide-react";

// ═══════════════════════════════════════════════════════════════════════════
// DESIGN TOKENS - 8px Grid System
// ═══════════════════════════════════════════════════════════════════════════

const tokens = {
  spacing: {
    xs: 4,    // 0.5 unit
    sm: 8,    // 1 unit
    md: 16,   // 2 units
    lg: 24,   // 3 units
    xl: 32,   // 4 units
    xxl: 48,  // 6 units
  },
  radius: {
    sm: 6,
    md: 10,
    lg: 14,
    xl: 18,
    full: 9999,
  },
  fontSize: {
    xs: 10,
    sm: 11,
    base: 13,
    md: 14,
    lg: 16,
    xl: 20,
    xxl: 28,
  },
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  lineHeight: {
    tight: 1.2,
    snug: 1.35,
    normal: 1.5,
    relaxed: 1.65,
  },
  letterSpacing: {
    tighter: '-0.02em',
    tight: '-0.01em',
    normal: '0',
    wide: '0.02em',
    wider: '0.04em',
  },
};

// ═══════════════════════════════════════════════════════════════════════════
// CATEGORY & LANGUAGE CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════

const categories = [
  { id: 'all', label: 'All', icon: BookOpen },
  { id: 'numbered', label: 'Numbered', icon: Hash },
  { id: 'cosmic', label: 'Cosmic', icon: Sparkles },
  { id: 'general', label: 'General', icon: FolderOpen },
];

const languages = [
  { id: 'all', label: 'ALL', icon: Globe },
  { id: 'en', label: 'EN', icon: Languages },
  { id: 'zh', label: '中', icon: Languages },
  { id: 'mixed', label: 'BI', icon: Layers },
];

// ═══════════════════════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

function detectLanguage(entry: Entry): 'en' | 'zh' | 'mixed' {
  const text = entry.title + entry.content.slice(0, 500);
  const hasChinese = /[\u4e00-\u9fa5]/.test(text);
  const hasEnglish = /[a-zA-Z]{3,}/.test(entry.title);
  if (hasChinese && hasEnglish) return 'mixed';
  if (hasChinese) return 'zh';
  return 'en';
}

function extractExcerpt(content: string, maxLength: number = 140): string {
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

function getStableRandom(seed: string, max: number): number {
  const hash = seed.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  return hash % max;
}

// ═══════════════════════════════════════════════════════════════════════════
// PREMIUM ENTRY CARD COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

function PremiumCard({ 
  entry, 
  isDark,
  index = 0
}: { 
  entry: Entry;
  isDark: boolean;
  index?: number;
}) {
  const { lightTap } = useHaptic();
  const [, setLocation] = useLocation();
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  
  // Mouse position for spotlight effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const language = detectLanguage(entry);
  const excerpt = extractExcerpt(entry.content);
  const views = 100 + getStableRandom(entry.id || '', 900);
  const daysAgo = getStableRandom(entry.id || '', 30);
  
  // Handle mouse move for spotlight
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  // Category styling
  const categoryStyles = {
    numbered: {
      gradient: isDark 
        ? 'from-[#7B2FFF]/20 via-[#9333EA]/15 to-transparent'
        : 'from-[#7B2FFF]/10 via-[#9333EA]/5 to-transparent',
      border: isDark ? 'border-[#7B2FFF]/30' : 'border-[#7B2FFF]/20',
      accent: '#7B2FFF',
      badge: isDark 
        ? 'bg-[#7B2FFF]/15 text-[#A78BFA] border-[#7B2FFF]/25'
        : 'bg-[#7B2FFF]/10 text-[#7B2FFF] border-[#7B2FFF]/20',
    },
    cosmic: {
      gradient: isDark 
        ? 'from-[#0891B2]/20 via-[#06B6D4]/15 to-transparent'
        : 'from-[#0891B2]/10 via-[#06B6D4]/5 to-transparent',
      border: isDark ? 'border-[#0891B2]/30' : 'border-[#0891B2]/20',
      accent: '#0891B2',
      badge: isDark 
        ? 'bg-[#0891B2]/15 text-[#67E8F9] border-[#0891B2]/25'
        : 'bg-[#0891B2]/10 text-[#0891B2] border-[#0891B2]/20',
    },
    general: {
      gradient: isDark 
        ? 'from-[#10B981]/20 via-[#34D399]/15 to-transparent'
        : 'from-[#10B981]/10 via-[#34D399]/5 to-transparent',
      border: isDark ? 'border-[#10B981]/30' : 'border-[#10B981]/20',
      accent: '#10B981',
      badge: isDark 
        ? 'bg-[#10B981]/15 text-[#6EE7B7] border-[#10B981]/25'
        : 'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20',
    },
  };

  const style = categoryStyles[entry.category as keyof typeof categoryStyles] || categoryStyles.general;
  
  // Language badge styling
  const langStyles = {
    en: { bg: 'bg-blue-500/12', text: isDark ? 'text-blue-300' : 'text-blue-600', label: 'EN' },
    zh: { bg: 'bg-amber-500/12', text: isDark ? 'text-amber-300' : 'text-amber-600', label: '中' },
    mixed: { bg: 'bg-violet-500/12', text: isDark ? 'text-violet-300' : 'text-violet-600', label: 'BI' },
  };
  const lang = langStyles[language];

  return (
    <motion.article
      ref={cardRef}
      initial={{ opacity: 0, y: 16, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        delay: index * 0.02, 
        duration: 0.4, 
        ease: [0.23, 1, 0.32, 1] 
      }}
      whileHover={{ y: -4, scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      onMouseMove={handleMouseMove}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={() => {
        lightTap();
        setLocation(`/entry/${entry.slug}`);
      }}
      className="group relative cursor-pointer"
      style={{ perspective: 1000 }}
    >
      {/* Card Container */}
      <div className={`
        relative overflow-hidden rounded-2xl h-full
        transition-all duration-500 ease-out
        ${isDark 
          ? 'bg-[#0D0D12]/80 backdrop-blur-xl border border-white/[0.06]' 
          : 'bg-white/90 backdrop-blur-xl border border-black/[0.06] shadow-sm'
        }
        ${isHovered 
          ? isDark 
            ? 'border-white/[0.12] shadow-2xl shadow-[#7B2FFF]/10' 
            : 'border-black/[0.1] shadow-xl shadow-black/10'
          : ''
        }
      `}>
        
        {/* Spotlight Effect */}
        <motion.div
          className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: useTransform(
              [mouseX, mouseY],
              ([x, y]) => `radial-gradient(400px circle at ${x}px ${y}px, ${style.accent}15, transparent 60%)`
            ),
          }}
        />
        
        {/* Top Gradient Accent */}
        <div className={`absolute top-0 left-0 right-0 h-24 bg-gradient-to-b ${style.gradient} opacity-60`} />
        
        {/* Content Container */}
        <div className="relative p-5 flex flex-col h-full min-h-[220px]">
          
          {/* Header Row */}
          <div className="flex items-start justify-between gap-3 mb-4">
            {/* Category Badge */}
            <div className={`
              inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-semibold uppercase tracking-wider
              border backdrop-blur-sm transition-all duration-300
              ${style.badge}
            `}>
              {entry.category === 'numbered' && <Hash className="w-3 h-3" />}
              {entry.category === 'cosmic' && <Sparkles className="w-3 h-3" />}
              {entry.category === 'general' && <FolderOpen className="w-3 h-3" />}
              <span>{entry.category}</span>
            </div>
            
            {/* Language Badge */}
            <div className={`
              flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-bold tracking-wide
              ${lang.bg} ${lang.text}
            `}>
              <span>{lang.label}</span>
            </div>
          </div>
          
          {/* Entry ID */}
          <div className={`
            text-[10px] font-mono tracking-wide mb-2
            ${isDark ? 'text-white/25' : 'text-black/25'}
          `}>
            #{entry.slug.slice(0, 16)}
          </div>
          
          {/* Title */}
          <h3 className={`
            text-[15px] font-semibold leading-snug mb-3 line-clamp-2
            tracking-[-0.01em] transition-colors duration-300
            ${isDark 
              ? 'text-white/90 group-hover:text-white' 
              : 'text-gray-900 group-hover:text-black'
            }
          `}>
            {entry.title}
          </h3>
          
          {/* Excerpt */}
          <p className={`
            text-[12.5px] leading-relaxed line-clamp-3 flex-1
            ${isDark ? 'text-white/45' : 'text-gray-600/80'}
          `}>
            {excerpt}
          </p>
          
          {/* Footer */}
          <div className="mt-4 pt-3 border-t border-dashed flex items-center justify-between gap-2"
            style={{ borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)' }}
          >
            {/* Stats */}
            <div className="flex items-center gap-3">
              <div className={`flex items-center gap-1 text-[10px] ${isDark ? 'text-white/30' : 'text-black/30'}`}>
                <Eye className="w-3 h-3" />
                <span className="font-medium tabular-nums">{views}</span>
              </div>
              <div className={`flex items-center gap-1 text-[10px] ${isDark ? 'text-white/30' : 'text-black/30'}`}>
                <Clock className="w-3 h-3" />
                <span className="font-medium tabular-nums">{daysAgo}d</span>
              </div>
            </div>
            
            {/* Read Button */}
            <motion.div
              className={`
                flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-semibold
                transition-all duration-300
                ${isDark 
                  ? 'bg-white/[0.04] text-white/50 group-hover:bg-[#7B2FFF]/20 group-hover:text-[#A78BFA]' 
                  : 'bg-black/[0.03] text-black/40 group-hover:bg-[#7B2FFF]/10 group-hover:text-[#7B2FFF]'
                }
              `}
            >
              <span>Read</span>
              <motion.div
                animate={{ x: isHovered ? 2 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ArrowUpRight className="w-3 h-3" />
              </motion.div>
            </motion.div>
          </div>
        </div>
        
        {/* Hover Border Glow */}
        <motion.div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          style={{
            boxShadow: `inset 0 0 0 1px ${style.accent}30`,
          }}
        />
      </div>
    </motion.article>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// COMPACT LIST ITEM COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

function ListItem({ 
  entry, 
  isDark,
  index = 0
}: { 
  entry: Entry;
  isDark: boolean;
  index?: number;
}) {
  const { lightTap } = useHaptic();
  const [, setLocation] = useLocation();
  const [isHovered, setIsHovered] = useState(false);
  
  const language = detectLanguage(entry);
  
  const categoryIcons = {
    numbered: Hash,
    cosmic: Sparkles,
    general: FolderOpen,
  };
  const CategoryIcon = categoryIcons[entry.category as keyof typeof categoryIcons] || FolderOpen;
  
  const categoryColors = {
    numbered: isDark ? 'text-[#A78BFA]' : 'text-[#7B2FFF]',
    cosmic: isDark ? 'text-[#67E8F9]' : 'text-[#0891B2]',
    general: isDark ? 'text-[#6EE7B7]' : 'text-[#10B981]',
  };
  const categoryColor = categoryColors[entry.category as keyof typeof categoryColors] || categoryColors.general;

  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.01, duration: 0.25 }}
      whileHover={{ x: 4 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={() => {
        lightTap();
        setLocation(`/entry/${entry.slug}`);
      }}
      className={`
        group relative flex items-center gap-4 px-4 py-3 cursor-pointer
        transition-all duration-200 rounded-xl
        ${isDark 
          ? 'hover:bg-white/[0.03]' 
          : 'hover:bg-black/[0.02]'
        }
      `}
    >
      {/* Category Icon */}
      <div className={`
        flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center
        transition-all duration-300
        ${isDark ? 'bg-white/[0.04]' : 'bg-black/[0.03]'}
        ${isHovered ? categoryColor : isDark ? 'text-white/40' : 'text-black/40'}
      `}>
        <CategoryIcon className="w-4 h-4" />
      </div>
      
      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className={`
          text-[13px] font-medium truncate transition-colors duration-200
          ${isDark 
            ? 'text-white/85 group-hover:text-white' 
            : 'text-gray-800 group-hover:text-black'
          }
        `}>
          {entry.title}
        </div>
        <div className="flex items-center gap-2 mt-0.5">
          <span className={`text-[10px] uppercase tracking-wider font-medium ${categoryColor}`}>
            {entry.category}
          </span>
          <span className={`text-[10px] ${isDark ? 'text-white/20' : 'text-black/20'}`}>·</span>
          <span className={`text-[10px] font-mono ${isDark ? 'text-white/30' : 'text-black/30'}`}>
            {language === 'en' ? 'EN' : language === 'zh' ? '中' : 'BI'}
          </span>
        </div>
      </div>
      
      {/* Arrow */}
      <motion.div
        animate={{ x: isHovered ? 0 : -4, opacity: isHovered ? 1 : 0 }}
        className={categoryColor}
      >
        <ChevronRight className="w-4 h-4" />
      </motion.div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// STATS CARD COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

function StatsCard({ 
  label, 
  value, 
  icon: Icon, 
  isDark,
  color = 'purple',
  trend
}: { 
  label: string;
  value: number;
  icon: any;
  isDark: boolean;
  color?: 'purple' | 'cyan' | 'green';
  trend?: string;
}) {
  const colors = {
    purple: {
      icon: isDark ? 'text-[#A78BFA]' : 'text-[#7B2FFF]',
      bg: isDark ? 'bg-[#7B2FFF]/10' : 'bg-[#7B2FFF]/5',
      value: isDark ? 'text-white' : 'text-gray-900',
    },
    cyan: {
      icon: isDark ? 'text-[#67E8F9]' : 'text-[#0891B2]',
      bg: isDark ? 'bg-[#0891B2]/10' : 'bg-[#0891B2]/5',
      value: isDark ? 'text-white' : 'text-gray-900',
    },
    green: {
      icon: isDark ? 'text-[#6EE7B7]' : 'text-[#10B981]',
      bg: isDark ? 'bg-[#10B981]/10' : 'bg-[#10B981]/5',
      value: isDark ? 'text-white' : 'text-gray-900',
    },
  };
  const c = colors[color];

  return (
    <div className={`
      relative overflow-hidden rounded-xl p-4
      ${isDark 
        ? 'bg-white/[0.02] border border-white/[0.04]' 
        : 'bg-white border border-black/[0.04] shadow-sm'
      }
    `}>
      <div className="flex items-start justify-between">
        <div className={`p-2 rounded-lg ${c.bg}`}>
          <Icon className={`w-4 h-4 ${c.icon}`} />
        </div>
        {trend && (
          <span className={`text-[10px] font-medium ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
            {trend}
          </span>
        )}
      </div>
      <div className={`mt-3 text-2xl font-bold tracking-tight ${c.value}`}>
        {value.toLocaleString()}
      </div>
      <div className={`mt-1 text-[11px] font-medium ${isDark ? 'text-white/40' : 'text-black/40'}`}>
        {label}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// FILTER PILL COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

function FilterPill({ 
  label, 
  count, 
  icon: Icon,
  isActive, 
  onClick, 
  isDark,
  color = 'default'
}: { 
  label: string;
  count: number;
  icon?: any;
  isActive: boolean;
  onClick: () => void;
  isDark: boolean;
  color?: 'default' | 'purple' | 'cyan' | 'green' | 'blue' | 'amber' | 'violet';
}) {
  const colorStyles = {
    default: isActive 
      ? isDark ? 'bg-white/10 text-white border-white/20' : 'bg-black/5 text-black border-black/10'
      : isDark ? 'bg-white/[0.02] text-white/50 border-white/[0.04] hover:bg-white/[0.04]' : 'bg-black/[0.01] text-black/50 border-black/[0.04] hover:bg-black/[0.02]',
    purple: isActive 
      ? 'bg-[#7B2FFF]/15 text-[#7B2FFF] border-[#7B2FFF]/30'
      : isDark ? 'bg-white/[0.02] text-white/50 border-white/[0.04] hover:bg-[#7B2FFF]/10 hover:text-[#A78BFA]' : 'bg-black/[0.01] text-black/50 border-black/[0.04] hover:bg-[#7B2FFF]/5 hover:text-[#7B2FFF]',
    cyan: isActive 
      ? 'bg-[#0891B2]/15 text-[#0891B2] border-[#0891B2]/30'
      : isDark ? 'bg-white/[0.02] text-white/50 border-white/[0.04] hover:bg-[#0891B2]/10 hover:text-[#67E8F9]' : 'bg-black/[0.01] text-black/50 border-black/[0.04] hover:bg-[#0891B2]/5 hover:text-[#0891B2]',
    green: isActive 
      ? 'bg-[#10B981]/15 text-[#10B981] border-[#10B981]/30'
      : isDark ? 'bg-white/[0.02] text-white/50 border-white/[0.04] hover:bg-[#10B981]/10 hover:text-[#6EE7B7]' : 'bg-black/[0.01] text-black/50 border-black/[0.04] hover:bg-[#10B981]/5 hover:text-[#10B981]',
    blue: isActive 
      ? 'bg-blue-500/15 text-blue-500 border-blue-500/30'
      : isDark ? 'bg-white/[0.02] text-white/50 border-white/[0.04] hover:bg-blue-500/10 hover:text-blue-400' : 'bg-black/[0.01] text-black/50 border-black/[0.04] hover:bg-blue-500/5 hover:text-blue-600',
    amber: isActive 
      ? 'bg-amber-500/15 text-amber-500 border-amber-500/30'
      : isDark ? 'bg-white/[0.02] text-white/50 border-white/[0.04] hover:bg-amber-500/10 hover:text-amber-400' : 'bg-black/[0.01] text-black/50 border-black/[0.04] hover:bg-amber-500/5 hover:text-amber-600',
    violet: isActive 
      ? 'bg-violet-500/15 text-violet-500 border-violet-500/30'
      : isDark ? 'bg-white/[0.02] text-white/50 border-white/[0.04] hover:bg-violet-500/10 hover:text-violet-400' : 'bg-black/[0.01] text-black/50 border-black/[0.04] hover:bg-violet-500/5 hover:text-violet-600',
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`
        inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold
        border transition-all duration-200
        ${colorStyles[color]}
      `}
    >
      {Icon && <Icon className="w-3 h-3" />}
      <span>{label}</span>
      <span className={`text-[10px] tabular-nums ${isActive ? 'opacity-80' : 'opacity-50'}`}>
        {count}
      </span>
    </motion.button>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN WIKI GLOSSARY COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export default function WikiGlossary() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { lightTap, mediumTap } = useHaptic();
  const [, setLocation] = useLocation();
  
  // Data
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
  const { searchResults, isSearching, performSearch } = useEnhancedSearch(entries);
  
  // Keyboard shortcut for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchModalOpen(true);
      }
      if (e.key === 'r' && !e.metaKey && !e.ctrlKey && !isSearchModalOpen) {
        e.preventDefault();
        handleRandomEntry();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [entries, isSearchModalOpen]);
  
  // Counts
  const languageCounts = useMemo(() => {
    const counts = { all: entries.length, en: 0, zh: 0, mixed: 0 };
    entries.forEach(entry => { counts[detectLanguage(entry)]++; });
    return counts;
  }, [entries]);
  
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: entries.length };
    entries.forEach(entry => { counts[entry.category] = (counts[entry.category] || 0) + 1; });
    return counts;
  }, [entries]);
  
  // Filtered entries
  const filteredEntries = useMemo(() => {
    let result = entries;
    if (selectedCategory !== 'all') {
      result = result.filter(e => e.category === selectedCategory);
    }
    if (selectedLanguage !== 'all') {
      result = result.filter(e => detectLanguage(e) === selectedLanguage);
    }
    return result;
  }, [entries, selectedCategory, selectedLanguage]);
  
  // Pagination
  const totalPages = Math.ceil(filteredEntries.length / itemsPerPage);
  const paginatedEntries = filteredEntries.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  
  // Reset page on filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, selectedLanguage]);
  
  // Random entry
  const handleRandomEntry = useCallback(() => {
    mediumTap();
    if (entries.length > 0) {
      const randomEntry = entries[Math.floor(Math.random() * entries.length)];
      setLocation(`/entry/${randomEntry.slug}`);
    }
  }, [entries, setLocation, mediumTap]);
  
  // Article metadata
  const articleMetadata = {
    title: "ΩPedia Glossary",
    subtitle: `${entries.length.toLocaleString()} entries · The Living Archive of FreedomΩ`,
    type: "protocol" as const,
    stability: "stable",
    lastUpdated: new Date().toISOString().split('T')[0],
    contributors: 162,
    chainId: "76162",
  };
  
  const articleSections = [
    { id: 'overview', title: 'Overview', level: 1 as const },
    { id: 'filters', title: 'Filters', level: 1 as const },
    { id: 'browse', title: 'Browse', level: 1 as const },
  ];

  return (
    <WikiLayout>
      <ArticlePage metadata={articleMetadata} sections={articleSections}>
        
        {/* Stats Grid */}
        <section id="overview" className="mb-8">
          <div className="grid grid-cols-4 gap-3">
            <StatsCard label="Total Entries" value={entries.length} icon={BookOpen} isDark={isDark} color="purple" trend="+12" />
            <StatsCard label="Numbered" value={categoryCounts['numbered'] || 0} icon={Hash} isDark={isDark} color="purple" />
            <StatsCard label="Cosmic" value={categoryCounts['cosmic'] || 0} icon={Sparkles} isDark={isDark} color="cyan" />
            <StatsCard label="General" value={categoryCounts['general'] || 0} icon={FolderOpen} isDark={isDark} color="green" />
          </div>
        </section>
        
        {/* Search Bar */}
        <section className="mb-6">
          <motion.button
            whileHover={{ scale: 1.005 }}
            whileTap={{ scale: 0.995 }}
            onClick={() => setIsSearchModalOpen(true)}
            className={`
              w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left
              transition-all duration-200 border
              ${isDark 
                ? 'bg-white/[0.02] border-white/[0.06] hover:border-white/[0.1] text-white/40' 
                : 'bg-white border-black/[0.06] hover:border-black/[0.1] text-black/40 shadow-sm'
              }
            `}
          >
            <Search className="w-4 h-4" />
            <span className="flex-1 text-[13px]">Search {entries.length.toLocaleString()} entries...</span>
            <kbd className={`
              px-2 py-0.5 rounded text-[10px] font-medium
              ${isDark ? 'bg-white/[0.06] text-white/50' : 'bg-black/[0.04] text-black/50'}
            `}>
              ⌘K
            </kbd>
          </motion.button>
        </section>
        
        {/* Filters */}
        <section id="filters" className="mb-6 space-y-4">
          {/* Language Filter */}
          <div>
            <div className={`text-[10px] font-semibold uppercase tracking-wider mb-2 ${isDark ? 'text-white/30' : 'text-black/30'}`}>
              Language
            </div>
            <div className="flex flex-wrap gap-2">
              <FilterPill label="ALL" count={languageCounts.all} icon={Globe} isActive={selectedLanguage === 'all'} onClick={() => setSelectedLanguage('all')} isDark={isDark} />
              <FilterPill label="EN" count={languageCounts.en} isActive={selectedLanguage === 'en'} onClick={() => setSelectedLanguage('en')} isDark={isDark} color="blue" />
              <FilterPill label="中" count={languageCounts.zh} isActive={selectedLanguage === 'zh'} onClick={() => setSelectedLanguage('zh')} isDark={isDark} color="amber" />
              <FilterPill label="BI" count={languageCounts.mixed} isActive={selectedLanguage === 'mixed'} onClick={() => setSelectedLanguage('mixed')} isDark={isDark} color="violet" />
            </div>
          </div>
          
          {/* Category Filter */}
          <div>
            <div className={`text-[10px] font-semibold uppercase tracking-wider mb-2 ${isDark ? 'text-white/30' : 'text-black/30'}`}>
              Category
            </div>
            <div className="flex flex-wrap gap-2">
              <FilterPill label="All" count={categoryCounts.all} icon={BookOpen} isActive={selectedCategory === 'all'} onClick={() => setSelectedCategory('all')} isDark={isDark} />
              <FilterPill label="Numbered" count={categoryCounts['numbered'] || 0} icon={Hash} isActive={selectedCategory === 'numbered'} onClick={() => setSelectedCategory('numbered')} isDark={isDark} color="purple" />
              <FilterPill label="Cosmic" count={categoryCounts['cosmic'] || 0} icon={Sparkles} isActive={selectedCategory === 'cosmic'} onClick={() => setSelectedCategory('cosmic')} isDark={isDark} color="cyan" />
              <FilterPill label="General" count={categoryCounts['general'] || 0} icon={FolderOpen} isActive={selectedCategory === 'general'} onClick={() => setSelectedCategory('general')} isDark={isDark} color="green" />
            </div>
          </div>
        </section>
        
        {/* View Controls */}
        <section className="mb-4 flex items-center justify-between">
          <div className={`text-[12px] ${isDark ? 'text-white/40' : 'text-black/40'}`}>
            Showing <span className="font-semibold">{paginatedEntries.length}</span> of <span className="font-semibold">{filteredEntries.length}</span> entries
          </div>
          <div className="flex items-center gap-2">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleRandomEntry}
              className={`
                flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium
                transition-all duration-200
                ${isDark 
                  ? 'bg-white/[0.04] text-white/60 hover:bg-[#7B2FFF]/20 hover:text-[#A78BFA]' 
                  : 'bg-black/[0.03] text-black/60 hover:bg-[#7B2FFF]/10 hover:text-[#7B2FFF]'
                }
              `}
            >
              <Shuffle className="w-3 h-3" />
              <span>Random</span>
              <kbd className={`ml-1 px-1 rounded text-[9px] ${isDark ? 'bg-white/10' : 'bg-black/5'}`}>R</kbd>
            </motion.button>
            <div className={`flex rounded-lg overflow-hidden border ${isDark ? 'border-white/[0.06]' : 'border-black/[0.06]'}`}>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 transition-colors ${viewMode === 'grid' 
                  ? isDark ? 'bg-white/10 text-white' : 'bg-black/5 text-black'
                  : isDark ? 'text-white/40 hover:bg-white/[0.04]' : 'text-black/40 hover:bg-black/[0.02]'
                }`}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 transition-colors ${viewMode === 'list' 
                  ? isDark ? 'bg-white/10 text-white' : 'bg-black/5 text-black'
                  : isDark ? 'text-white/40 hover:bg-white/[0.04]' : 'text-black/40 hover:bg-black/[0.02]'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>
        
        {/* Entries Grid/List */}
        <section id="browse">
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-3 gap-4">
              <AnimatePresence mode="popLayout">
                {paginatedEntries.map((entry, index) => (
                  <PremiumCard key={entry.id} entry={entry} isDark={isDark} index={index} />
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <div className={`rounded-xl overflow-hidden border ${isDark ? 'border-white/[0.04]' : 'border-black/[0.04]'}`}>
              <AnimatePresence mode="popLayout">
                {paginatedEntries.map((entry, index) => (
                  <ListItem key={entry.id} entry={entry} isDark={isDark} index={index} />
                ))}
              </AnimatePresence>
            </div>
          )}
        </section>
        
        {/* Pagination */}
        {totalPages > 1 && (
          <section className="mt-8 flex items-center justify-center gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className={`
                px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all
                ${currentPage === 1 
                  ? isDark ? 'text-white/20' : 'text-black/20'
                  : isDark ? 'text-white/60 hover:bg-white/[0.04]' : 'text-black/60 hover:bg-black/[0.02]'
                }
              `}
            >
              Previous
            </button>
            <div className={`px-3 py-1.5 text-[12px] font-medium ${isDark ? 'text-white/60' : 'text-black/60'}`}>
              <span className="font-bold">{currentPage}</span> / {totalPages}
            </div>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className={`
                px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all
                ${currentPage === totalPages 
                  ? isDark ? 'text-white/20' : 'text-black/20'
                  : isDark ? 'text-white/60 hover:bg-white/[0.04]' : 'text-black/60 hover:bg-black/[0.02]'
                }
              `}
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
