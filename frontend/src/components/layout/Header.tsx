import { useState, useEffect } from 'react';
import { useUIStore } from '../../store/ui';
import { useAuthStore } from '../../store/auth';
import {
  ArrowLeft,
  Menu,
  Sun,
  Moon,
  LogOut,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  HardDrive,
  Shield,
  Terminal,
  LayoutGrid,
  Bot,
  ExternalLink,
  Sparkles,
  Wrench,
  Globe,
  Languages,
} from 'lucide-react';
import { cn } from '../../utils';
import { Avatar } from '../ui/Avatar';
import { Link, useLocation } from 'react-router-dom';

const ecosystemApps = [
  {
    title: 'DevKit CLI Studio',
    desc: 'Modular CLI & Developer Utilities Suite',
    icon: Wrench,
    subdomain: 'devkit.local',
    url: '/devkit/',
    internalPath: '/devkit',
    accent: 'text-[#F7C95C]',
    border: 'border-[#F7C95C]/40',
    bg: 'bg-[#F7C95C]/15',
  },
  {
    title: 'CyberLab',
    desc: 'Offensive & Defensive CTF Toolkit',
    icon: Shield,
    subdomain: 'cybertool.sabbilferdyansyah.my.id',
    url: 'https://cybertool.sabbilferdyansyah.my.id',
    internalPath: '/cyberlab',
    accent: 'text-[#F26676]',
    border: 'border-[#F26676]/40',
    bg: 'bg-[#F26676]/15',
  },
  {
    title: 'Omni AI Studio',
    desc: 'Multimodal Gemma 4 & Flash 3 Agent',
    icon: Bot,
    subdomain: 'ai.sabbilferdyansyah.my.id',
    url: 'https://ai.sabbilferdyansyah.my.id',
    internalPath: '/ai',
    accent: 'text-[#5B8DEF]',
    border: 'border-[#5B8DEF]/40',
    bg: 'bg-[#5B8DEF]/15',
  },
  {
    title: 'Transkrip & Terjemahan AI',
    desc: 'Transkrip & terjemahan video YouTube/Media multi-bahasa',
    icon: Languages,
    subdomain: 'transkrip.sabbilferdyansyah.my.id',
    url: 'https://transkrip.sabbilferdyansyah.my.id',
    internalPath: '/transkrip',
    accent: 'text-[#4ED69E]',
    border: 'border-[#4ED69E]/40',
    bg: 'bg-[#4ED69E]/15',
  },
  {
    title: 'Private Cloud Drive',
    desc: 'Encrypted NextCloud & Media Storage',
    icon: HardDrive,
    subdomain: 'drive.sabbilferdyansyah.my.id',
    url: 'http://drive.sabbilferdyansyah.my.id',
    internalPath: '/drive',
    accent: 'text-[#4ED69E]',
    border: 'border-[#4ED69E]/40',
    bg: 'bg-[#4ED69E]/15',
  },
  {
    title: 'Linux Sysadmin Lab',
    desc: 'BIND9, Apache VHost & Kernel Benchmarks',
    icon: Terminal,
    subdomain: 'sabbilaf.network',
    url: 'http://sabbilaf.network',
    internalPath: '/server',
    accent: 'text-[#5B8DEF]',
    border: 'border-[#5B8DEF]/40',
    bg: 'bg-[#5B8DEF]/15',
  },
];

