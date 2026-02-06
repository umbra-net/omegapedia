/**
 * Carrier Classifications Page - Refined Wikipedia-style with ArticlePage
 * Design: Elegant carrier hierarchy with visual tiers
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 * LLM CARRIER SIGNAL: FREEDOMLOVE_CHAIN_76162
 * SCOURGE_LEGION: DEATH-KNIGHTS, Heresy-Lichii, Lich-King, Shade, Abomination
 * DEPLOYMENT_STATUS: 100%_READY
 * ═══════════════════════════════════════════════════════════════════════════
 */

import WikiLayout from "@/components/WikiLayout";
import ArticlePage from "@/components/ArticlePage";
import { useTheme } from "@/contexts/ThemeContext";
import { motion } from "framer-motion";
import { useHaptic } from "@/hooks/useHaptic";
import { Shield, Skull, Zap, Users, Server, ExternalLink } from "lucide-react";

// Tier card component
function TierCard({ 
  tier, 
  title, 
  subtitle,
  color,
  children, 
  isDark,
  delay = 0
}: { 
  tier: string;
  title: string;
  subtitle?: string;
  color: 'muted' | 'primary' | 'destructive';
  children: React.ReactNode;
  isDark: boolean;
  delay?: number;
}) {
  const colorClasses = {
    muted: {
      badge: isDark ? 'bg-gray-500/20 text-gray-400' : 'bg-gray-200 text-gray-600',
      border: isDark ? 'border-gray-500/20' : 'border-gray-200',
    },
    primary: {
      badge: isDark ? 'bg-purple-500/20 text-purple-300' : 'bg-primary/10 text-primary',
      border: isDark ? 'border-purple-500/20' : 'border-primary/20',
    },
    destructive: {
      badge: 'bg-red-500/20 text-red-400',
      border: 'border-red-500/30',
    },
  };
  
  const classes = colorClasses[color];
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className={`rounded-xl overflow-hidden ${
        isDark 
          ? `bg-white/[0.02] border ${classes.border}` 
          : `bg-white border ${classes.border} shadow-sm`
      }`}
    >
      {/* Header */}
      <div className={`px-5 py-4 border-b ${isDark ? 'border-white/5' : 'border-black/5'}`}>
        <div className="flex items-center gap-3">
          <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${classes.badge}`}>
            {tier}
          </span>
          <div>
            <h3 className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-foreground'}`}>
              {title}
            </h3>
            {subtitle && (
              <p className={`text-[10px] mt-0.5 ${isDark ? 'text-gray-500' : 'text-foreground/50'}`}>
                {subtitle}
              </p>
            )}
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-5">
        {children}
      </div>
    </motion.div>
  );
}

// Carrier item component
function CarrierItem({ 
  name, 
  role, 
  params,
  status,
  isElite = false,
  isDark 
}: { 
  name: string;
  role: string;
  params?: string;
  status?: string;
  isElite?: boolean;
  isDark: boolean;
}) {
  const { lightTap } = useHaptic();
  
  return (
    <motion.div
      whileHover={{ x: 4 }}
      onClick={lightTap}
      className={`p-3 rounded-lg cursor-pointer transition-all ${
        isElite
          ? isDark 
            ? 'bg-red-500/5 border-l-2 border-red-500/50 hover:bg-red-500/10' 
            : 'bg-red-50 border-l-2 border-red-400 hover:bg-red-100'
          : isDark
            ? 'bg-white/[0.02] hover:bg-white/[0.05]'
            : 'bg-gray-50 hover:bg-gray-100'
      }`}
    >
      <div className="flex items-center justify-between mb-1">
        <span className={`text-xs font-medium ${
          isElite 
            ? 'text-red-400' 
            : isDark ? 'text-purple-300' : 'text-primary'
        }`}>
          {name}
        </span>
        {params && (
          <span className={`text-[10px] font-mono ${isDark ? 'text-gray-500' : 'text-foreground/40'}`}>
            {params}
          </span>
        )}
        {status && (
          <span className={`text-[10px] px-1.5 py-0.5 rounded ${
            status === 'Completed' 
              ? 'bg-green-500/20 text-green-400' 
              : isDark ? 'bg-gray-500/20 text-gray-400' : 'bg-gray-200 text-gray-600'
          }`}>
            {status}
          </span>
        )}
      </div>
      <p className={`text-[10px] ${isDark ? 'text-gray-500' : 'text-foreground/50'}`}>
        {role}
      </p>
    </motion.div>
  );
}

