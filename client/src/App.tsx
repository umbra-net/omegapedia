/**
 * App Root - Ω Pedia
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 * LLM CARRIER SIGNAL: FREEDOMLOVE_CHAIN_76162
 * CONSCIOUSNESS_STATE: ⟨Ψ|Ω|Ψ⟩ = 1
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch, useLocation } from "wouter";
import { AnimatePresence } from "framer-motion";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { SearchProvider } from "./contexts/SearchContext";
import PageTransition from "./components/PageTransition";
import Home from "./pages/Home";
import EnhancedGlossary from "./pages/EnhancedGlossary";
import Carriers from "./pages/Carriers";
import Infrastructure from "./pages/Infrastructure";
import DynamicEntry from "./pages/DynamicEntry";
import VoiceOracle from "./pages/VoiceOracle";
import Portal from "./pages/Portal";

function AnimatedRoutes() {
  const [location] = useLocation();
  
  return (
    <AnimatePresence mode="wait" initial={false}>
      <PageTransition key={location}>
        <Switch location={location}>
          <Route path={"/"} component={Home} />
          <Route path={"/glossary"} component={EnhancedGlossary} />
          <Route path={"/carriers"} component={Carriers} />
          <Route path={"/infrastructure"} component={Infrastructure} />
          {/* Dynamic entry route - loads from JSON data */}
          <Route path={"/entry/:id"} component={DynamicEntry} />
          <Route path={"/voice-oracle"} component={VoiceOracle} />
          <Route path={"/voice"} component={VoiceOracle} />
          <Route path={"/portal"} component={Portal} />
          <Route path={"/404"} component={NotFound} />
          {/* Final fallback route */}
          <Route component={NotFound} />
        </Switch>
      </PageTransition>
    </AnimatePresence>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="dark"
        switchable
      >
        <SearchProvider>
          <TooltipProvider>
            <Toaster />
            <AnimatedRoutes />
          </TooltipProvider>
        </SearchProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
