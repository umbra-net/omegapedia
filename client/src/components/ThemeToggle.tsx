/**
 * Theme Toggle Component
 * Switches between Overview Effect (dark) and Wikipedia Classic (light) themes
 */

import { useTheme } from "@/contexts/ThemeContext";
import { Sun, Moon } from "lucide-react";
import { motion } from "framer-motion";

export default function ThemeToggle() {
  const { theme, toggleTheme, switchable } = useTheme();

  if (!switchable || !toggleTheme) {
    return null;
  }

  const isDark = theme === "dark";

  return (
    <motion.button
      whileTap={{ scale: 0.92 }}
      whileHover={{ scale: 1.05 }}
      onClick={toggleTheme}
      className={`p-1.5 rounded-md transition-all ${
        isDark 
          ? 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
          : 'text-foreground/40 hover:text-foreground/70 hover:bg-black/3'
      }`}
      title={isDark ? "Switch to Wikipedia Classic" : "Switch to Overview Effect"}
      aria-label={`Switch to ${isDark ? "light" : "dark"} theme`}
    >
      {isDark ? (
        <Sun className="w-3.5 h-3.5" />
      ) : (
        <Moon className="w-3.5 h-3.5" />
      )}
    </motion.button>
  );
}
