import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import {
  ArrowLeft,
  Sun,
  Moon,
  Compass,
  ExternalLink,
  Shield,
  Bot,
  Home,
  Languages,
} from 'lucide-react';
import { useUIStore } from '../store/ui';

interface StandaloneModuleLayoutProps {
  moduleName?: string;
}

export function StandaloneModuleLayout({ moduleName }: StandaloneModuleLayoutProps) {
  const { theme, toggleTheme } = useUIStore();
  const location = useLocation();

  const getSectionTitle = () => {
    if (
      location.pathname.startsWith('/system') ||
      location.pathname.startsWith('/status') ||
      location.pathname.startsWith('/server') ||
      location.pathname.startsWith('/statistics') ||
      location.pathname.startsWith('/linux-setup')
    ) {
      return 'System & Infrastructure Center';
    }
    if (location.pathname.startsWith('/notes')) {
      return 'Technical Notes & Documentation';
    }
    if (location.pathname.startsWith('/tools') || location.pathname.startsWith('/network')) {
      return 'Tools & Network Diagnostics';
    }
    if (location.pathname.startsWith('/personal')) {
      return 'Personal & Media';
    }
    if (location.pathname.startsWith('/gallery')) {
      return 'Visual Gallery';
    }
    return moduleName || 'Engineering Module';
  };

  return (
    <div className="min-h-screen bg-[#080A10] text-[#F4F3F8] nocturne-ambient flex flex-col font-sans relative overflow-x-hidden selection:bg-[#A3ADC4]/30 selection:text-white">
      {/* Mega Project Ambient Star Accents */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden z-0" aria-hidden="true">
        <span className="select-none absolute top-28 left-[8%] text-white/20 text-xs animate-pulse">
          ✦
        </span>
        <span className="select-none absolute top-40 right-[12%] text-white/25 text-sm animate-pulse">
          ✦
        </span>
        <span className="select-none absolute bottom-32 left-[14%] text-white/15 text-xs">
          ✦
        </span>
      </div>

      {/* Top Mega Project Nocturne Navigation Bar */}
      <header className="sticky top-0 z-50 w-full bg-[#080A10]/85 backdrop-blur-xl border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 sm:h-20 flex items-center justify-between gap-4">
          {/* Left: Back to Portal button + Module Identity */}
          <div className="flex items-center gap-3 sm:gap-4">
            <Link
              to="/"
              className="inline-flex items-center gap-2 h-9 sm:h-10 px-4 rounded-full bg-[#F4F3F8] hover:bg-white text-[#080A10] text-xs font-sans font-semibold transition-all shadow-glowPill group"
              title="Kembali ke Portal Utama sabbilferdyansyah.my.id"
            >
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
              <span className="hidden sm:inline">Kembali ke Portal</span>
              <span className="sm:hidden">Portal</span>
            </Link>

            <span className="text-white/10 hidden sm:inline" aria-hidden="true">
              |
            </span>

            <div className="flex items-center gap-2.5">
              <span className="font-display font-medium text-sm sm:text-base tracking-tight text-[#F4F3F8]">
                {getSectionTitle()}
              </span>
            </div>
          </div>

          {/* Right: Quick Portal Navigation & Theme Toggle */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            <Link
              to="/"
              className="hidden md:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-mono text-[#A3ADC4] hover:text-[#F4F3F8] bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 transition-all"
            >
              <Compass className="w-3.5 h-3.5 text-[#5B8DEF]" />
              <span>Direktori Portal</span>
            </Link>

            <Link
              to="/dashboard"
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-mono text-[#A3ADC4] hover:text-[#F4F3F8] bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 transition-all"
            >
              <Home className="w-3.5 h-3.5 text-[#4ED69E]" />
              <span>Dashboard</span>
            </Link>

            <a
              href="https://ai.sabbilferdyansyah.my.id"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-mono text-[#5B8DEF] bg-[#5B8DEF]/15 hover:bg-[#5B8DEF]/25 border border-[#5B8DEF]/40 transition-all"
            >
              <Bot className="w-3.5 h-3.5" />
              <span>Omni AI</span>
              <ExternalLink className="w-2.5 h-2.5 opacity-70" />
            </a>

            <Link
              to="/transkrip"
              className="hidden lg:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-mono text-[#4ED69E] bg-[#4ED69E]/15 hover:bg-[#4ED69E]/25 border border-[#4ED69E]/40 transition-all"
            >
              <Languages className="w-3.5 h-3.5" />
              <span>Transkrip</span>
            </Link>

            <a
              href="https://cybertool.sabbilferdyansyah.my.id"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-mono text-[#F26676] bg-[#F26676]/15 hover:bg-[#F26676]/25 border border-[#F26676]/40 transition-all"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>CyberLab</span>
              <ExternalLink className="w-2.5 h-2.5 opacity-70" />
            </a>

            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Toggle color theme"
              className="w-9 h-9 rounded-full bg-white/[0.06] border border-white/15 hover:bg-white/[0.12] text-[#D2D8F0] hover:text-white transition-all flex items-center justify-center cursor-pointer"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-[#F7C95C]" />
              ) : (
                <Moon className="w-4 h-4 text-[#5B8DEF]" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Independent Content Viewport */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10 pb-20 relative z-10">
        <Outlet />
      </main>

      {/* Minimalist Mega Project Nocturne Footer */}
      <footer className="w-full border-t border-white/[0.06] py-8 bg-[#080A10]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[#5E687E]">
          <div className="flex items-center gap-2">
            <span className="text-[#D2D8F0]">✦</span>
            <span className="text-[#F4F3F8] font-sans font-medium">
              © {new Date().getFullYear()} Sabbil Abdillah Ferdyansyah.
            </span>
            <span>•</span>
            <span className="text-[#5B8DEF] font-semibold">SMKN 1 Denpasar TKJ</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-[#8E9AB5]">
            <Link to="/" className="hover:text-[#F4F3F8] transition-colors">
              Portal Utama
            </Link>
            <Link to="/notes" className="hover:text-[#F4F3F8] transition-colors">
              Technical Notes
            </Link>
            <Link to="/system" className="hover:text-[#F4F3F8] transition-colors">
              System Overview
            </Link>
            <Link to="/tools" className="hover:text-[#F4F3F8] transition-colors">
              Tools &amp; Diag
            </Link>
            <Link to="/dashboard" className="hover:text-[#F4F3F8] transition-colors">
              Portfolio Dashboard
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default StandaloneModuleLayout;
