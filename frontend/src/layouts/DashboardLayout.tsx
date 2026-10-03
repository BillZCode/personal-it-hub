import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from '../components/layout/Sidebar';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { cn } from '../utils';
import { useAuthStore } from '../store/auth';
import { useUIStore } from '../store/ui';

export function DashboardLayout() {
  const { isAuthenticated } = useAuthStore();
  const { sidebarCollapsed } = useUIStore();
  const location = useLocation();

  // Dynamic route to page title
  const getPageTitle = (pathname: string) => {
    if (pathname === '/') return 'Dashboard';
    const segment = pathname.split('/')[1];
    if (segment === 'ai' || segment === 'chatbot') return 'Omni AI Assistant';
    if (segment === 'cyberlab') return 'CyberLab Workstation';
    return segment
      ? segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ')
      : 'Dashboard';
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0a0d14] text-slate-900 dark:text-slate-100 flex flex-col relative overflow-hidden selection:bg-cyan-500/25 selection:text-cyan-900 dark:selection:text-cyan-200 font-sans transition-colors duration-300">
      {/* Skip to Main Content Link for A11y / Keyboard Users */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-emerald-500 focus:text-slate-950 focus:font-bold focus:rounded-xl focus:shadow-2xl focus:outline-none focus:ring-2 focus:ring-emerald-400 font-mono text-xs transition-all"
      >
        Skip to main content
      </a>

      {/* 1. Subtle Cyber Engineering Grid Matrix */}
      <div 
        className="fixed inset-0 pointer-events-none bg-[linear-gradient(to_right,rgba(0,0,0,0.025)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.025)_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_75%_55%_at_50%_0%,#000_65%,transparent_100%)] opacity-80" 
        aria-hidden="true"
      />

      {/* 2. Calibrated Cyber Neon Glows (Deep Obsidian Ambient Depth in Dark Mode, subtle aura in Light Mode) */}
      <div 
        className="fixed -top-48 left-1/2 -translate-x-1/2 w-[800px] h-[450px] bg-cyan-500/[0.03] dark:bg-cyan-500/[0.06] rounded-full blur-[160px] pointer-events-none" 
        aria-hidden="true"
      />
      <div 
        className="fixed top-1/4 -right-24 w-[500px] h-[500px] bg-emerald-500/[0.02] dark:bg-emerald-500/[0.035] rounded-full blur-[170px] pointer-events-none" 
        aria-hidden="true"
      />
      <div 
        className="fixed -bottom-24 -left-24 w-[550px] h-[550px] bg-amber-500/[0.02] dark:bg-amber-500/[0.03] rounded-full blur-[180px] pointer-events-none" 
        aria-hidden="true"
      />

      {/* 3. Subtle Edge Vignette (Dark Mode only to preserve clean light mode canvas) */}
      <div 
        className="fixed inset-0 pointer-events-none hidden dark:block bg-[radial-gradient(ellipse_at_center,transparent_45%,#0a0d14_96%)]" 
        aria-hidden="true"
      />

      {/* 4. Lateral Ambient Glow Wings (Eliminates empty edge feeling on wide screens) */}
      <div 
        className="fixed top-24 left-0 w-96 h-[800px] bg-gradient-to-r from-cyan-500/[0.04] dark:from-cyan-500/[0.06] to-transparent pointer-events-none blur-3xl hidden xl:block"
        aria-hidden="true"
      />
      <div 
        className="fixed top-24 right-0 w-96 h-[800px] bg-gradient-to-l from-amber-500/[0.035] dark:from-amber-500/[0.055] to-transparent pointer-events-none blur-3xl hidden xl:block"
        aria-hidden="true"
      />

      {/* 5. Architectural Viewport Margin Rails (Eliminates empty edge void on wide monitors) */}
      <div 
        className="fixed top-32 bottom-20 right-3 2xl:right-6 w-px bg-gradient-to-b from-slate-200/80 via-slate-300/40 to-transparent dark:from-white/10 dark:via-white/5 dark:to-transparent pointer-events-none hidden 2xl:flex flex-col justify-between py-8 text-[9px] font-mono text-slate-400/80 dark:text-slate-500/80 items-end select-none"
        aria-hidden="true"
      >
        <span className="-rotate-90 origin-right -translate-y-8 tracking-widest uppercase">TLS 1.3 CERT +</span>
        <span className="-rotate-90 origin-right -translate-y-8 tracking-widest uppercase">18ms EDGE ROUTE +</span>
        <span className="-rotate-90 origin-right -translate-y-8 tracking-widest uppercase">UPTIME 99.98% +</span>
      </div>

      {/* Navigation Sidebar */}
      <Sidebar isAdmin={isAuthenticated} />
      
      {/* Main Content Viewport */}
      <div className={cn(
        'flex-1 flex flex-col transition-all duration-300 relative z-10',
        !sidebarCollapsed ? 'lg:pl-80' : 'lg:pl-24'
      )}>
        <Header title={getPageTitle(location.pathname)} />
        <main
          id="main-content"
          className={cn(
            "flex-1 w-full transition-all duration-300",
            (location.pathname === '/cyberlab' || location.pathname === '/ai' || location.pathname === '/chatbot')
              ? "pt-24 px-4 sm:px-8 pb-8 max-w-full"
              : "pt-24 pb-20 px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1620px] mx-auto"
          )}
        >
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
}

export default DashboardLayout;