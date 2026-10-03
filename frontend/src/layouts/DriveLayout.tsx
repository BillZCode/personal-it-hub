import { Outlet, Navigate, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { driveApi, authApi } from '../services/api';
import { useAuthStore } from '../store/auth';
import { useUIStore } from '../store/ui';
import { cn, formatBytes } from '../utils';
import {
  HardDrive,
  Folder,
  Trash2,
  LogOut,
  ExternalLink,
  Menu,
  X,
  Database,
  Lock,
  Sun,
  Moon
} from 'lucide-react';
import { Button } from '../components/ui';
import { useToast } from '../hooks';

export function DriveLayout() {
  const { isAuthenticated, user, logout } = useAuthStore();
  const { sidebarOpen, setSidebarOpen, theme, toggleTheme } = useUIStore();
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  // Storage metrics query
  const { data: storageStats } = useQuery({
    queryKey: ['drive', 'storage'],
    queryFn: driveApi.getStorageStats,
    enabled: isAuthenticated,
    refetchInterval: 30000,
  });

  const logoutMutation = useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      logout();
      queryClient.clear();
      showToast('Sesi ditutup dengan aman', 'info');
      navigate('/drive/login', { replace: true });
    },
    onError: () => {
      logout();
      navigate('/drive/login', { replace: true });
    },
  });

  // Strict route protection: jika belum login, langsung redirect ke /drive/login
  if (!isAuthenticated) {
    return <Navigate to="/drive/login" state={{ from: location }} replace />;
  }

  const usagePercent = Math.min(100, Math.max(0, storageStats?.percentageUsed || 0));
  const progressColor =
    usagePercent > 85
      ? 'bg-rose-500 shadow-rose-500/50'
      : usagePercent > 70
      ? 'bg-amber-500 shadow-amber-500/50'
      : 'bg-primary-500 shadow-primary-500/50';

  return (
    <div className="min-h-screen bg-dark-950 text-dark-100 flex flex-col font-sans selection:bg-primary-500/30 selection:text-primary-200">
      {/* Mobile Drawer Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/75 backdrop-blur-sm lg:hidden animate-in fade-in duration-200"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Cloud Drive Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 z-40 h-screen bg-dark-900/95 backdrop-blur-xl border-r border-dark-800 transition-all duration-300 flex flex-col',
          'w-64',
          sidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'
        )}
        aria-label="Sidebar Navigasi Drive"
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-dark-800/80">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-primary-500/20 border border-primary-500/40 rounded-xl shadow-sm">
              <HardDrive className="h-5 w-5 text-primary-400" />
            </div>
            <div>
              <span className="font-bold tracking-tight text-dark-100 text-sm">
                SECURE DRIVE
              </span>
              <span className="block text-[10px] font-mono text-emerald-400 font-semibold tracking-wider">
                PRIVATE NODE
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1.5 rounded-lg text-dark-400 hover:text-dark-100 hover:bg-dark-800 transition-colors"
            aria-label="Tutup navigasi menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav aria-label="Menu Utama Drive" className="flex-1 overflow-y-auto p-3 space-y-1">
          <NavLink
            to="/drive"
            end
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all outline-none focus-visible:ring-1 focus-visible:ring-primary-500',
                isActive
                  ? 'bg-primary-500/15 text-primary-400 border border-primary-500/30 shadow-sm'
                  : 'text-dark-300 hover:text-dark-100 hover:bg-dark-800/80'
              )
            }
          >
            <Folder className="h-4 w-4" />
            <span>My Drive</span>
          </NavLink>

          <NavLink
            to="/drive/trash"
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all outline-none focus-visible:ring-1 focus-visible:ring-primary-500',
                isActive
                  ? 'bg-primary-500/15 text-primary-400 border border-primary-500/30 shadow-sm'
                  : 'text-dark-300 hover:text-dark-100 hover:bg-dark-800/80'
              )
            }
          >
            <Trash2 className="h-4 w-4" />
            <span>Tempat Sampah</span>
          </NavLink>

          {/* Return to Public Website */}
          <div className="pt-4 mt-4 border-t border-dark-800/80">
            <span className="px-3 text-[10px] font-mono font-medium text-dark-500 uppercase tracking-wider">
              Navigation
            </span>
            <NavLink
              to="/"
              className="flex items-center gap-3 px-3 py-2 mt-1 rounded-xl text-sm font-medium text-dark-400 hover:text-primary-400 hover:bg-dark-800/80 transition-colors outline-none focus-visible:ring-1 focus-visible:ring-primary-500"
            >
              <ExternalLink className="h-4 w-4" />
              <span>Public Website</span>
            </NavLink>
          </div>
        </nav>

        {/* Storage Meter Widget (Double-Bezel Design) */}
        <div className="p-3 border-t border-dark-800/80 bg-dark-950/60">
          <div className="p-1 rounded-xl bg-gradient-to-b from-white/5 to-transparent border border-white/5">
            <div className="rounded-lg bg-dark-900/90 p-3 space-y-2 border border-dark-800 shadow-inner">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-dark-300 flex items-center gap-1.5">
                  <Database className="h-3.5 w-3.5 text-primary-400" />
                  Penyimpanan
                </span>
                <span className="font-mono text-dark-300 font-semibold text-[11px]">
                  {formatBytes(storageStats?.usedBytes || 0)}
                </span>
              </div>

              <div
                role="progressbar"
                aria-label="Kapasitas Penyimpanan Cloud"
                aria-valuenow={Math.round(usagePercent)}
                aria-valuemin={0}
                aria-valuemax={100}
                className="w-full bg-dark-800 h-2 rounded-full overflow-hidden"
              >
                <div
                  className={`h-full rounded-full transition-all duration-500 shadow-sm ${progressColor}`}
                  style={{ width: `${Math.max(2, usagePercent)}%` }}
                />
              </div>

              <div className="flex justify-between text-[10px] text-dark-400 font-mono">
                <span>{storageStats?.fileCount || 0} berkas</span>
                <span>{usagePercent.toFixed(1)}% terpakai</span>
              </div>
            </div>
          </div>
        </div>

        {/* User Profile & Logout */}
        <div className="p-3 border-t border-dark-800/80 flex items-center justify-between bg-dark-900">
          <div className="min-w-0 flex-1 mr-2">
            <p className="text-xs font-semibold text-dark-200 truncate">
              {user?.name || 'Administrator'}
            </p>
            <p className="text-[11px] text-dark-500 truncate font-mono">
              {user?.email || 'admin@example.com'}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => logoutMutation.mutate()}
            className="text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 p-2"
            title="Keluar / Logout Session"
            aria-label="Keluar dari akun"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:pl-64">
        {/* Top Navbar */}
        <header className="sticky top-0 z-20 h-16 bg-dark-950/80 backdrop-blur-xl border-b border-dark-800/80 flex items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl text-dark-400 hover:text-dark-100 hover:bg-dark-800 transition-colors"
              aria-label="Buka navigasi menu"
              aria-expanded={sidebarOpen}
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
                <Lock className="h-3 w-3" />
                <span>Private Node Secure</span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2 rounded-xl text-dark-400 hover:text-dark-100 hover:bg-dark-800 transition-colors outline-none focus-visible:ring-1 focus-visible:ring-primary-500"
              aria-label="Toggle Mode Tampilan Gelap/Terang"
              title="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => logoutMutation.mutate()}
              className="text-xs border-rose-500/30 text-rose-400 hover:bg-rose-500/10 shadow-sm"
              leftIcon={<LogOut className="h-3.5 w-3.5" />}
              aria-label="Logout"
            >
              Logout
            </Button>
          </div>
        </header>

        {/* Route Pages Body (Only 1 <main> element in the page for WCAG compliance) */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default DriveLayout;
