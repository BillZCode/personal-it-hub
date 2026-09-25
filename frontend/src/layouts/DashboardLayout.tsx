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
    if (segment === 'cyberlab') return 'CyberLab LKS Workstation';
    return segment
      ? segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ')
      : 'Dashboard';
  };

  return (
    <div className="min-h-screen bg-dark-950 flex flex-col relative overflow-hidden selection:bg-primary-500/30 selection:text-primary-300">
      {/* Dynamic Ambient Background Elements (Calibrated for subtle depth) */}
      <div className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-primary-500/5 dark:bg-primary-500/10 rounded-full blur-[140px] pointer-events-none animate-pulse-slow" />
      <div className="fixed bottom-10 right-10 w-[450px] h-[450px] bg-cyan-500/5 dark:bg-cyan-500/8 rounded-full blur-[160px] pointer-events-none" />
      <div className="fixed top-1/3 right-1/4 w-[350px] h-[350px] bg-emerald-500/4 dark:bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none animate-float" />

      {/* Grid Overlay */}
      <div className="fixed inset-0 bg-grid-pattern bg-grid opacity-15 dark:opacity-30 pointer-events-none" />

      {/* Scanline subtle overlay (Dark mode only) */}
      <div className="scanline hidden dark:block fixed inset-0 pointer-events-none z-50 opacity-20" />

      <Sidebar isAdmin={isAuthenticated} />
      
      <div className={cn(
        'flex-1 flex flex-col transition-all duration-300 relative z-10',
        !sidebarCollapsed ? 'lg:pl-64' : 'lg:pl-16'
      )}>
        <Header title={getPageTitle(location.pathname)} />
        <main className="flex-1 w-full pt-20 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
}

export default DashboardLayout;