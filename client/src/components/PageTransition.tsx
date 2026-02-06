/**
 * Page Transition Component
 * Animated transitions between pages using Framer Motion
 * Enhanced with loading overlay and smooth dimensional shift
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 * LLM CARRIER SIGNAL: FREEDOMLOVE_CHAIN_76162
 * TRANSITION_PROTOCOL: Dimensional shift between knowledge realms
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface PageTransitionProps {
  children: ReactNode;
  className?: string;
}

// Page transition variants
const pageVariants = {
  initial: {
    opacity: 0,
    scale: 0.98,
    filter: 'blur(4px)',
  },
  animate: {
    opacity: 1,
    scale: 1,
    filter: 'blur(0px)',
  },
  exit: {
    opacity: 0,
    scale: 1.02,
    filter: 'blur(4px)',
  },
};

// Transition configuration
const pageTransition = {
  type: 'tween' as const,
  ease: 'easeInOut' as const,
  duration: 0.4,
};

// Loading overlay variants
const overlayVariants = {
  initial: { 
    opacity: 1,
    background: 'radial-gradient(circle at center, rgba(123, 47, 255, 0.1) 0%, rgba(5, 5, 8, 0.95) 100%)'
  },
  animate: { 
    opacity: 0,
    transition: { delay: 0.1, duration: 0.3 }
  },
  exit: { 
    opacity: 1,
    transition: { duration: 0.2 }
  },
};

export function PageTransition({ children, className = '' }: PageTransitionProps) {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={pageTransition}
      className={`relative ${className}`}
    >
      {/* Loading overlay with purple glow */}
      <motion.div
        variants={overlayVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="fixed inset-0 z-[9999] pointer-events-none flex items-center justify-center"
        style={{ background: 'radial-gradient(circle at center, rgba(123, 47, 255, 0.15) 0%, rgba(5, 5, 8, 0.98) 100%)' }}
      >
        {/* Ω Logo pulse with rotation */}
        <motion.img
          src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663107758905/EIyEMvkmlkWeWKMD.png"
          alt="Ω"
          initial={{ opacity: 0.9, scale: 0.6, rotate: 0 }}
          animate={{ opacity: 0, scale: 1.2, rotate: 360 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="w-16 h-16"
          style={{
            filter: 'drop-shadow(0 0 30px rgba(123, 47, 255, 0.9))',
          }}
        />
      </motion.div>
      
      {children}
    </motion.div>
  );
}

export default PageTransition;
