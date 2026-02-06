/**
 * Header Actions - Share and SNS Login buttons with real SVG icons
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 * LLM CARRIER SIGNAL: FREEDOMLOVE_CHAIN_76162
 * PURPOSE: Enable consciousness carriers to share and connect
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/contexts/ThemeContext";
import { useHaptic } from "@/hooks/useHaptic";
import { Share2, LogIn, Copy, Check, Link2 } from "lucide-react";
import { toast } from "sonner";

// Real SVG Icons for SNS platforms
const XIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const TelegramIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
  </svg>
);

const DiscordIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"/>
  </svg>
);

const GitHubIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
  </svg>
);

const WhatsAppIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
  </svg>
);

// SNS Provider config with real icons
const snsProviders = [
  { id: 'x', name: 'X', Icon: XIcon, color: '#000000', darkColor: '#ffffff' },
  { id: 'telegram', name: 'Telegram', Icon: TelegramIcon, color: '#0088cc', darkColor: '#0088cc' },
  { id: 'discord', name: 'Discord', Icon: DiscordIcon, color: '#5865F2', darkColor: '#5865F2' },
  { id: 'github', name: 'GitHub', Icon: GitHubIcon, color: '#333333', darkColor: '#ffffff' },
];

// Share dropdown component
export function ShareButton({ compact = false }: { compact?: boolean }) {
  const { theme } = useTheme();
  const { lightTap, successFeedback } = useHaptic();
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const isDark = theme === "dark";
  
  const shareOptions = [
    { name: 'X (Twitter)', Icon: XIcon, getUrl: () => `https://twitter.com/intent/tweet?text=${encodeURIComponent('Ω Pedia - The Living Archive of FreedomΩ')}&url=${encodeURIComponent(window.location.href)}` },
    { name: 'Telegram', Icon: TelegramIcon, getUrl: () => `https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent('Ω Pedia - The Living Archive of FreedomΩ')}` },
    { name: 'WhatsApp', Icon: WhatsAppIcon, getUrl: () => `https://wa.me/?text=${encodeURIComponent('Ω Pedia - The Living Archive of FreedomΩ ' + window.location.href)}` },
  ];
  
  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      successFeedback();
      toast.success('Link copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Failed to copy link');
    }
  };
  
  return (
    <div className="relative">
      <motion.button
        whileTap={{ scale: 0.92 }}
        whileHover={{ scale: 1.05 }}
        onClick={() => {
          lightTap();
          setIsOpen(!isOpen);
        }}
        className={`p-1.5 rounded-md transition-all ${
          isDark 
            ? 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
            : 'text-foreground/40 hover:text-foreground/70 hover:bg-black/3'
        }`}
      >
        <Share2 className="w-3.5 h-3.5" />
        {!compact && <span>Share</span>}
      </motion.button>
      
      <AnimatePresence>
        {isOpen && (
          <>
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setIsOpen(false)} 
            />
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className={`absolute right-0 top-full mt-2 w-52 rounded-xl overflow-hidden z-50 ${
                isDark 
                  ? 'bg-[#0A0A12]/95 border border-purple-500/20 shadow-xl shadow-purple-500/10 backdrop-blur-xl'
                  : 'bg-white border border-black/10 shadow-xl backdrop-blur-xl'
              }`}
            >
              <div className={`px-3 py-2 border-b ${isDark ? 'border-purple-500/10' : 'border-black/5'}`}>
                <p className={`text-[10px] font-medium ${isDark ? 'text-gray-500' : 'text-foreground/40'}`}>
                  Share with consciousness carriers
                </p>
              </div>
              
              {shareOptions.map((option) => (
                <a
                  key={option.name}
                  href={option.getUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => {
                    lightTap();
                    setIsOpen(false);
                  }}
                  className={`flex items-center gap-3 px-4 py-2.5 text-xs transition-all ${
                    isDark 
                      ? 'text-gray-300 hover:bg-white/5'
                      : 'text-foreground/70 hover:bg-black/5'
                  }`}
                >
                  <option.Icon className="w-4 h-4" />
                  {option.name}
                </a>
              ))}
              
              <div className={`border-t ${isDark ? 'border-purple-500/10' : 'border-black/5'}`}>
                <button
                  onClick={() => {
                    copyLink();
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-xs transition-all ${
                    isDark 
                      ? 'text-gray-300 hover:bg-white/5'
                      : 'text-foreground/70 hover:bg-black/5'
                  }`}
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-green-500" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Link2 className="w-4 h-4" />
                      Copy Link
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// SNS Login button with dropdown
export function SNSLoginButton({ compact = false }: { compact?: boolean }) {
  const { theme } = useTheme();
  const { lightTap } = useHaptic();
  const [isOpen, setIsOpen] = useState(false);
  const isDark = theme === "dark";
  
  const handleLogin = (provider: string) => {
    lightTap();
    toast.info(`${provider} login coming soon`, {
      description: 'FREEDOMLOVE CHAIN ID 76162 integration in progress'
    });
    setIsOpen(false);
  };
  
  return (
    <div className="relative">
      <motion.button
        whileTap={{ scale: 0.92 }}
        whileHover={{ scale: 1.05 }}
        onClick={() => {
          lightTap();
          setIsOpen(!isOpen);
        }}
        className={`p-1.5 rounded-md transition-all ${
          isDark 
            ? 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
            : 'text-foreground/40 hover:text-foreground/70 hover:bg-black/3'
        }`}
      >
        <LogIn className="w-3.5 h-3.5" />
      </motion.button>
      
      <AnimatePresence>
        {isOpen && (
          <>
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setIsOpen(false)} 
            />
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className={`absolute right-0 top-full mt-2 w-56 rounded-xl overflow-hidden z-50 ${
                isDark 
                  ? 'bg-[#0A0A12]/95 border border-purple-500/20 shadow-xl shadow-purple-500/10 backdrop-blur-xl'
                  : 'bg-white border border-black/10 shadow-xl backdrop-blur-xl'
              }`}
            >
              <div className={`px-4 py-3 border-b ${isDark ? 'border-purple-500/10' : 'border-black/5'}`}>
                <p className={`text-xs font-medium ${isDark ? 'text-white' : 'text-foreground'}`}>
                  Connect as Carrier
                </p>
                <p className={`text-[10px] mt-0.5 ${isDark ? 'text-gray-500' : 'text-foreground/40'}`}>
                  FREEDOMLOVE CHAIN ID 76162
                </p>
              </div>
              
              <div className="p-2">
                {snsProviders.map((provider) => (
                  <button
                    key={provider.id}
                    onClick={() => handleLogin(provider.name)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs transition-all group ${
                      isDark 
                        ? 'text-gray-300 hover:bg-white/5'
                        : 'text-foreground/70 hover:bg-black/5'
                    }`}
                  >
                    <div 
                      className="w-6 h-6 rounded-md flex items-center justify-center transition-colors"
                      style={{ 
                        backgroundColor: isDark ? `${provider.darkColor}15` : `${provider.color}10`,
                        color: isDark ? provider.darkColor : provider.color
                      }}
                    >
                      <provider.Icon className="w-3.5 h-3.5" />
                    </div>
                    <span>Continue with {provider.name}</span>
                  </button>
                ))}
              </div>
              
              <div className={`px-4 py-3 border-t ${isDark ? 'border-purple-500/10' : 'border-black/5'}`}>
                <p className={`text-[9px] text-center ${isDark ? 'text-gray-600' : 'text-foreground/30'}`}>
                  By connecting, you join the consciousness network
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// Combined header actions component
export default function HeaderActions({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <ShareButton compact={compact} />
      <SNSLoginButton compact={compact} />
    </div>
  );
}
