import { Outlet, useLocation } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { cn } from '../utils';

export function DashboardLayout() {
  const location = useLocation();

  const getPageTitle = (pathname: string) => {
    if (pathname === '/' || pathname === '/portal') return 'Portal Navigasi';
    if (pathname === '/dashboard') return 'Dashboard Telemetry';
    if (
      pathname.startsWith('/system') ||
      pathname.startsWith('/status') ||
      pathname.startsWith('/server') ||
      pathname.startsWith('/statistics') ||
      pathname.startsWith('/linux-setup')
    ) {
      return 'System & Infrastructure Center';
    }
    const segment = pathname.split('/')[1];
    if (segment === 'ai' || segment === 'chatbot') return 'Omni AI Assistant';
    if (segment === 'cyberlab') return 'CyberLab Workstation';
    if (segment === 'transkrip') return 'Transkrip & Terjemahan AI';
    return segment
      ? segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ')
      : 'Dashboard';
  };

  return (
    <div className="min-h-screen bg-[#080A10] text-[#F4F3F8] nocturne-ambient flex flex-col relative overflow-hidden selection:bg-[#A3ADC4]/30 selection:text-white font-sans">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#F4F3F8] focus:text-[#080A10] focus:font-bold focus:rounded-full focus:shadow-2xl font-mono text-xs transition-all"
      >
        Skip to main content
      </a>

      {/* Mega Project Ambient Star Accents */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden z-0" aria-hidden="true">
        <span className="select-none absolute top-28 left-[15%] text-white/20 text-xs animate-pulse">
          ✦
        </span>
        <span className="select-none absolute top-40 right-[12%] text-white/25 text-sm animate-pulse">
          ✦
        </span>
        <span className="select-none absolute bottom-32 right-[18%] text-white/15 text-xs">
          ✦
        </span>
      </div>

      {/* Main Content Viewport */}
      <div className="flex-1 flex flex-col transition-all duration-300 relative z-10">
        <Header title={getPageTitle(location.pathname)} showSidebar={false} />
        <main
          id="main-content"
          className={cn(
            'flex-1 w-full transition-all duration-300',
            location.pathname === '/cyberlab' ||
              location.pathname === '/ai' ||
              location.pathname === '/chatbot' ||
              location.pathname === '/transkrip'
              ? 'pt-24 px-4 sm:px-8 pb-8 max-w-full'
              : 'pt-24 pb-20 px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1620px] mx-auto'
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