import { useRef, useEffect, useMemo } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useUIStore } from '../../store/ui';
import { cn } from '../../utils';
import { animate, stagger } from 'animejs';
import {
  LayoutDashboard,
  FolderKanban,
  Award,
  BookOpen,
  Wrench,
  Network,
  Activity,
  Server,
  BarChart3,
  User as UserIcon,
  Image,
  Terminal,
  GitBranch,
  MessageSquare,
  Mail,
  ChevronRight,
  ChevronLeft,
  X,
  HardDrive,
  Lock,
  Bot,
  Shield,
  ExternalLink,
  Globe,
  Compass,
  type LucideIcon,
} from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
  badgeType?: 'live' | 'tech' | 'neutral' | 'cloud' | 'subdomain';
  external?: boolean;
  subdomainUrl?: string;
  children?: NavItem[];
  adminOnly?: boolean;
}

interface NavSection {
  label: string;
  items: NavItem[];
}

// Curated Portfolio & IT-Hub Navigation
const navigation: NavSection[] = [
  {
    label: 'MAIN HUB',
    items: [
      { label: 'Dashboard & Portfolio', href: '/dashboard', icon: LayoutDashboard, badge: 'CORE', badgeType: 'tech' },
      { label: 'Navigation Portal', href: '/portal', icon: Compass },
    ],
  },
  {
    label: 'PORTFOLIO & PROFILE',
    items: [
      { label: 'Featured Projects', href: '/projects', icon: FolderKanban, badge: 'WORKS', badgeType: 'tech' },
      { label: 'About & Profile', href: '/about', icon: UserIcon },
      { label: 'Certifications', href: '/certificates', icon: Award },
      { label: 'Technical Notes', href: '/notes', icon: BookOpen, badge: 'GUIDES', badgeType: 'subdomain' },
    ],
  },
  {
    label: 'TOOLS & WORKSTATIONS',
    items: [
      { label: 'DevKit CLI Studio', href: '/devkit', icon: Wrench, badge: 'DEV', badgeType: 'tech' },
      { label: 'CyberLab CTF', href: '/cyberlab', icon: Shield, badge: 'SECOPS', badgeType: 'live' },
      { label: 'Omni AI Studio', href: '/ai', icon: Bot, badge: 'AI', badgeType: 'subdomain' },
      { label: 'Tools & Network Probe', href: '/tools', icon: Activity, badge: 'DIAG', badgeType: 'tech' },
      { label: 'System Infrastructure', href: '/system', icon: Server, badge: 'STATUS', badgeType: 'live' },
    ],
  },
  {
    label: 'CONNECT & MEDIA',
    items: [
      { label: 'Visual Gallery', href: '/gallery', icon: Image },
      { label: 'Guestbook', href: '/guestbook', icon: MessageSquare },
      { label: 'Changelog', href: '/changelog', icon: GitBranch },
      { label: 'Contact & Hire', href: '/contact', icon: Mail },
    ],
  },
];

const adminNavigation: NavSection[] = [
  {
    label: 'ADMIN DASHBOARD',
    items: [
      { label: 'Dashboard Overview', href: '/admin', icon: LayoutDashboard, adminOnly: true },
      { label: 'Antigravity Remote Agent', href: '/admin/agent', icon: Bot, badge: 'AGENT', badgeType: 'live', adminOnly: true },
      { label: 'Private Cloud Drive', href: '/drive', icon: HardDrive, badge: 'CLOUD', badgeType: 'cloud', adminOnly: true },
    ],
  },
  {
    label: 'SYSTEM & DIAGNOSTICS',
    items: [
      { label: 'Tools & Network Diagnostics', href: '/tools', icon: Wrench, badge: 'DIAG', badgeType: 'neutral', adminOnly: true },
    ],
  },
  {
    label: 'CONTENT MANAGEMENT',
    items: [
      { label: 'Projects', href: '/admin/projects', icon: FolderKanban, adminOnly: true },
      { label: 'Notes', href: '/admin/notes', icon: BookOpen, adminOnly: true },
      { label: 'Certificates', href: '/admin/certificates', icon: Award, adminOnly: true },
      { label: 'Gallery', href: '/admin/gallery', icon: Image, adminOnly: true },
      { label: 'Changelog', href: '/admin/changelog', icon: GitBranch, adminOnly: true },
      { label: 'Guestbook', href: '/admin/guestbook', icon: MessageSquare, adminOnly: true },
      { label: 'Admin Statistics', href: '/admin/statistics', icon: BarChart3, adminOnly: true },
    ],
  },
];

