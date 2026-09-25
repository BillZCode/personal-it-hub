import { useState } from 'react';
import { useUIStore } from '../../store/ui';
import { useAuthStore } from '../../store/auth';
import { Menu, Sun, Moon, LogOut, ChevronDown, ChevronRight, ChevronLeft, HardDrive, Shield, Terminal } from 'lucide-react';
import { cn } from '../../utils';
import { Avatar } from '../ui/Avatar';
import { Link } from 'react-router-dom';

export function Header({ title }: { title: string }) {
  const { sidebarOpen, setSidebarOpen, sidebarCollapsed, toggleSidebarCollapse, theme, toggleTheme } = useUIStore();
  const { user, isAuthenticated, logout } = useAuthStore();
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <header className={cn(
      'fixed top-0 left-0 right-0 z-30 h-16 bg-dark-950/80 backdrop-blur-2xl border-b border-dark-700/80 transition-all duration-300 shadow-sm',
      !sidebarCollapsed ? 'lg:pl-64' : 'lg:pl-16'
    )}>
      <div className="flex h-full items-center justify-between px-4 sm:px-6">
        {/* Left: Toggles & Interactive Cyber Breadcrumb */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 rounded-xl text-dark-400 hover:text-primary-400 hover:bg-dark-800/80 border border-transparent hover:border-dark-700 transition-all"
            aria-label={sidebarOpen ? 'Close menu' : 'Open menu'}
          >
            <Menu className="h-5 w-5" />
          </button>
          
          <button
            onClick={toggleSidebarCollapse}
            className="hidden lg:flex p-2 rounded-xl text-dark-400 hover:text-primary-400 hover:bg-dark-800/80 border border-transparent hover:border-dark-700/70 transition-all group"
            aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            title={sidebarCollapsed ? 'Expand sidebar (Ctrl+B)' : 'Collapse sidebar (Ctrl+B)'}
          >
            {sidebarCollapsed ? (
              <ChevronRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
            ) : (
              <ChevronLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
            )}
          </button>

          {/* Breadcrumb with radar ping and gradient text */}
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2.5 w-2.5">
              <span className="nav-radar-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400" />
            </span>
            
            <div className="flex items-center gap-1.5 font-mono">
              <span className="hidden sm:inline text-xs text-dark-500 hover:text-dark-400 transition-colors">
                sabbil@hub:~#
              </span>
              <span className="text-dark-600 text-xs hidden sm:inline">/</span>
              <h1 className="text-sm sm:text-base font-bold tracking-tight truncate max-w-[200px] sm:max-w-xs lg:max-w-md bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 dark:from-emerald-400 dark:via-teal-300 dark:to-cyan-400 bg-clip-text text-transparent">
                {title}
              </h1>
            </div>
          </div>
        </div>

        {/* Center / Right Status & Controls */}
        <div className="flex items-center gap-3">
          {/* Live Node Telemetry Pill */}
          <div className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-dark-900/90 border border-emerald-500/30 text-[11px] font-mono text-emerald-700 dark:text-emerald-300 shadow-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-semibold tracking-wider">NODE-01 READY</span>
          </div>

          {/* Cloud Drive Shortcut Button (Visible when logged in) */}
          {isAuthenticated && (
            <Link
              to="/drive"
              className="hidden sm:inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-dark-900/90 hover:bg-dark-800/90 border border-dark-700/80 hover:border-cyan-500/40 text-xs font-mono text-dark-300 hover:text-cyan-300 transition-all shadow-sm group relative overflow-hidden"
            >
              <HardDrive className="h-3.5 w-3.5 text-cyan-400 group-hover:scale-110 transition-transform" />
              <span>Private Drive</span>
              <span className="absolute bottom-0 left-0 h-[1.5px] w-0 bg-gradient-to-r from-transparent via-cyan-400 to-transparent group-hover:w-full transition-all duration-300" />
            </Link>
          )}

          {/* Theme Toggle Button with smooth rotation */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-dark-400 hover:text-amber-400 hover:bg-dark-800/80 border border-transparent hover:border-dark-700/70 transition-all group relative"
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? (
              <Sun className="h-4 w-4 group-hover:rotate-90 text-amber-400 transition-transform duration-300" />
            ) : (
              <Moon className="h-4 w-4 group-hover:-rotate-12 text-cyan-400 transition-transform duration-300" />
            )}
          </button>

          {/* User Auth Info or Login Link */}
          {isAuthenticated && user ? (
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-dark-900/90 border border-dark-700 hover:border-emerald-500/40 text-dark-200 transition-all shadow-sm"
                aria-label="User menu"
              >
                <Avatar name={user.name} size="sm" src={undefined} />
                <span className="hidden md:block text-xs font-semibold font-mono text-dark-200">{user.name}</span>
                <ChevronDown className="h-3.5 w-3.5 text-dark-500" />
              </button>
              
              {profileOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-dark-900/95 backdrop-blur-2xl border border-dark-700/80 rounded-2xl shadow-2xl py-2 animate-in z-50">
                  <div className="px-4 py-2.5 border-b border-dark-700/60">
                    <p className="text-xs font-bold text-dark-100">{user.name}</p>
                    <p className="text-[11px] text-dark-400 font-mono truncate">{user.email}</p>
                    <span className="inline-block mt-1 text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/25">
                      {user.role}
                    </span>
                  </div>
                  
                  <Link
                    to="/admin"
                    onClick={() => setProfileOpen(false)}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-dark-300 hover:text-emerald-300 hover:bg-dark-800/80 transition-colors"
                  >
                    <Shield className="h-3.5 w-3.5 text-emerald-400" />
                    Admin Panel
                  </Link>

                  <Link
                    to="/drive"
                    onClick={() => setProfileOpen(false)}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-dark-300 hover:text-cyan-300 hover:bg-dark-800/80 transition-colors"
                  >
                    <HardDrive className="h-3.5 w-3.5 text-cyan-400" />
                    My Cloud Drive
                  </Link>
                  
                  <hr className="border-dark-700/60 my-1.5" />
                  
                  <button
                    onClick={() => { logout(); setProfileOpen(false); }}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/admin/login"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-primary-500/15 hover:bg-primary-500/25 border border-primary-500/30 text-xs font-mono font-semibold text-primary-400 transition-all shadow-[0_0_12px_rgba(34,197,94,0.2)] hover:shadow-[0_0_20px_rgba(34,197,94,0.35)]"
            >
              <Shield className="h-3.5 w-3.5" />
              <span>Login</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
