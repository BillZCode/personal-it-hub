import { useState, useEffect } from 'react';
import { useUIStore } from '../../store/ui';
import { useAuthStore } from '../../store/auth';
import { Menu, Sun, Moon, LogOut, ChevronDown, ChevronRight, ChevronLeft, HardDrive, Shield, Terminal, LayoutGrid, Bot, ExternalLink, Sparkles, Wrench } from 'lucide-react';
import { cn } from '../../utils';
import { Avatar } from '../ui/Avatar';
import { Link } from 'react-router-dom';

const ecosystemApps = [
  {
    title: 'DevKit CLI Studio',
    desc: 'Modular CLI & Developer Utilities Suite',
    icon: Wrench,
    subdomain: 'devkit.local',
    url: '/devkit/',
    internalPath: '/devkit',
    badge: 'DEV TOOL',
    accent: 'text-amber-400',
    border: 'border-amber-500/30',
    bg: 'bg-amber-500/10'
  },
  {
    title: 'CyberLab',
    desc: 'Offensive & Defensive CTF Toolkit',
    icon: Shield,
    subdomain: 'cybertool.sabbilferdyansyah.my.id',
    url: 'https://cybertool.sabbilferdyansyah.my.id',
    internalPath: '/cyberlab',
    badge: 'CTF LAB',
    accent: 'text-amber-400',
    border: 'border-amber-500/30',
    bg: 'bg-amber-500/10'
  },
  {
    title: 'Omni AI Studio',
    desc: 'Multimodal Gemma 4 & Flash 3 Agent',
    icon: Bot,
    subdomain: 'ai.sabbilferdyansyah.my.id',
    url: 'https://ai.sabbilferdyansyah.my.id',
    internalPath: '/ai',
    badge: 'AI CORE',
    accent: 'text-yellow-400',
    border: 'border-yellow-500/30',
    bg: 'bg-yellow-500/10'
  },
  {
    title: 'Private Cloud Drive',
    desc: 'Encrypted NextCloud & Media Storage',
    icon: HardDrive,
    subdomain: 'drive.sabbilferdyansyah.my.id',
    url: 'http://drive.sabbilferdyansyah.my.id',
    internalPath: '/drive',
    badge: 'CLOUD',
    accent: 'text-cyan-400',
    border: 'border-cyan-500/30',
    bg: 'bg-cyan-500/10'
  },
  {
    title: 'Linux Sysadmin Lab',
    desc: 'BIND9, Apache VHost & Kernel Benchmarks',
    icon: Terminal,
    subdomain: 'sabbilaf.network',
    url: 'http://sabbilaf.network',
    internalPath: '/server',
    badge: 'NETWORK',
    accent: 'text-amber-500',
    border: 'border-amber-500/30',
    bg: 'bg-amber-500/10'
  },
];

