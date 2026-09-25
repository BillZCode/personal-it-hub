import { Outlet, Navigate, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { driveApi, authApi } from '../services/api';
import { useAuthStore } from '../store/auth';
import { useUIStore } from '../store/ui';
import { cn } from '../utils';
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

  const formatBytes = (bytes: number) => {
    if (!bytes || bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen bg-dark-950 text-dark-100 flex flex-col">
      {/* Mobile Drawer Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Cloud Drive Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 z-40 h-screen bg-dark-900/95 backdrop-blur-xl border-r border-dark-800 transition-all duration-300 flex flex-col',
          'w-64',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-dark-800">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-primary-500/20 border border-primary-500/40 rounded-lg">
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
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1.5 rounded-lg text-dark-400 hover:text-dark-100 hover:bg-dark-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          <NavLink
            to="/drive"
            end
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary-500/15 text-primary-400 border border-primary-500/30'
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
                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary-500/15 text-primary-400 border border-primary-500/30'
                  : 'text-dark-300 hover:text-dark-100 hover:bg-dark-800/80'
              )
            }
          >
            <Trash2 className="h-4 w-4" />
            <span>Trash / Sampah</span>
          </NavLink>

          {/* Return to Public Website */}
          <div className="pt-4 mt-4 border-t border-dark-800">
            <span className="px-3 text-[11px] font-medium text-dark-500 uppercase tracking-wider">
              Navigation
            </span>
            <NavLink
              to="/"
              className="flex items-center gap-3 px-3 py-2 mt-1 rounded-lg text-sm font-medium text-dark-400 hover:text-primary-400 hover:bg-dark-800/80 transition-colors"
            >
              <ExternalLink className="h-4 w-4" />
              <span>Public Website</span>
            </NavLink>
          </div>
        </nav>

        {/* Storage Meter Widget */}
        <div className="p-4 border-t border-dark-800 bg-dark-950/40">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-medium text-dark-300 flex items-center gap-1.5">
              <Database className="h-3.5 w-3.5 text-primary-400" />
              Penyimpanan
            </span>
            <span className="font-mono text-dark-400">
              {formatBytes(storageStats?.usedBytes || 0)}
            </span>
          </div>

          <div className="w-full bg-dark-800 h-2 rounded-full overflow-hidden mb-2">
            <div
              className="bg-primary-500 h-full rounded-full transition-all duration-500"
              style={{
                width: `${Math.min(100, Math.max(2, storageStats?.percentageUsed || 0))}%`,
              }}
            />
          </div>

          <div className="flex justify-between text-[11px] text-dark-500 font-mono">
            <span>{storageStats?.fileCount || 0} files</span>
            <span>Limit 5.0 GB</span>
          </div>
        </div>

        {/* User Profile & Logout */}
        <div className="p-3 border-t border-dark-800 flex items-center justify-between bg-dark-900">
          <div className="min-w-0 flex-1 mr-2">
            <p className="text-xs font-semibold text-dark-200 truncate">
              {user?.name || 'Administrator'}
            </p>
            <p className="text-[11px] text-dark-500 truncate">
              {user?.email || 'admin@example.com'}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => logoutMutation.mutate()}
            className="text-red-400 hover:text-red-300 hover:bg-red-500/10 p-2"
            title="Keluar / Logout Session"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:pl-64">
        {/* Top Navbar */}
        <header className="sticky top-0 z-20 h-16 bg-dark-950/80 backdrop-blur-xl border-b border-dark-800 flex items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg text-dark-400 hover:text-dark-100 hover:bg-dark-800"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
                <Lock className="h-3 w-3" />
                Private Encrypted Area
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-dark-400 hover:text-dark-100 hover:bg-dark-800 transition-colors"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => logoutMutation.mutate()}
              className="text-xs border-red-500/30 text-red-400 hover:bg-red-500/10"
              leftIcon={<LogOut className="h-3.5 w-3.5" />}
            >
              Logout
            </Button>
          </div>
        </header>

        {/* Route Pages Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
export default DriveLayout;