function RenderBadge({ badge, type }: { badge: string; type?: string }) {
  if (type === 'live') {
    return (
      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30 shadow-[0_0_8px_rgba(245,158,11,0.25)]">
        <span className="relative flex h-1.5 w-1.5">
          <span className="nav-radar-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-amber-400" />
        </span>
        {badge}
      </span>
    );
  }
  if (type === 'subdomain') {
    return (
      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[8px] font-mono font-bold bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 shadow-[0_0_8px_rgba(6,182,212,0.2)]">
        {badge}
      </span>
    );
  }
  if (type === 'cloud') {
    return (
      <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
        {badge}
      </span>
    );
  }
  if (type === 'tech') {
    return (
      <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
        {badge}
      </span>
    );
  }
  return (
    <span className="px-1.5 py-0.5 rounded text-[9px] font-mono text-dark-400 bg-dark-800 border border-dark-700">
      {badge}
    </span>
  );
}

function NavLinkItem({
  item,
  isAdmin,
  level = 0,
  onItemClick,
}: {
  item: NavItem;
  isAdmin: boolean;
  level?: number;
  onItemClick?: () => void;
}) {
  const location = useLocation();
  const isActive = location.pathname === item.href || (item.href !== '/' && location.pathname.startsWith(item.href + '/'));
  const hasChildren = item.children && item.children.length > 0;

  if (item.adminOnly && !isAdmin) return null;

  if (hasChildren) {
    return (
      <div className={cn('overflow-hidden transition-all duration-300', level > 0 && 'pl-4')}>
        <NavLink
          to={item.href}
          onClick={onItemClick}
          className={cn(
            'group relative flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 overflow-hidden',
            isActive
              ? 'nav-item-glass-active text-amber-700 dark:text-amber-200 font-semibold'
              : 'text-dark-300 hover:text-dark-100 hover:bg-dark-800/50 dark:hover:bg-white/[0.04]'
          )}
        >
          {isActive && (
            <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 rounded-r-full bg-amber-500 dark:bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.8)]" />
          )}
          <item.icon
            className={cn(
              'h-4 w-4 flex-shrink-0 transition-transform duration-200 group-hover:scale-110',
              isActive ? 'text-amber-500 dark:text-amber-400 drop-shadow-[0_0_8px_rgba(245,158,11,0.6)]' : 'text-dark-400 group-hover:text-amber-500 dark:group-hover:text-amber-400'
            )}
            aria-hidden="true"
          />
          <span className="flex-1 truncate tracking-tight">{item.label}</span>
          <ChevronRight
            className={cn(
              'h-3.5 w-3.5 flex-shrink-0 transition-transform duration-200',
              isActive ? 'rotate-90 text-amber-500 dark:text-amber-400' : 'text-dark-400 group-hover:text-dark-200'
            )}
          />
        </NavLink>
        <div className="mt-1 space-y-1">
          {item.children!.map((child) => (
            <NavLinkItem
              key={child.href}
              item={child}
              isAdmin={isAdmin}
              level={level + 1}
              onItemClick={onItemClick}
            />
          ))}
        </div>
      </div>
    );
  }

  // If item is marked as external or separate platform, give option to open internally or launch standalone
  return (
    <div className="group/item relative flex items-center">
      <NavLink
        to={item.href}
        onClick={onItemClick}
        className={cn(
          'group relative flex-1 flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 overflow-hidden nav-anim-item',
          level > 0 && 'pl-8',
          isActive
            ? 'nav-item-glass-active text-amber-700 dark:text-amber-200 font-semibold'
            : 'text-dark-300 hover:text-dark-100 hover:bg-dark-800/50 dark:hover:bg-white/[0.04]'
        )}
      >
        {/* Active Minimalist Glowing Bar on left edge */}
        {isActive && (
          <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 rounded-r-full bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.8)]" />
        )}

        {/* Nav Icon */}
        <item.icon
          className={cn(
            'h-4 w-4 flex-shrink-0 transition-all duration-200 group-hover:scale-110',
            isActive
              ? 'text-amber-400 drop-shadow-[0_0_8px_rgba(245,158,11,0.6)]'
              : 'text-dark-400 group-hover:text-amber-400'
          )}
          aria-hidden="true"
        />

        <div className="flex-1 min-w-0 flex flex-col justify-center">
          <span className="truncate tracking-tight">{item.label}</span>
          {item.subdomainUrl && (
            <span className="text-[10px] font-mono text-dark-500 truncate group-hover:text-amber-400/80 transition-colors">
              {item.subdomainUrl.replace(/^https?:\/\//, '')}
            </span>
          )}
        </div>

        {/* Badges */}
        {item.badge && <RenderBadge badge={item.badge} type={item.badgeType} />}
      </NavLink>

      {/* External Subdomain Quick-Launch Icon if item is a standalone platform */}
      {item.subdomainUrl && (
        <a
          href={item.subdomainUrl}
          target="_blank"
          rel="noopener noreferrer"
          title={`Launch standalone subdomain: ${item.subdomainUrl}`}
          className="p-1.5 mr-1 rounded-lg text-dark-500 hover:text-amber-400 hover:bg-white/[0.05] transition-all opacity-0 group-hover/item:opacity-100"
          aria-label={`Open ${item.label} in new window`}
        >
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      )}
    </div>
  );
}

