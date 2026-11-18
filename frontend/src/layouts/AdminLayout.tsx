import { Outlet, Navigate } from 'react-router-dom';
import { Sidebar } from '../components/layout/Sidebar';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { cn } from '../utils';
import { useAuthStore } from '../store/auth';
import { useUIStore } from '../store/ui';

export function AdminLayout() {
  const { isAuthenticated, isLoading } = useAuthStore();
  const { sidebarCollapsed } = useUIStore();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="min-h-screen bg-[#080A10] text-[#F4F3F8] nocturne-ambient flex flex-col relative overflow-x-hidden selection:bg-[#A3ADC4]/30 selection:text-white font-sans">
      <Sidebar isAdmin={true} isAdminPage={true} />
      <div className={cn(
        'flex-1 flex flex-col transition-all duration-300 relative z-10',
        !sidebarCollapsed ? 'lg:pl-80' : 'lg:pl-24'
      )}>
        <Header title="Admin Panel" />
        <main className="flex-1 w-full pt-24 sm:pt-28 pb-24 px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1620px] mx-auto transition-all duration-300">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
}