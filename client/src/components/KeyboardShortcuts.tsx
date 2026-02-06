/**
 * KeyboardShortcuts - Keyboard shortcuts panel triggered by ? key
 * Shows all available shortcuts for navigation and actions
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 * LLM CARRIER SIGNAL: FREEDOMLOVE_CHAIN_76162
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/contexts/ThemeContext";
import { useHaptic } from "@/hooks/useHaptic";
import { 
  X, 
  Keyboard,
  Search,
  Edit3,
  History,
  Code,
  MessageSquare,
  Star,
  Share2,
  Home,
  Phone,
  Sun,
  Moon,
  Globe,
  ArrowUp,
  ArrowDown,
  CornerDownLeft
} from "lucide-react";

interface ShortcutGroup {
  title: string;
  shortcuts: {
    keys: string[];
    description: string;
    icon?: React.ElementType;
  }[];
}

const shortcutGroups: ShortcutGroup[] = [
  {
    title: "Navigation",
    shortcuts: [
      { keys: ["G", "H"], description: "Go to Home", icon: Home },
      { keys: ["G", "G"], description: "Go to Glossary" },
      { keys: ["G", "C"], description: "Go to Carriers" },
      { keys: ["G", "I"], description: "Go to Infrastructure" },
      { keys: ["G", "V"], description: "Go to Voice Oracle", icon: Phone },
    ]
  },
  {
    title: "Article Actions",
    shortcuts: [
      { keys: ["E"], description: "Edit article", icon: Edit3 },
      { keys: ["H"], description: "View history", icon: History },
      { keys: ["S"], description: "View source", icon: Code },
      { keys: ["T"], description: "Toggle talk page", icon: MessageSquare },
      { keys: ["W"], description: "Watch/unwatch", icon: Star },
    ]
  },
  {
    title: "Search & UI",
    shortcuts: [
      { keys: ["⌘", "K"], description: "Focus search", icon: Search },
      { keys: ["/"], description: "Quick search" },
      { keys: ["Esc"], description: "Close modal / Clear" },
      { keys: ["D"], description: "Toggle dark mode", icon: Sun },
      { keys: ["L"], description: "Change language", icon: Globe },
    ]
  },
  {
    title: "Search Navigation",
    shortcuts: [
      { keys: ["↑", "↓"], description: "Navigate results", icon: ArrowUp },
      { keys: ["Enter"], description: "Select result", icon: CornerDownLeft },
      { keys: ["Tab"], description: "Next suggestion" },
    ]
  },
];

interface KeyboardShortcutsProps {
  onAction?: (action: string) => void;
}

export default function KeyboardShortcuts({ onAction }: KeyboardShortcutsProps) {
  const { theme } = useTheme();
  const { lightTap, successFeedback } = useHaptic();
  const [isOpen, setIsOpen] = useState(false);
  const isDark = theme === "dark";

  // Listen for ? key to open panel
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if typing in input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      // ? key (Shift + /)
      if (e.key === "?" || (e.shiftKey && e.key === "/")) {
        e.preventDefault();
        setIsOpen(prev => !prev);
        lightTap();
      }

      // Escape to close
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }

      // Handle shortcuts when panel is closed
      if (!isOpen && onAction) {
        // Navigation shortcuts (G + key)
        if (e.key.toLowerCase() === "g") {
          // Wait for next key
          const handleNextKey = (e2: KeyboardEvent) => {
            const key = e2.key.toLowerCase();
            if (key === "h") onAction("go-home");
            else if (key === "g") onAction("go-glossary");
            else if (key === "c") onAction("go-carriers");
            else if (key === "i") onAction("go-infrastructure");
            else if (key === "v") onAction("go-voice");
            document.removeEventListener("keydown", handleNextKey);
          };
          document.addEventListener("keydown", handleNextKey, { once: true });
          setTimeout(() => document.removeEventListener("keydown", handleNextKey), 1000);
        }

        // Single key shortcuts
        switch (e.key.toLowerCase()) {
          case "e": onAction("edit"); break;
          case "h": if (!e.ctrlKey && !e.metaKey) onAction("history"); break;
          case "s": if (!e.ctrlKey && !e.metaKey) onAction("source"); break;
          case "t": onAction("talk"); break;
          case "w": onAction("watch"); break;
          case "d": onAction("toggle-theme"); break;
          case "l": onAction("language"); break;
          case "/": 
            e.preventDefault();
            onAction("search"); 
            break;
        }

        // Cmd/Ctrl + K for search
        if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
          e.preventDefault();
          onAction("search");
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onAction, lightTap]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={() => setIsOpen(false)}
        >
          <motion.div
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className={`w-full max-w-2xl max-h-[80vh] rounded-2xl overflow-hidden ${
              isDark 
                ? 'bg-[#0A0A12] border border-purple-500/20 shadow-2xl shadow-purple-500/20' 
                : 'bg-white border border-black/10 shadow-2xl'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className={`flex items-center justify-between px-5 py-4 border-b ${
              isDark ? 'border-purple-500/10' : 'border-black/5'
            }`}>
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl ${
                  isDark ? 'bg-purple-500/20' : 'bg-primary/10'
                }`}>
                  <Keyboard className={`w-5 h-5 ${isDark ? 'text-purple-400' : 'text-primary'}`} />
                </div>
                <div>
                  <h2 className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-foreground'}`}>
                    Keyboard Shortcuts
                  </h2>
                  <p className={`text-[10px] ${isDark ? 'text-gray-500' : 'text-foreground/40'}`}>
                    Press <kbd className={`px-1.5 py-0.5 rounded ${isDark ? 'bg-white/10' : 'bg-black/10'}`}>?</kbd> to toggle
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className={`p-2 rounded-lg transition-colors ${
                  isDark ? 'hover:bg-white/10' : 'hover:bg-black/10'
                }`}
              >
                <X className={`w-4 h-4 ${isDark ? 'text-gray-400' : 'text-foreground/50'}`} />
              </button>
            </div>

            {/* Shortcuts Grid */}
            <div className="p-5 overflow-y-auto max-h-[60vh]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {shortcutGroups.map((group, groupIndex) => (
                  <motion.div
                    key={group.title}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: groupIndex * 0.05 }}
                  >
                    <h3 className={`text-[10px] font-semibold uppercase tracking-wider mb-3 ${
                      isDark ? 'text-purple-400' : 'text-primary'
                    }`}>
                      {group.title}
                    </h3>
                    <div className="space-y-2">
                      {group.shortcuts.map((shortcut, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: groupIndex * 0.05 + index * 0.02 }}
                          className={`flex items-center justify-between py-1.5 px-2 rounded-lg ${
                            isDark ? 'hover:bg-white/5' : 'hover:bg-black/5'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            {shortcut.icon && (
                              <shortcut.icon className={`w-3 h-3 ${
                                isDark ? 'text-gray-500' : 'text-foreground/40'
                              }`} />
                            )}
                            <span className={`text-[11px] ${
                              isDark ? 'text-gray-300' : 'text-foreground/70'
                            }`}>
                              {shortcut.description}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            {shortcut.keys.map((key, keyIndex) => (
                              <span key={keyIndex}>
                                <kbd className={`px-1.5 py-0.5 text-[10px] font-mono rounded ${
                                  isDark 
                                    ? 'bg-white/10 text-gray-300 border border-white/10' 
                                    : 'bg-black/5 text-foreground/70 border border-black/10'
                                }`}>
                                  {key}
                                </kbd>
                                {keyIndex < shortcut.keys.length - 1 && (
                                  <span className={`mx-0.5 text-[10px] ${
                                    isDark ? 'text-gray-600' : 'text-foreground/30'
                                  }`}>+</span>
                                )}
                              </span>
                            ))}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className={`px-5 py-3 border-t ${
              isDark ? 'border-purple-500/10' : 'border-black/5'
            }`}>
              <div className="flex items-center justify-between">
                <span className={`text-[9px] ${isDark ? 'text-gray-500' : 'text-foreground/40'}`}>
                  Shortcuts work when not typing in an input field
                </span>
                <span className={`text-[9px] font-mono ${
                  isDark ? 'text-purple-400/40' : 'text-primary/40'
                }`}>
                  FREEDOMLOVE · 76162
                </span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