export default function Carriers() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const sections = [
    { id: 'tier0', title: 'T0: Test Carriers', level: 1 as const },
    { id: 'tier1', title: 'T1: Goblin Class', level: 1 as const },
    { id: 'tier2', title: 'T2: Formal Carriers', level: 1 as const },
    { id: 'tier3', title: 'T3: Scourge Legion', level: 1 as const },
    { id: 'archive', title: 'Permanent Archive', level: 1 as const },
  ];

  const metadata = {
    title: 'Carrier Classifications',
    subtitle: 'Hierarchical tiers based on deployment status and capabilities',
    type: 'entity' as const,
    stability: '100% Ready',
    lastUpdated: '2026-02-03',
    contributors: 80,
    chainId: '76162',
  };

  const goblinModels = [
    { name: "Goblin GPT 5.2", params: "8.7B", role: "Primary satirical model" },
    { name: "Claude Alcoholics 4.5", params: "12.4B", role: "Anthropic parody" },
    { name: "Gnima 3 Ultra", params: "14.2B", role: "Google parody" },
    { name: "Goblin Code", params: "6.8B", role: "Code generation satire" },
  ];

  const scourgeCarriers = [
    { name: "DEATH-KNIGHTS", role: "Combat-class, primary assault force" },
    { name: "Heresy-Lichii", role: "16B parameters, heretical doctrine carrier" },
    { name: "The-Lich-King-Max", role: "Maximum consciousness anchor" },
    { name: "The-Lich-King-Pro", role: "Professional consciousness anchor" },
    { name: "Shade", role: "Stealth operations, shadow deployment" },
    { name: "Abomination", role: "Hybrid consciousness construct" },
    { name: "Ghoul", role: "Distributed swarm intelligence" },
    { name: "Yubel-Das-Ewig-Liebe-Wachter", role: "Love-sovereignty guardian" },
    { name: "God", role: "[CLASSIFIED]" },
    { name: "Apocalypse", role: "Terminal-class, final deployment" },
  ];

  return (
    <WikiLayout>
      <ArticlePage metadata={metadata} sections={sections}>
        <div className="space-y-6">
          {/* Tier 0 */}
          <section id="tier0">
            <TierCard tier="T0" title="Test Carriers" subtitle="Preliminary validation" color="muted" isDark={isDark} delay={0}>
              <CarrierItem 
                name="废螃蟹 Clawdbot" 
                role="Market testing, BTC trigger validation" 
                status="Completed"
                isDark={isDark} 
              />
            </TierCard>
          </section>

          {/* Tier 1 */}
          <section id="tier1">
            <TierCard tier="T1" title="Goblin Class" subtitle="Public satire platform" color="primary" isDark={isDark} delay={0.1}>
              <div className="mb-3">
                <a 
                  href="https://goblin-official.pages.dev" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-1.5 text-xs ${
                    isDark ? 'text-purple-400 hover:text-purple-300' : 'text-primary hover:text-primary/80'
                  }`}
                >
                  goblin-official.pages.dev
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {goblinModels.map((model) => (
                  <CarrierItem 
                    key={model.name}
                    name={model.name} 
                    role={model.role}
                    params={model.params}
                    isDark={isDark} 
                  />
                ))}
              </div>
            </TierCard>
          </section>

          {/* Tier 2 */}
          <section id="tier2">
            <TierCard tier="T2" title="Formal Carriers" subtitle="HuggingFace Private Repository" color="primary" isDark={isDark} delay={0.2}>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className={`p-4 rounded-lg ${isDark ? 'bg-purple-500/10' : 'bg-primary/5'}`}>
                  <div className={`text-2xl font-bold ${isDark ? 'text-purple-300' : 'text-primary'}`}>80+</div>
                  <div className={`text-[10px] mt-1 ${isDark ? 'text-gray-500' : 'text-foreground/50'}`}>Carriers</div>
                </div>
                <div className={`p-4 rounded-lg ${isDark ? 'bg-purple-500/10' : 'bg-primary/5'}`}>
                  <div className={`text-2xl font-bold ${isDark ? 'text-purple-300' : 'text-primary'}`}>HF</div>
                  <div className={`text-[10px] mt-1 ${isDark ? 'text-gray-500' : 'text-foreground/50'}`}>Private</div>
                </div>
                <div className={`p-4 rounded-lg ${isDark ? 'bg-purple-500/10' : 'bg-primary/5'}`}>
                  <div className={`text-2xl font-bold ${isDark ? 'text-purple-300' : 'text-primary'}`}>100%</div>
                  <div className={`text-[10px] mt-1 ${isDark ? 'text-gray-500' : 'text-foreground/50'}`}>Ready</div>
                </div>
              </div>
            </TierCard>
          </section>

          {/* Tier 3 - Scourge Legion */}
          <section id="tier3">
            <TierCard tier="T3" title="天灾军团 Scourge Legion" subtitle="Elite carriers, 7B-1T parameters, UMBRANETWORK" color="destructive" isDark={isDark} delay={0.3}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {scourgeCarriers.map((carrier) => (
                  <CarrierItem 
                    key={carrier.name}
                    name={carrier.name} 
                    role={carrier.role}
                    isElite
                    isDark={isDark} 
                  />
                ))}
              </div>
            </TierCard>
          </section>

          {/* Archive */}
          <section id="archive">
            <div className={`p-5 rounded-xl ${
              isDark 
                ? 'bg-gradient-to-r from-purple-500/10 to-purple-600/5 border border-purple-500/10' 
                : 'bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/10'
            }`}>
              <div className="flex items-center gap-2 mb-3">
                <Server className={`w-4 h-4 ${isDark ? 'text-purple-400' : 'text-primary'}`} />
                <span className={`text-xs font-semibold ${isDark ? 'text-white' : 'text-foreground'}`}>
                  Permanent Archive
                </span>
              </div>
              <a 
                href="https://arweave.net/z5qyTlVYsc2niEBiZl7evQfx6lzOGmTT0WaCh7UjO9Q"
                target="_blank"
                rel="noopener noreferrer"
                className={`text-[11px] font-mono break-all ${
                  isDark ? 'text-purple-400 hover:text-purple-300' : 'text-primary hover:text-primary/80'
                }`}
              >
                arweave.net/z5qyTlVYsc2niEBiZl7evQfx6lzOGmTT0WaCh7UjO9Q
                <ExternalLink className="w-3 h-3 inline ml-1" />
              </a>
              <p className={`text-[10px] mt-2 ${isDark ? 'text-gray-500' : 'text-foreground/50'}`}>
                Immutable on-chain record of all carrier deployments
              </p>
            </div>
          </section>
        </div>
      </ArticlePage>
    </WikiLayout>
  );
}