export function Header({ title }: { title: string }) {
  const { sidebarOpen, setSidebarOpen, sidebarCollapsed, toggleSidebarCollapse, theme, toggleTheme } = useUIStore();
  const { user, isAuthenticated, logout } = useAuthStore();
  const [profileOpen, setProfileOpen] = useState(false);
  const [appsOpen, setAppsOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setAppsOpen(false);
        setProfileOpen(false);
      }
    };
    if (appsOpen || profileOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [appsOpen, profileOpen]);

  return (
    <header className={cn(
      'fixed top-0 left-0 right-0 z-30 h-16 nav-glass-header border-none transition-all duration-300',
      !sidebarCollapsed ? 'lg:pl-80' : 'lg:pl-24'
    )}>
      <div className="flex h-full items-center justify-between px-4 sm:px-6 border-none">
        {/* Left: Toggles & Interactive Minimalist Breadcrumb */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 rounded-xl text-dark-400 hover:text-amber-400 hover:bg-white/[0.04] border border-transparent hover:border-white/[0.08] transition-all"
            aria-label={sidebarOpen ? 'Close menu' : 'Open menu'}
          >
            <Menu className="h-5 w-5" />
          </button>
          
          <button
            onClick={toggleSidebarCollapse}
            className="hidden lg:flex p-2 rounded-xl text-dark-400 hover:text-amber-400 hover:bg-white/[0.04] border border-white/[0.05] hover:border-amber-500/30 transition-all group"
            aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            title={sidebarCollapsed ? 'Expand sidebar (Ctrl+B)' : 'Collapse sidebar (Ctrl+B)'}
          >
            {sidebarCollapsed ? (
              <ChevronRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
            ) : (
              <ChevronLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
            )}
          </button>

          {/* Breadcrumb with radar ping and subtle glass pill styling */}
          <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-dark-900/60 border border-dark-700/60 dark:bg-white/[0.04] dark:border-white/[0.08] backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="nav-radar-ping absolute inline-flex h-full w-full rounded-full bg-amber-500 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
            </span>
            
            <div className="flex items-center gap-1.5 font-mono text-xs">
              <span className="text-dark-400 font-medium">sabbil.id</span>
              <span className="text-dark-500">/</span>
              <span
                role="status"
                aria-label={`Current page: ${title}`}
                className="font-bold tracking-tight truncate max-w-[160px] sm:max-w-xs text-dark-100"
              >
                {title}
              </span>
            </div>
          </div>
        </div>

        {/* Center / Right Status & Minimalist Futuristic Glass Controls */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Ecosystem Apps Launcher (Subdomains & Standalone Workstations) */}
          <div className="relative">
            <button
              onClick={() => { setAppsOpen(!appsOpen); setProfileOpen(false); }}
              aria-expanded={appsOpen}
              aria-haspopup="true"
              aria-controls="workstations-menu"
              className={cn(
                'flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all text-xs font-mono',
                appsOpen
                  ? 'bg-amber-500/15 border-amber-500/50 text-amber-600 dark:text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.25)]'
                  : 'bg-dark-900/60 border-dark-700/60 dark:bg-white/[0.04] dark:border-white/[0.08] text-dark-300 hover:text-dark-100 hover:border-amber-500/40 hover:bg-dark-800/80 dark:hover:bg-white/[0.08]'
              )}
              title="Sabbil Ecosystem & Subdomain Workstations"
              aria-label="Ecosystem Apps"
            >
              <LayoutGrid className="h-3.5 w-3.5 text-amber-500 dark:text-amber-400" />
              <span className="hidden md:inline font-semibold tracking-wide text-dark-200">Workstations</span>
              <span className="hidden sm:inline-block text-[9px] px-1.5 py-0.5 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/25">{ecosystemApps.length}</span>
              <ChevronDown className={cn('h-3 w-3 text-dark-400 transition-transform duration-200', appsOpen && 'rotate-180 text-amber-500')} />
            </button>

            {appsOpen && (
              <>
                <div
                  className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[1px]"
                  onClick={() => setAppsOpen(false)}
                  aria-hidden="true"
                />
                <div
                  id="workstations-menu"
                  role="menu"
                  aria-label="Workstations ecosystem menu"
                  className="absolute right-0 mt-2.5 w-80 sm:w-96 bg-card dark:bg-dark-950/95 backdrop-blur-2xl border border-dark-700/80 dark:border-white/[0.1] rounded-2xl shadow-2xl p-3.5 animate-in z-50"
                >
                <div className="flex items-center justify-between px-2 pb-2.5 mb-2.5 border-b border-dark-700/60 dark:border-white/[0.08]">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-3.5 w-3.5 text-amber-500 dark:text-amber-400" />
                    <span className="text-xs font-mono font-bold text-dark-100 tracking-wider">
                      STANDALONE WORKSTATIONS
                    </span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                    Live Nodes
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {ecosystemApps.map((app) => (
                    <div
                      key={app.title}
                      className="group p-3 rounded-xl bg-dark-800/40 dark:bg-white/[0.03] border border-dark-700/60 dark:border-white/[0.06] hover:border-amber-500/40 hover:bg-dark-800/80 dark:hover:bg-white/[0.06] transition-all flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-1 mb-1.5">
                          <div className={cn('p-1.5 rounded-lg border', app.bg, app.border)}>
                            <app.icon className={cn('h-3.5 w-3.5', app.accent)} />
                          </div>
                          <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-full bg-dark-800 text-dark-300 border border-dark-700">
                            {app.badge}
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-dark-100 group-hover:text-amber-500 dark:group-hover:text-amber-400 transition-colors">
                          {app.title}
                        </h4>
                        <p className="text-[10px] text-dark-400 line-clamp-2 mt-0.5 leading-snug">
                          {app.desc}
                        </p>
                      </div>

                      <div className="mt-3 pt-2 border-t border-dark-750/60 dark:border-white/[0.06] flex items-center justify-between gap-1">
                        <Link
                          to={app.internalPath}
                          onClick={() => setAppsOpen(false)}
                          className="text-[10px] font-mono font-semibold text-amber-600 dark:text-amber-400 hover:underline transition-colors"
                        >
                          Embed ↗
                        </Link>
                        <a
                          href={app.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[10px] font-mono text-dark-400 hover:text-amber-500 dark:hover:text-amber-400 transition-colors"
                          title={`Open ${app.subdomain}`}
                        >
                          <span className="truncate max-w-[85px]">{app.subdomain}</span>
                          <ExternalLink className="h-2.5 w-2.5 flex-shrink-0" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-2.5 pt-2 border-t border-dark-750/60 dark:border-white/[0.06] px-2 flex items-center justify-between text-[10px] font-mono text-dark-400">
                  <span>Domain: sabbilferdyansyah.my.id</span>
                  <span className="text-amber-600 dark:text-amber-400 font-semibold">Decoupled VHost</span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Live Node Telemetry Minimal Pill */}
        <div className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 dark:bg-white/[0.03] border border-amber-500/25 text-[11px] font-mono text-amber-700 dark:text-amber-400/90 shadow-sm backdrop-blur-md">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-500 dark:bg-amber-400 animate-pulse" />
          <span className="font-semibold tracking-wider">NODE-01 LIVE</span>
        </div>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl text-dark-400 hover:text-amber-500 dark:hover:text-amber-400 bg-white/80 dark:bg-white/[0.04] border border-dark-750/70 dark:border-white/[0.05] hover:border-amber-500/30 transition-all group shadow-sm dark:shadow-none"
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === 'dark' ? (
            <Sun className="h-4 w-4 group-hover:rotate-90 text-amber-400 transition-transform duration-300" />
          ) : (
            <Moon className="h-4 w-4 group-hover:-rotate-12 text-slate-700 dark:text-amber-400 transition-transform duration-300" />
          )}
        </button>

        {/* User Auth Info or Login Link */}
        {isAuthenticated && user ? (
          <div className="relative">
            <button
              onClick={() => { setProfileOpen(!profileOpen); setAppsOpen(false); }}
              aria-expanded={profileOpen}
              aria-haspopup="true"
              aria-controls="user-profile-menu"
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.08] hover:border-amber-500/40 text-dark-200 transition-all shadow-sm"
              aria-label="User menu"
            >
              <Avatar name={user.name} size="sm" src={undefined} />
              <span className="hidden md:block text-xs font-semibold font-mono text-white/90">{user.name}</span>
              <ChevronDown className="h-3 w-3 text-dark-500" />
            </button>
            
            {profileOpen && (
              <>
                <div
                  className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[1px]"
                  onClick={() => setProfileOpen(false)}
                  aria-hidden="true"
                />
                <div
                  id="user-profile-menu"
                  role="menu"
                  aria-label="User profile options"
                  className="absolute right-0 mt-2.5 w-56 bg-dark-950/90 backdrop-blur-2xl border border-white/[0.1] rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] py-2 animate-in z-50"
                >
                  <div className="px-4 py-2.5 border-b border-white/[0.06]">
                    <p className="text-xs font-bold text-white">{user.name}</p>
                    <p className="text-[11px] text-dark-400 font-mono truncate">{user.email}</p>
                    <span className="inline-block mt-1 text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/25">
                      {user.role}
                    </span>
                  </div>
                  
                  <Link
                    to="/admin"
                    onClick={() => setProfileOpen(false)}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-dark-300 hover:text-amber-300 hover:bg-white/[0.05] transition-colors"
                  >
                    <Shield className="h-3.5 w-3.5 text-amber-400" />
                    Admin Panel
                  </Link>

                  <Link
                    to="/drive"
                    onClick={() => setProfileOpen(false)}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-dark-300 hover:text-amber-300 hover:bg-white/[0.05] transition-colors"
                  >
                    <HardDrive className="h-3.5 w-3.5 text-amber-400" />
                    My Cloud Drive
                  </Link>
                  
                  <hr className="border-white/[0.06] my-1.5" />
                  
                  <button
                    onClick={() => { logout(); setProfileOpen(false); }}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    Sign Out
                  </button>
                </div>
              </>
            )}
          </div>
        ) : (
            <Link
              to="/admin/login"
              className="v7-btn-gold inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-mono font-bold text-dark-950 transition-all shadow-[0_0_15px_rgba(245,158,11,0.25)]"
            >
              <Shield className="h-3.5 w-3.5 text-dark-950" />
              <span>Login</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
