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
    <div className="min-h-screen bg-dark-950 flex flex-col">
      <Sidebar isAdmin={true} />
      <div className={cn(
        'flex-1 flex flex-col transition-all duration-300',
        !sidebarCollapsed ? 'lg:pl-64' : 'lg:pl-16'
      )}>
        <Header title="Admin Panel" />
        <main className="flex-1 pt-16 pb-8 px-4 sm:px-6 lg:px-8">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
}