export function Sidebar({ isAdmin = false, isAdminPage }: { isAdmin?: boolean; isAdminPage?: boolean }) {
  const { sidebarCollapsed, toggleSidebarCollapse, sidebarOpen, setSidebarOpen } = useUIStore();
  const location = useLocation();
  const navContainerRef = useRef<HTMLDivElement>(null);

  const isCurrentAdminPage = isAdminPage !== undefined ? isAdminPage : location.pathname.startsWith('/admin');

  // Filter navigation: on admin pages, remove OVERVIEW, PORTFOLIO & WORK, and CONNECT & FEEDBACK (Guestbook, Changelog, Contact).
  // On public/user pages, keep all navigation items intact.
  const displayedNavigation = useMemo(() => {
    if (!isCurrentAdminPage) {
      return navigation;
    }

    return navigation
      .filter((section) => 
        section.label !== 'MAIN HUB' && 
        section.label !== 'PORTFOLIO & PROFILE' && 
        section.label !== 'CONNECT & MEDIA'
      )
      .filter((section) => section.items.length > 0);
  }, [isCurrentAdminPage]);

  // Staggered smooth entrance animation via Anime.js v4
  useEffect(() => {
    if (!navContainerRef.current) return;
    const items = navContainerRef.current.querySelectorAll('.nav-anim-item');
    if (items.length > 0) {
      animate(items, {
        opacity: [0, 1],
        translateX: [-8, 0],
        delay: stagger(18, { start: 40 }),
        duration: 320,
        ease: 'outCubic',
      });
    }
  }, [sidebarCollapsed]);

  // Keyboard shortcut Ctrl+B / Cmd+B to toggle sidebar & Escape to close mobile sidebar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        toggleSidebarCollapse();
      }
      if (e.key === 'Escape' && sidebarOpen) {
        setSidebarOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleSidebarCollapse, sidebarOpen, setSidebarOpen]);

  // COLLAPSED / FLOATING DOCK MODE (Island Capsule)
  if (sidebarCollapsed) {
    return (
      <aside
        className="fixed left-4 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col items-center py-4 px-2 floating-glass-dock transition-all duration-300 animate-in"
        aria-label="Floating dock navigation"
      >
        {/* Dock Top: Terminal Indicator */}
        <div className="mb-3 relative group">
          <div className="flex items-center justify-center w-9 h-9 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.2)] cursor-pointer hover:scale-105 transition-all">
            <Terminal className="h-4 w-4" />
            <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
              <span className="nav-radar-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400" />
            </span>
          </div>
          <div className="nav-tooltip absolute left-full ml-3 px-3 py-1.5 bg-dark-950/95 border border-amber-500/30 rounded-xl shadow-2xl backdrop-blur-xl z-50 whitespace-nowrap">
            <span className="text-xs font-mono font-bold text-amber-300">Sabbil IT-Hub OS</span>
          </div>
        </div>

        {/* Floating Icons Strip */}
        <nav className="flex flex-col items-center space-y-2 max-h-[60vh] overflow-y-auto scrollbar-hide py-1">
          {isCurrentAdminPage ? (
            <>
              {adminNavigation.map((section) => (
                <div key={section.label} className="flex flex-col items-center space-y-1.5">
                  {section.items.map((item) => {
                    const isActive = location.pathname === item.href || (item.href !== '/' && location.pathname.startsWith(item.href + '/'));
                    return (
                      <div key={item.href} className="relative group">
                        <NavLink
                          to={item.href}
                          className={cn(
                            'flex items-center justify-center w-10 h-10 rounded-2xl transition-all duration-200 relative group-hover:scale-110',
                            isActive
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.3)]'
                              : 'text-dark-400 hover:text-white hover:bg-white/[0.06] border border-transparent'
                          )}
                          aria-label={item.label}
                        >
                          <item.icon className="h-4 w-4 transition-transform group-hover:scale-110" aria-hidden="true" />
                          {isActive && (
                            <span className="absolute -right-1 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,1)]" />
                          )}
                        </NavLink>
                        <div className="nav-tooltip absolute left-full ml-3.5 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-dark-950/95 border border-white/[0.1] rounded-xl shadow-2xl backdrop-blur-xl z-50 whitespace-nowrap">
                          <span className="text-xs font-mono font-medium text-white">{item.label}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}

              {displayedNavigation.length > 0 && (
                <>
                  <div className="w-5 h-px bg-white/[0.1] my-1.5" />
                  {displayedNavigation.map((section) => (
                    <div key={section.label} className="flex flex-col items-center space-y-1.5">
                      {section.items.map((item) => {
                        const isActive = location.pathname === item.href || (item.href !== '/' && location.pathname.startsWith(item.href + '/'));
                        return (
                          <div key={item.href} className="relative group">
                            <NavLink
                              to={item.href}
                              className={cn(
                                'flex items-center justify-center w-10 h-10 rounded-2xl transition-all duration-200 relative group-hover:scale-110',
                                isActive
                                  ? 'bg-gradient-to-tr from-amber-500/30 to-amber-500/10 text-amber-300 border border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.3)]'
                                  : 'text-dark-400 hover:text-white hover:bg-white/[0.06] border border-transparent'
                              )}
                              aria-label={item.label}
                            >
                              <item.icon className="h-4 w-4 transition-transform group-hover:scale-110" aria-hidden="true" />
                              {isActive && (
                                <span className="absolute -right-1 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,1)]" />
                              )}
                            </NavLink>
                            <div className="nav-tooltip absolute left-full ml-3.5 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-dark-950/95 border border-white/[0.1] group-hover:border-amber-500/40 rounded-xl shadow-2xl backdrop-blur-xl z-50 whitespace-nowrap flex items-center gap-2">
                              <span className="text-xs font-mono font-medium text-white">{item.label}</span>
                              {item.badge && <RenderBadge badge={item.badge} type={item.badgeType} />}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </>
              )}
            </>
          ) : (
            <>
              {displayedNavigation.map((section) => (
                <div key={section.label} className="flex flex-col items-center space-y-1.5">
                  {section.items.map((item) => {
                    const isActive = location.pathname === item.href || (item.href !== '/' && location.pathname.startsWith(item.href + '/'));
                    return (
                      <div key={item.href} className="relative group">
                        <NavLink
                          to={item.href}
                          className={cn(
                            'flex items-center justify-center w-10 h-10 rounded-2xl transition-all duration-200 relative group-hover:scale-110',
                            isActive
                              ? 'bg-gradient-to-tr from-amber-500/30 to-amber-500/10 text-amber-300 border border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.3)]'
                              : 'text-dark-400 hover:text-white hover:bg-white/[0.06] border border-transparent'
                          )}
                          aria-label={item.label}
                        >
                          <item.icon className="h-4 w-4 transition-transform group-hover:scale-110" aria-hidden="true" />
                          {isActive && (
                            <span className="absolute -right-1 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,1)]" />
                          )}
                        </NavLink>
                        <div className="nav-tooltip absolute left-full ml-3.5 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-dark-950/95 border border-white/[0.1] group-hover:border-amber-500/40 rounded-xl shadow-2xl backdrop-blur-xl z-50 whitespace-nowrap flex items-center gap-2">
                          <span className="text-xs font-mono font-medium text-white">{item.label}</span>
                          {item.badge && <RenderBadge badge={item.badge} type={item.badgeType} />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}

              {isAdmin && (
                <>
                  <div className="w-5 h-px bg-white/[0.1] my-1.5" />
                  {adminNavigation.map((section) => (
                    <div key={section.label} className="flex flex-col items-center space-y-1.5">
                      {section.items.map((item) => {
                        const isActive = location.pathname === item.href || (item.href !== '/' && location.pathname.startsWith(item.href + '/'));
                        return (
                          <div key={item.href} className="relative group">
                            <NavLink
                              to={item.href}
                              className={cn(
                                'flex items-center justify-center w-10 h-10 rounded-2xl transition-all duration-200 relative group-hover:scale-110',
                                isActive
                                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50'
                                  : 'text-dark-400 hover:text-white hover:bg-white/[0.06]'
                              )}
                              aria-label={item.label}
                            >
                              <item.icon className="h-4 w-4" aria-hidden="true" />
                            </NavLink>
                            <div className="nav-tooltip absolute left-full ml-3.5 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-dark-950/95 border border-white/[0.1] rounded-xl shadow-2xl backdrop-blur-xl z-50 whitespace-nowrap">
                              <span className="text-xs font-mono font-medium text-white">{item.label}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </>
              )}
            </>
          )}
        </nav>

        {/* Expand Trigger Button at bottom of dock */}
        <div className="mt-3 pt-2 border-t border-white/[0.08] w-full flex justify-center">
          <button
            onClick={toggleSidebarCollapse}
            className="flex items-center justify-center w-8 h-8 rounded-xl text-dark-400 hover:text-amber-400 hover:bg-white/[0.06] transition-all"
            aria-label="Expand sidebar"
            title="Expand panel (Ctrl+B)"
          >
            <ChevronRight className="h-4 w-4 hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </aside>
    );
  }

  // EXPANDED FLOATING ISLAND PANEL (Left floating glass card, decoupled from borders)
  return (
    <>
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}
      <aside
        className={cn(
          'fixed z-40 transition-all duration-300 flex flex-col',
          // Mobile: Full drawer, Desktop: Elegant floating glass card with margin from top/bottom/left
          'inset-y-0 left-0 w-64 lg:inset-y-5 lg:left-5 lg:w-72 lg:h-[calc(100vh-2.5rem)]',
          'floating-glass-expanded shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)]',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
        aria-label="Sidebar navigation"
      >
        {/* Brand Header */}
        <div className="flex h-16 items-center justify-between px-5 border-b border-dark-700/60 dark:border-white/[0.06]">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 shadow-[0_0_12px_rgba(245,158,11,0.15)]">
              <Terminal className="h-4 w-4 text-amber-500 dark:text-amber-400" />
              <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
                <span className="nav-radar-ping absolute inline-flex h-full w-full rounded-full bg-amber-500 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
              </span>
            </div>
            
            <div className="flex flex-col">
              <div className="flex items-center gap-1">
                <span className="font-mono text-sm font-bold tracking-tight text-dark-100">IT-HUB OS</span>
                <span className="animate-blink font-mono text-amber-500 dark:text-amber-400 text-sm font-bold">_</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500 dark:bg-amber-400 animate-pulse" />
                <span className="text-[9px] font-mono tracking-wider text-amber-600 dark:text-amber-400/90 font-medium">READY // ONLINE</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={toggleSidebarCollapse}
              className="hidden lg:flex p-1.5 rounded-xl text-dark-400 hover:text-dark-100 hover:bg-dark-800/50 dark:hover:bg-white/[0.06] transition-colors"
              aria-label="Collapse to island dock"
              title="Dock mode (Ctrl+B)"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-xl text-dark-400 hover:text-white hover:bg-white/[0.06] transition-colors"
              aria-label="Close sidebar"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Navigation List */}
        <div ref={navContainerRef} className="flex-1 overflow-y-auto p-3.5 space-y-4" aria-label="Main navigation">
          {isCurrentAdminPage ? (
            <>
              {adminNavigation.map((section) => (
                <div key={section.label} className="space-y-1">
                  <div className="flex items-center gap-2 px-3 pt-2 pb-1 text-[10px] font-mono font-medium tracking-widest text-dark-400 uppercase">
                    <span className="text-amber-500/80 font-bold">//</span>
                    <span>{section.label}</span>
                    <span className="flex-1 h-px bg-white/[0.05]" />
                  </div>
                  <div className="space-y-0.5">
                    {section.items.map((item) => (
                      <NavLinkItem
                        key={item.href}
                        item={item}
                        isAdmin={isAdmin}
                        onItemClick={() => setSidebarOpen(false)}
                      />
                    ))}
                  </div>
                </div>
              ))}

              {displayedNavigation.length > 0 && (
                <>
                  <div className="border-t border-white/[0.06] my-2" />
                  {displayedNavigation.map((section) => (
                    <div key={section.label} className="space-y-1">
                      <div className="flex items-center gap-2 px-3 pt-2 pb-1 text-[10px] font-mono font-medium tracking-widest text-dark-400 uppercase">
                        <span className="text-amber-500/80 font-bold">//</span>
                        <span>{section.label}</span>
                        <span className="flex-1 h-px bg-white/[0.05]" />
                      </div>
                      <div className="space-y-0.5">
                        {section.items.map((item) => (
                          <NavLinkItem
                            key={item.href}
                            item={item}
                            isAdmin={isAdmin}
                            onItemClick={() => setSidebarOpen(false)}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </>
              )}
            </>
          ) : (
            <>
              {displayedNavigation.map((section) => (
                <div key={section.label} className="space-y-1">
                  {/* Category Header with Clean Minimalist Line */}
                  <div className="flex items-center gap-2 px-3 pt-2 pb-1 text-[10px] font-mono font-medium tracking-widest text-dark-400 uppercase">
                    <span className="text-amber-500/80 font-bold">//</span>
                    <span>{section.label}</span>
                    <span className="flex-1 h-px bg-white/[0.05]" />
                  </div>
                  <div className="space-y-0.5">
                    {section.items.map((item) => (
                      <NavLinkItem
                        key={item.href}
                        item={item}
                        isAdmin={isAdmin}
                        onItemClick={() => setSidebarOpen(false)}
                      />
                    ))}
                  </div>
                </div>
              ))}

              {isAdmin && (
                <>
                  <div className="border-t border-white/[0.06] my-2" />
                  {adminNavigation.map((section) => (
                    <div key={section.label} className="space-y-1">
                      <div className="flex items-center gap-2 px-3 pt-2 pb-1 text-[10px] font-mono font-medium tracking-widest text-dark-400 uppercase">
                        <span className="text-amber-500/80 font-bold">//</span>
                        <span>{section.label}</span>
                        <span className="flex-1 h-px bg-white/[0.05]" />
                      </div>
                      <div className="space-y-0.5">
                        {section.items.map((item) => (
                          <NavLinkItem
                            key={item.href}
                            item={item}
                            isAdmin={isAdmin}
                            onItemClick={() => setSidebarOpen(false)}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </>
              )}
            </>
          )}
        </div>

        {/* Sidebar Footer with Telemetry Widget and Collapse Button */}
        <div className="p-3.5 border-t border-dark-700/60 dark:border-white/[0.06] bg-dark-900/40 dark:bg-black/20 space-y-2">
          {/* Micro Telemetry Minimalist Pill */}
          <div className="p-2.5 rounded-2xl bg-dark-800/50 dark:bg-white/[0.03] border border-dark-700/60 dark:border-white/[0.05] flex items-center justify-between text-[11px] font-mono shadow-sm">
            <div className="flex items-center gap-1.5 text-dark-400">
              <Activity className="h-3.5 w-3.5 text-amber-500 dark:text-amber-400 animate-pulse" />
              <span>SYS HEALTH</span>
            </div>
            <span className="text-amber-600 dark:text-amber-400/90 font-bold tracking-wide">99.98% OK</span>
          </div>

          <button
            onClick={toggleSidebarCollapse}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-dark-400 hover:text-dark-100 hover:bg-dark-800/50 dark:hover:bg-white/[0.04] border border-transparent hover:border-dark-700/60 dark:hover:border-white/[0.06] transition-all text-xs font-mono group"
            aria-label="Collapse sidebar"
            title="Collapse sidebar (Ctrl+B)"
          >
            <span className="flex items-center gap-2">
              <ChevronLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
              <span>Minimize to Island Dock</span>
            </span>
            <span className="text-[10px] text-dark-500 bg-dark-800/60 dark:bg-white/[0.03] px-1.5 py-0.5 rounded-md border border-dark-700/60 dark:border-white/[0.06]">
              Ctrl+B
            </span>
          </button>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;