export function Header({ title, showSidebar = true }: { title: string; showSidebar?: boolean }) {
  const {
    sidebarOpen,
    setSidebarOpen,
    sidebarCollapsed,
    toggleSidebarCollapse,
    theme,
    toggleTheme,
  } = useUIStore();
  const { user, isAuthenticated, logout } = useAuthStore();
  const [profileOpen, setProfileOpen] = useState(false);
  const [appsOpen, setAppsOpen] = useState(false);
  const location = useLocation();

  const isAdminRoute = location.pathname.startsWith('/admin');

  const getPublicReviewPath = (path: string) => {
    if (path.startsWith('/admin/guestbook')) return '/guestbook';
    if (path.startsWith('/admin/projects')) return '/projects';
    if (path.startsWith('/admin/notes')) return '/notes';
    if (path.startsWith('/admin/certificates')) return '/certificates';
    if (path.startsWith('/admin/gallery')) return '/gallery';
    if (path.startsWith('/admin/changelog')) return '/changelog';
    return '/';
  };

  const publicReviewPath = getPublicReviewPath(location.pathname);

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
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-30 h-16 bg-[#080A10]/85 backdrop-blur-xl border-b border-white/[0.06] transition-all duration-300',
        showSidebar && (!sidebarCollapsed ? 'lg:pl-80' : 'lg:pl-24')
      )}
    >
      <div className="flex h-full items-center justify-between px-4 sm:px-6">
        {/* Left: Navigation/Sidebar Controls & Mega Project Nocturne Breadcrumb Pill */}
        <div className="flex items-center gap-3">
          {showSidebar ? (
            <>
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 rounded-full text-[#8E9AB5] hover:text-[#F4F3F8] bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 transition-all"
                aria-label={sidebarOpen ? 'Close menu' : 'Open menu'}
              >
                <Menu className="h-4 w-4" />
              </button>

              <button
                onClick={toggleSidebarCollapse}
                className="hidden lg:flex p-2 rounded-full text-[#8E9AB5] hover:text-[#F4F3F8] bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 transition-all group"
                aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                title={sidebarCollapsed ? 'Expand sidebar (Ctrl+B)' : 'Collapse sidebar (Ctrl+B)'}
              >
                {sidebarCollapsed ? (
                  <ChevronRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                ) : (
                  <ChevronLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
                )}
              </button>
            </>
          ) : (
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-full bg-[#F4F3F8] hover:bg-white text-[#080A10] text-xs font-sans font-semibold transition-all shadow-glowPill group"
              title="Kembali ke Portal Utama sabbilferdyansyah.my.id"
            >
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
              <span className="hidden sm:inline">Kembali ke Portal</span>
              <span className="sm:hidden">Portal</span>
            </Link>
          )}

          {/* Nocturne Breadcrumb Pill */}
          <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#0D101A] border border-white/[0.08]">
            <span className="relative flex h-2 w-2">
              <span className="nav-radar-ping absolute inline-flex h-full w-full rounded-full bg-[#4ED69E] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#4ED69E]" />
            </span>

            <div className="flex items-center gap-1.5 font-mono text-xs">
              <span className="text-[#8E9AB5] font-medium">sabbil.id</span>
              <span className="text-[#5E687E]">/</span>
              <span
                role="status"
                aria-label={`Current page: ${title}`}
                className="font-semibold tracking-tight truncate max-w-[160px] sm:max-w-xs text-[#F4F3F8]"
              >
                {title}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Workstations Launcher, Telemetry Pill, Theme & Auth */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {isAdminRoute ? (
            <Link
              to={publicReviewPath}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border transition-all text-xs font-mono font-medium bg-[#4ED69E]/15 hover:bg-[#4ED69E]/25 border-[#4ED69E]/40 text-[#4ED69E] group"
              title={`Buka Halaman Pengguna (${publicReviewPath}) untuk review langsung`}
              aria-label="Masuk ke Halaman Pengguna"
            >
              <Globe className="h-3.5 w-3.5 text-[#4ED69E] group-hover:scale-110 transition-transform" />
              <span className="hidden sm:inline font-semibold">Halaman Pengguna</span>
              <ExternalLink className="h-3 w-3 opacity-60 group-hover:opacity-100 transition-opacity" />
            </Link>
          ) : isAuthenticated && user?.role === 'admin' ? (
            <Link
              to="/admin"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border transition-all text-xs font-mono font-medium bg-[#F7C95C]/15 hover:bg-[#F7C95C]/25 border-[#F7C95C]/40 text-[#F7C95C] group"
              title="Masuk ke Admin Panel"
              aria-label="Admin Panel"
            >
              <Shield className="h-3.5 w-3.5 text-[#F7C95C] group-hover:scale-110 transition-transform" />
              <span className="hidden sm:inline font-semibold">Admin Panel</span>
            </Link>
          ) : null}

          {/* Ecosystem Apps Launcher */}
          <div className="relative">
            <button
              onClick={() => {
                setAppsOpen(!appsOpen);
                setProfileOpen(false);
              }}
              aria-expanded={appsOpen}
              aria-haspopup="true"
              aria-controls="workstations-menu"
              className={cn(
                'flex items-center gap-2 px-3.5 py-1.5 rounded-full border transition-all text-xs font-mono',
                appsOpen
                  ? 'bg-[#5B8DEF]/15 border-[#5B8DEF]/50 text-[#5B8DEF]'
                  : 'bg-[#0D101A] border-white/[0.08] text-[#A3ADC4] hover:text-[#F4F3F8] hover:border-white/20'
              )}
              title="Sabbil Ecosystem & Subdomain Workstations"
              aria-label="Ecosystem Apps"
            >
              <LayoutGrid className="h-3.5 w-3.5 text-[#5B8DEF]" />
              <span className="hidden md:inline font-semibold tracking-wide text-[#F4F3F8]">
                Workstations
              </span>
              <span className="hidden sm:inline-block text-[9px] px-1.5 py-0.5 rounded-full bg-[#5B8DEF]/15 text-[#5B8DEF] border border-[#5B8DEF]/40">
                {ecosystemApps.length}
              </span>
              <ChevronDown
                className={cn(
                  'h-3 w-3 text-[#8E9AB5] transition-transform duration-200',
                  appsOpen && 'rotate-180 text-[#5B8DEF]'
                )}
              />
            </button>

            {appsOpen && (
              <>
                <div
                  className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[1px]"
                  onClick={() => setAppsOpen(false)}
                  aria-hidden="true"
                />
                <div
                  id="workstations-menu"
                  role="menu"
                  aria-label="Workstations ecosystem menu"
                  className="absolute right-0 mt-2.5 w-80 sm:w-96 bg-[#0D101A] border border-white/15 rounded-2xl shadow-2xl p-4 animate-in z-50"
                >
                  <div className="flex items-center justify-between px-1 pb-2.5 mb-3 border-b border-white/[0.06]">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-3.5 w-3.5 text-[#D2D8F0]" />
                      <span className="text-xs font-mono font-bold text-[#F4F3F8] tracking-wide">
                        ECOSYSTEM WORKSTATIONS
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-[#4ED69E] px-2 py-0.5 rounded-full bg-[#4ED69E]/15 border border-[#4ED69E]/40">
                      {ecosystemApps.length} Active
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {ecosystemApps.map((app) => {
                      const Icon = app.icon;
                      return (
                        <div
                          key={app.title}
                          className="group p-3 rounded-xl bg-[#080A10] border border-white/[0.08] hover:border-white/25 transition-all flex flex-col justify-between"
                        >
                          <div>
                            <div className="flex items-center justify-between gap-2 mb-2">
                              <div
                                className={cn(
                                  'p-1.5 rounded-lg border',
                                  app.bg,
                                  app.border,
                                  app.accent
                                )}
                              >
                                <Icon className="h-3.5 w-3.5" />
                              </div>
                            </div>
                            <h4 className="text-xs font-display font-medium text-[#F4F3F8]">
                              {app.title}
                            </h4>
                            <p className="text-[10px] text-[#8E9AB5] line-clamp-2 mt-0.5 leading-snug">
                              {app.desc}
                            </p>
                          </div>

                          <div className="mt-3 pt-2 border-t border-white/[0.06] flex items-center justify-between gap-1">
                            <Link
                              to={app.internalPath}
                              onClick={() => setAppsOpen(false)}
                              className="text-[10px] font-mono font-semibold text-[#5B8DEF] hover:underline transition-colors"
                            >
                              Embed ↗
                            </Link>
                            <a
                              href={app.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-[10px] font-mono text-[#8E9AB5] hover:text-[#F4F3F8] transition-colors"
                              title={`Open ${app.subdomain}`}
                            >
                              <span className="truncate max-w-[85px]">{app.subdomain}</span>
                              <ExternalLink className="h-2.5 w-2.5 flex-shrink-0" />
                            </a>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-white/[0.06] px-1 flex items-center justify-between text-[10px] font-mono text-[#8E9AB5]">
                    <span>Domain: sabbilferdyansyah.my.id</span>
                    <span className="text-[#4ED69E] font-semibold">Decoupled VHost</span>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="w-9 h-9 rounded-full text-[#D2D8F0] hover:text-white bg-white/[0.06] border border-white/15 hover:bg-white/[0.12] transition-all flex items-center justify-center group"
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? (
              <Sun className="h-4 w-4 text-[#F7C95C]" />
            ) : (
              <Moon className="h-4 w-4 text-[#5B8DEF]" />
            )}
          </button>

          {/* User Auth Info or Luminous White Login Pill */}
          {isAuthenticated && user ? (
            <div className="relative">
              <button
                onClick={() => {
                  setProfileOpen(!profileOpen);
                  setAppsOpen(false);
                }}
                aria-expanded={profileOpen}
                aria-haspopup="true"
                aria-controls="user-profile-menu"
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0D101A] border border-white/15 hover:border-white/30 text-[#F4F3F8] transition-all"
                aria-label="User menu"
              >
                <Avatar name={user.name} size="sm" src={undefined} />
                <span className="hidden md:block text-xs font-semibold font-mono text-[#F4F3F8]">
                  {user.name}
                </span>
                <ChevronDown className="h-3 w-3 text-[#8E9AB5]" />
              </button>

              {profileOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[1px]"
                    onClick={() => setProfileOpen(false)}
                    aria-hidden="true"
                  />
                  <div
                    id="user-profile-menu"
                    role="menu"
                    aria-label="User profile options"
                    className="absolute right-0 mt-2.5 w-56 bg-[#0D101A] border border-white/15 rounded-2xl shadow-2xl py-2 animate-in z-50"
                  >
                    <div className="px-4 py-2.5 border-b border-white/[0.06]">
                      <p className="text-xs font-bold text-[#F4F3F8]">{user.name}</p>
                      <p className="text-[11px] text-[#8E9AB5] font-mono truncate">{user.email}</p>
                      <span className="inline-block mt-1 text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-[#5B8DEF]/15 text-[#5B8DEF] border border-[#5B8DEF]/40">
                        {user.role}
                      </span>
                    </div>

                    <Link
                      to={publicReviewPath}
                      onClick={() => setProfileOpen(false)}
                      className="w-full flex items-center justify-between px-4 py-2 text-xs text-[#4ED69E] hover:bg-[#4ED69E]/10 transition-colors group"
                    >
                      <div className="flex items-center gap-2.5">
                        <Globe className="h-3.5 w-3.5 text-[#4ED69E]" />
                        <span>Halaman Pengguna</span>
                      </div>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-[#4ED69E]/15 text-[#4ED69E] border border-[#4ED69E]/40">
                        Live
                      </span>
                    </Link>

                    <Link
                      to="/admin"
                      onClick={() => setProfileOpen(false)}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-[#D2D8F0] hover:text-white hover:bg-white/[0.05] transition-colors"
                    >
                      <Shield className="h-3.5 w-3.5 text-[#F7C95C]" />
                      Admin Panel
                    </Link>

                    <Link
                      to="/drive"
                      onClick={() => setProfileOpen(false)}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-[#D2D8F0] hover:text-white hover:bg-white/[0.05] transition-colors"
                    >
                      <HardDrive className="h-3.5 w-3.5 text-[#5B8DEF]" />
                      My Cloud Drive
                    </Link>

                    <hr className="border-white/[0.06] my-1.5" />

                    <button
                      onClick={() => {
                        logout();
                        setProfileOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-[#F26676] hover:bg-[#F26676]/10 transition-colors"
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
              className="h-9 px-4 rounded-full bg-[#F4F3F8] hover:bg-white text-[#080A10] inline-flex items-center gap-1.5 text-xs font-sans font-semibold transition-all shadow-glowPill"
            >
              <Shield className="h-3.5 w-3.5 text-[#080A10]" />
              <span>Login</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
