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
  HardDrive,
  Home
} from 'lucide-react';
import { useUIStore } from '../store/ui';
import { cn } from '../utils';

interface StandaloneModuleLayoutProps {
  moduleName?: string;
}

export function StandaloneModuleLayout({ moduleName }: StandaloneModuleLayoutProps) {
  const { theme, toggleTheme } = useUIStore();
  const location = useLocation();

  // Determine current active section label
  const getSectionTitle = () => {
    if (location.pathname.startsWith('/system') || location.pathname.startsWith('/status') || location.pathname.startsWith('/server') || location.pathname.startsWith('/statistics') || location.pathname.startsWith('/linux-setup')) {
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
    <div className="min-h-screen bg-slate-50 dark:bg-[#070913] text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-300 selection:bg-violet-500/25 selection:text-violet-900 dark:selection:text-violet-200 relative overflow-x-hidden">
      
      {/* 1. Cyber Ambient Atmosphere */}
      <div 
        className="fixed inset-0 pointer-events-none bg-[linear-gradient(to_right,rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.03)_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_0%,#000_65%,transparent_100%)] opacity-80" 
        aria-hidden="true"
      />
      <div 
        className="fixed -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[450px] bg-violet-600/[0.07] dark:bg-violet-500/[0.1] rounded-full blur-[170px] pointer-events-none" 
        aria-hidden="true"
      />
      <div 
        className="fixed top-1/4 -right-32 w-[600px] h-[600px] bg-sky-500/[0.04] dark:bg-sky-500/[0.06] rounded-full blur-[180px] pointer-events-none" 
        aria-hidden="true"
      />

      {/* 2. Top Standalone Navigation Bar */}
      <header className="sticky top-0 z-50 w-full bg-white/80 dark:bg-[#070913]/85 backdrop-blur-xl border-b border-slate-200/80 dark:border-violet-500/20 shadow-sm transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-18 flex items-center justify-between gap-4">
          
          {/* Left: Back to Portal button + Module Identity */}
          <div className="flex items-center gap-3 sm:gap-4">
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200/80 dark:bg-white/[0.05] dark:hover:bg-white/[0.1] border border-slate-200/80 dark:border-white/10 text-slate-700 dark:text-slate-200 text-xs font-mono font-medium transition-all group"
              title="Kembali ke Portal Utama sabbilferdyansyah.my.id"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span className="hidden sm:inline">Kembali ke Portal</span>
              <span className="sm:hidden">Portal</span>
            </Link>

            <span className="text-slate-300 dark:text-white/10 hidden sm:inline" aria-hidden="true">|</span>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm sm:text-base font-sans tracking-tight text-slate-900 dark:text-slate-100">
                  {getSectionTitle()}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-violet-500/10 text-violet-700 dark:text-violet-300 border border-violet-500/20 hidden md:inline">
                  INDEPENDENT
                </span>
              </div>
            </div>
          </div>

          {/* Right: Quick Portal Navigation & Theme Toggle */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              to="/"
              className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-medium text-slate-600 dark:text-slate-300 hover:text-violet-600 dark:hover:text-violet-400 bg-transparent hover:bg-white/50 dark:hover:bg-white/[0.03] transition-all"
            >
              <Compass className="w-3.5 h-3.5 text-violet-500" />
              <span>Direktori Portal</span>
            </Link>

            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Ganti mode tema"
              className="p-2.5 rounded-xl bg-white/70 dark:bg-[#121626] border border-slate-200/80 dark:border-violet-500/20 hover:border-violet-500/40 text-slate-700 dark:text-slate-300 hover:text-violet-600 dark:hover:text-violet-400 transition-all shadow-sm cursor-pointer"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-violet-600" />
              )}
            </button>
          </div>

        </div>
      </header>

      {/* 3. Main Independent Content Viewport */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10 pb-20 relative z-10">
        <Outlet />
      </main>

      {/* 4. Minimalist Standalone Footer */}
      <footer className="w-full border-t border-slate-200/80 dark:border-violet-500/20 py-8 bg-white/40 dark:bg-[#070913]/60 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <span>© {new Date().getFullYear()} Sabbil Abdillah Ferdyansyah.</span>
            <span>•</span>
            <span className="text-violet-600 dark:text-violet-400">SMKN 1 Denpasar TKJ</span>
          </div>

          <div className="flex items-center gap-4">
            <Link to="/" className="hover:text-violet-500 transition-colors">
              Portal Utama
            </Link>
            <Link to="/notes" className="hover:text-violet-500 transition-colors">
              Technical Notes
            </Link>
            <Link to="/system" className="hover:text-violet-500 transition-colors">
              System Overview
            </Link>
            <Link to="/tools" className="hover:text-violet-500 transition-colors">
              Tools & Diag
            </Link>
            <Link to="/dashboard" className="hover:text-violet-500 transition-colors">
              Portfolio Dashboard
            </Link>
          </div>
        </div>
      </footer>

    </div>
  );
}

export default StandaloneModuleLayout;
