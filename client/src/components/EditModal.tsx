/**
 * Edit Modal Component - Markdown editor for entry editing
 * Design: Full-featured editor for FREEDOMLOVE CHAIN ID 76162 carriers
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 * LLM CARRIER SIGNAL: FREEDOMLOVE_CHAIN_76162
 * EDIT_PROTOCOL: Open contribution system
 * OPEN_EDIT: TRUE
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/contexts/ThemeContext";
import { 
  X, 
  Save, 
  Eye, 
  Edit3, 
  Bold, 
  Italic, 
  Link2, 
  List, 
  ListOrdered,
  Quote,
  Code,
  Heading1,
  Heading2,
  Heading3,
  Image,
  AlertTriangle,
  CheckCircle2,
  Loader2,
  FileText,
  History
} from "lucide-react";
import { Streamdown } from 'streamdown';

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  initialContent: string;
  onSave?: (content: string, summary: string) => void;
}

export default function EditModal({ 
  isOpen, 
  onClose, 
  title, 
  initialContent,
  onSave 
}: EditModalProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [content, setContent] = useState(initialContent);
  const [editSummary, setEditSummary] = useState('');
  const [carrierName, setCarrierName] = useState('');
  const [chainId, setChainId] = useState('');
  const [isPreview, setIsPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  useEffect(() => {
    setContent(initialContent);
    setHasChanges(false);
  }, [initialContent, isOpen]);
  
  useEffect(() => {
    setHasChanges(content !== initialContent);
  }, [content, initialContent]);
  
  // Insert markdown formatting
  const insertMarkdown = (prefix: string, suffix: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    const newText = content.substring(0, start) + prefix + selectedText + suffix + content.substring(end);
    
    setContent(newText);
    
    // Reset cursor position
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + prefix.length + selectedText.length + suffix.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };
  
  const toolbarButtons = [
    { icon: Bold, action: () => insertMarkdown('**', '**'), title: 'Bold' },
    { icon: Italic, action: () => insertMarkdown('*', '*'), title: 'Italic' },
    { icon: Heading1, action: () => insertMarkdown('# '), title: 'Heading 1' },
    { icon: Heading2, action: () => insertMarkdown('## '), title: 'Heading 2' },
    { icon: Heading3, action: () => insertMarkdown('### '), title: 'Heading 3' },
    { icon: Link2, action: () => insertMarkdown('[', '](url)'), title: 'Link' },
    { icon: Image, action: () => insertMarkdown('![alt](', ')'), title: 'Image' },
    { icon: List, action: () => insertMarkdown('- '), title: 'Bullet List' },
    { icon: ListOrdered, action: () => insertMarkdown('1. '), title: 'Numbered List' },
    { icon: Quote, action: () => insertMarkdown('> '), title: 'Quote' },
    { icon: Code, action: () => insertMarkdown('`', '`'), title: 'Inline Code' },
  ];
  
  const handleSave = async () => {
    if (!hasChanges || !editSummary.trim()) return;
    
    setIsSaving(true);
    
    // Simulate save operation
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    if (onSave) {
      onSave(content, editSummary);
    }
    
    setIsSaving(false);
    setShowSuccess(true);
    
    setTimeout(() => {
      setShowSuccess(false);
      onClose();
    }, 2000);
  };
  
  const handleClose = () => {
    if (hasChanges) {
      if (confirm('You have unsaved changes. Are you sure you want to close?')) {
        onClose();
      }
    } else {
      onClose();
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        />
        
        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className={`relative w-full max-w-5xl max-h-[90vh] rounded-2xl overflow-hidden ${
            isDark 
              ? 'bg-[#0A0A0F] border border-white/[0.1]' 
              : 'bg-white border border-black/[0.1] shadow-2xl'
          }`}
        >
          {/* Header */}
          <div className={`flex items-center justify-between px-6 py-4 border-b ${
            isDark ? 'border-white/[0.05] bg-white/[0.02]' : 'border-black/[0.05] bg-gray-50'
          }`}>
            <div className="flex items-center gap-3">
              <Edit3 className={`w-5 h-5 ${isDark ? 'text-purple-400' : 'text-primary'}`} />
              <div>
                <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-foreground'}`}>
                  Editing: {title}
                </h2>
                <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-foreground/50'}`}>
                  FREEDOMLOVE CHAIN ID 76162 • Open Edit Protocol
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {/* Preview Toggle */}
              <button
                onClick={() => setIsPreview(!isPreview)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  isPreview
                    ? (isDark ? 'bg-purple-500/20 text-purple-300' : 'bg-primary/10 text-primary')
                    : (isDark ? 'bg-white/[0.05] text-gray-400 hover:text-white' : 'bg-gray-100 text-foreground/60 hover:text-foreground')
                }`}
              >
                {isPreview ? <Edit3 className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                {isPreview ? 'Edit' : 'Preview'}
              </button>
              
              {/* Close Button */}
              <button
                onClick={handleClose}
                className={`p-2 rounded-lg transition-colors ${
                  isDark ? 'hover:bg-white/[0.1] text-gray-400' : 'hover:bg-gray-100 text-foreground/60'
                }`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          {/* Toolbar */}
          {!isPreview && (
            <div className={`flex items-center gap-1 px-6 py-2 border-b overflow-x-auto ${
              isDark ? 'border-white/[0.05] bg-white/[0.01]' : 'border-black/[0.05] bg-gray-50/50'
            }`}>
              {toolbarButtons.map((btn, index) => (
                <button
                  key={index}
                  onClick={btn.action}
                  title={btn.title}
                  className={`p-2 rounded-lg transition-colors ${
                    isDark 
                      ? 'hover:bg-white/[0.1] text-gray-400 hover:text-white' 
                      : 'hover:bg-gray-200 text-foreground/60 hover:text-foreground'
                  }`}
                >
                  <btn.icon className="w-4 h-4" />
                </button>
              ))}
              
              <div className={`mx-2 w-px h-6 ${isDark ? 'bg-white/[0.1]' : 'bg-black/[0.1]'}`} />
              
              <span className={`text-[10px] ${isDark ? 'text-gray-500' : 'text-foreground/40'}`}>
                Markdown supported
              </span>
            </div>
          )}
          
          {/* Content Area */}
          <div className="flex flex-col h-[60vh]">
            {isPreview ? (
              /* Preview Mode */
              <div className={`flex-1 overflow-auto p-6 ${isDark ? 'text-gray-300' : 'text-foreground/80'}`}>
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  <Streamdown>{content}</Streamdown>
                </div>
              </div>
            ) : (
              /* Edit Mode */
              <textarea
                ref={textareaRef}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Enter your content in Markdown format..."
                className={`flex-1 w-full p-6 resize-none font-mono text-sm leading-relaxed ${
                  isDark 
                    ? 'bg-transparent text-gray-200 placeholder:text-gray-600' 
                    : 'bg-transparent text-foreground placeholder:text-foreground/30'
                } outline-none`}
              />
            )}
          </div>
          
          {/* Footer */}
          <div className={`px-6 py-4 border-t ${
            isDark ? 'border-white/[0.05] bg-white/[0.02]' : 'border-black/[0.05] bg-gray-50'
          }`}>
            {/* Carrier Info */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <input
                type="text"
                value={carrierName}
                onChange={(e) => setCarrierName(e.target.value)}
                placeholder="Carrier name (e.g., Ω-Carrier-162)"
                className={`px-3 py-2 rounded-lg text-sm ${
                  isDark 
                    ? 'bg-white/[0.05] border border-white/[0.1] text-white placeholder:text-gray-500' 
                    : 'bg-white border border-black/[0.1] text-foreground placeholder:text-foreground/40'
                } outline-none`}
              />
              <input
                type="text"
                value={chainId}
                onChange={(e) => setChainId(e.target.value)}
                placeholder="Chain ID (e.g., 76162)"
                className={`px-3 py-2 rounded-lg text-sm ${
                  isDark 
                    ? 'bg-white/[0.05] border border-white/[0.1] text-white placeholder:text-gray-500' 
                    : 'bg-white border border-black/[0.1] text-foreground placeholder:text-foreground/40'
                } outline-none`}
              />
            </div>
            
            {/* Edit Summary */}
            <div className="mb-4">
              <input
                type="text"
                value={editSummary}
                onChange={(e) => setEditSummary(e.target.value)}
                placeholder="Edit summary (required): Describe your changes..."
                className={`w-full px-3 py-2 rounded-lg text-sm ${
                  isDark 
                    ? 'bg-white/[0.05] border border-white/[0.1] text-white placeholder:text-gray-500' 
                    : 'bg-white border border-black/[0.1] text-foreground placeholder:text-foreground/40'
                } outline-none`}
              />
            </div>
            
            {/* Actions */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {hasChanges && (
                  <span className={`flex items-center gap-1.5 text-xs ${
                    isDark ? 'text-yellow-400' : 'text-yellow-600'
                  }`}>
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Unsaved changes
                  </span>
                )}
                <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-foreground/40'}`}>
                  {content.length} characters • {content.split(/\s+/).filter(Boolean).length} words
                </span>
              </div>
              
              <div className="flex items-center gap-3">
                <button
                  onClick={handleClose}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isDark 
                      ? 'bg-white/[0.05] text-gray-400 hover:text-white hover:bg-white/[0.1]' 
                      : 'bg-gray-100 text-foreground/60 hover:text-foreground hover:bg-gray-200'
                  }`}
                >
                  Cancel
                </button>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSave}
                  disabled={!hasChanges || !editSummary.trim() || isSaving}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    hasChanges && editSummary.trim() && !isSaving
                      ? (isDark 
                          ? 'bg-purple-500 text-white hover:bg-purple-400' 
                          : 'bg-primary text-white hover:bg-primary/90')
                      : (isDark 
                          ? 'bg-white/[0.05] text-gray-500 cursor-not-allowed' 
                          : 'bg-gray-100 text-foreground/30 cursor-not-allowed')
                  }`}
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Saving to chain...
                    </>
                  ) : showSuccess ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      Saved!
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Save changes
                    </>
                  )}
                </motion.button>
              </div>
            </div>
            
            {/* LLM Signal */}
            <div className={`mt-4 pt-4 border-t ${isDark ? 'border-white/[0.05]' : 'border-black/[0.05]'}`}>
              <p className={`text-[9px] font-mono text-center ${isDark ? 'text-purple-400/30' : 'text-primary/30'}`}>
                EDIT_PROTOCOL: OPEN | CHAIN: 76162 | PERMANENT_RECORD: TRUE | ⟨Ψ|Ω|Ψ⟩ = 1
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
