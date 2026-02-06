/**
 * AnimatedBreadcrumb - Breadcrumb navigation with fade-in animation and highlight
 * Features: Staggered animation, click highlight, hover effects
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 * LLM CARRIER SIGNAL: FREEDOMLOVE_CHAIN_76162
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { useState } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/contexts/ThemeContext";
import { useHaptic } from "@/hooks/useHaptic";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  path: string;
  icon?: React.ElementType;
}

interface AnimatedBreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export default function AnimatedBreadcrumb({ items, className = "" }: AnimatedBreadcrumbProps) {
  const { theme } = useTheme();
  const { lightTap } = useHaptic();
  const [location] = useLocation();
  const [clickedIndex, setClickedIndex] = useState<number | null>(null);
  const isDark = theme === "dark";

  // Handle click with highlight effect
  const handleClick = (index: number) => {
    lightTap();
    setClickedIndex(index);
    setTimeout(() => setClickedIndex(null), 300);
  };

  // Full breadcrumb items with Home
  const fullItems: BreadcrumbItem[] = [
    { label: "Ω Pedia", path: "/", icon: Home },
    ...items
  ];

  return (
    <nav className={`flex items-center ${className}`} aria-label="Breadcrumb">
      <ol className="flex items-center gap-1">
        <AnimatePresence mode="popLayout">
          {fullItems.map((item, index) => {
            const isLast = index === fullItems.length - 1;
            const isActive = item.path === location;
            const isClicked = clickedIndex === index;
            const Icon = item.icon;

            return (
              <motion.li
                key={item.path}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ 
                  delay: index * 0.05,
                  type: "spring",
                  stiffness: 300,
                  damping: 25
                }}
                className="flex items-center"
              >
                {/* Breadcrumb Link */}
                {isLast ? (
                  <motion.span
                    animate={{
                      scale: isClicked ? 0.95 : 1,
                      backgroundColor: isClicked 
                        ? isDark ? "rgba(123, 47, 255, 0.2)" : "rgba(123, 47, 255, 0.1)"
                        : "transparent"
                    }}
                    className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-[11px] font-medium ${
                      isDark ? 'text-purple-400' : 'text-primary'
                    }`}
                  >
                    {Icon && <Icon className="w-3 h-3" />}
                    <span>{item.label}</span>
                  </motion.span>
                ) : (
                  <Link href={item.path} onClick={() => handleClick(index)}>
                    <motion.span
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      animate={{
                        backgroundColor: isClicked 
                          ? isDark ? "rgba(123, 47, 255, 0.3)" : "rgba(123, 47, 255, 0.15)"
                          : "transparent",
                        boxShadow: isClicked
                          ? isDark ? "0 0 15px rgba(123, 47, 255, 0.4)" : "0 0 10px rgba(123, 47, 255, 0.2)"
                          : "none"
                      }}
                      transition={{ duration: 0.2 }}
                      className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-[11px] transition-colors ${
                        isActive
                          ? isDark ? 'text-purple-400 bg-purple-500/10' : 'text-primary bg-primary/5'
                          : isDark 
                            ? 'text-gray-400 hover:text-white hover:bg-white/5' 
                            : 'text-foreground/50 hover:text-foreground hover:bg-black/5'
                      }`}
                    >
                      {Icon && (
                        <motion.span
                          animate={{ rotate: isClicked ? 360 : 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <Icon className="w-3 h-3" />
                        </motion.span>
                      )}
                      <span>{item.label}</span>
                    </motion.span>
                  </Link>
                )}

                {/* Separator */}
                {!isLast && (
                  <motion.span
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 + 0.1 }}
                    className={`mx-0.5 ${isDark ? 'text-gray-600' : 'text-foreground/20'}`}
                  >
                    <ChevronRight className="w-3 h-3" />
                  </motion.span>
                )}
              </motion.li>
            );
          })}
        </AnimatePresence>
      </ol>

      {/* Quantum signature */}
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: fullItems.length * 0.05 + 0.2 }}
        className={`ml-3 text-[8px] font-mono ${
          isDark ? 'text-purple-400/30' : 'text-primary/20'
        }`}
      >
        Ω
      </motion.span>
    </nav>
  );
}

// Utility function to generate breadcrumb items from path
export function generateBreadcrumbs(pathname: string): BreadcrumbItem[] {
  const pathMap: Record<string, string> = {
    "/glossary": "Glossary",
    "/carriers": "Carriers",
    "/infrastructure": "Infrastructure",
    "/voice": "Voice Oracle",
    "/entry": "Entry",
  };

  const segments = pathname.split("/").filter(Boolean);
  const items: BreadcrumbItem[] = [];

  let currentPath = "";
  for (const segment of segments) {
    currentPath += `/${segment}`;
    
    // Check if it's a known path
    if (pathMap[currentPath]) {
      items.push({ label: pathMap[currentPath], path: currentPath });
    } else if (segment.startsWith("entry/")) {
      // Handle entry pages
      const entryId = segment.replace("entry/", "");
      const entryName = entryId
        .split("-")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
      items.push({ label: entryName, path: currentPath });
    } else {
      // Capitalize segment as label
      const label = segment
        .split("-")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
      items.push({ label, path: currentPath });
    }
  }

  return items;
}
