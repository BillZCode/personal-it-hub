import { useRef, useEffect } from 'react';
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
  type LucideIcon,
} from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
  badgeType?: 'live' | 'tech' | 'neutral' | 'cloud';
  children?: NavItem[];
  adminOnly?: boolean;
}

interface NavSection {
  label: string;
  items: NavItem[];
}

const navigation: NavSection[] = [
  {
    label: 'DASHBOARD',
    items: [
      { label: 'Dashboard', href: '/', icon: LayoutDashboard },
    ],
  },
  {
    label: 'PERSONAL',
    items: [
      { label: 'About', href: '/about', icon: UserIcon },
      { label: 'Projects', href: '/projects', icon: FolderKanban },
      { label: 'CyberLab LKS', href: '/cyberlab', icon: Shield, badge: 'CTF', badgeType: 'live' },
      { label: 'Omni AI Assistant', href: '/ai', icon: Bot, badge: 'CORE', badgeType: 'live' },
      { label: 'Certificates', href: '/certificates', icon: Award },
      { label: 'Personal', href: '/personal', icon: UserIcon },
      { label: 'Gallery', href: '/gallery', icon: Image },
      { label: 'Linux Setup', href: '/linux-setup', icon: Terminal, badge: 'CLI', badgeType: 'tech' },
    ],
  },
  {
    label: 'KNOWLEDGE',
    items: [
      { label: 'Technical Notes', href: '/notes', icon: BookOpen },
    ],
  },
  {
    label: 'COMMUNITY',
    items: [
      { label: 'Guestbook', href: '/guestbook', icon: MessageSquare },
    ],
  },
  {
    label: 'OTHER',
    items: [
      { label: 'Changelog', href: '/changelog', icon: GitBranch },
      { label: 'Contact', href: '/contact', icon: Mail },
    ],
  },
];

const adminNavigation: NavSection[] = [
  {
    label: 'ADMIN DASHBOARD',
    items: [
      { label: 'Dashboard Overview', href: '/admin', icon: LayoutDashboard, adminOnly: true },
      { label: 'Private Cloud Drive', href: '/drive', icon: HardDrive, badge: 'CLOUD', badgeType: 'cloud', adminOnly: true },
    ],
  },
  {
    label: 'TOOLS & SYSTEM',
    items: [
      { label: 'Tools & Diagnostics', href: '/tools', icon: Wrench, badge: 'DIAG', badgeType: 'neutral', adminOnly: true },
      { label: 'Network Tools', href: '/network', icon: Network, badge: 'PING', badgeType: 'neutral', adminOnly: true },
      { label: 'Server Info', href: '/server', icon: Server, adminOnly: true },
      { label: 'System Status', href: '/status', icon: Activity, badge: 'LIVE', badgeType: 'live', adminOnly: true },
      { label: 'Statistics', href: '/statistics', icon: BarChart3, adminOnly: true },
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
      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-[0_0_8px_rgba(52,211,153,0.25)]">
        <span className="relative flex h-1.5 w-1.5">
          <span className="nav-radar-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
        </span>
        {badge}
      </span>
    );
  }
  if (type === 'cloud') {
    return (
      <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-medium bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
        {badge}
      </span>
    );
  }
  if (type === 'tech') {
    return (
      <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-medium bg-primary-500/10 text-primary-400 border border-primary-500/20">
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

function NavLinkItem({ item, isAdmin, level = 0 }: { item: NavItem; isAdmin: boolean; level?: number }) {
  const location = useLocation();
  const isActive = location.pathname === item.href || (item.href !== '/' && location.pathname.startsWith(item.href + '/'));
  const hasChildren = item.children && item.children.length > 0;

  if (item.adminOnly && !isAdmin) return null;

  if (hasChildren) {
    return (
      <div className={cn('overflow-hidden transition-all duration-300', level > 0 && 'pl-4')}>
        <NavLink
          to={item.href}
          className={cn(
            'group relative flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 overflow-hidden',
            isActive
              ? 'nav-item-active text-emerald-200'
              : 'text-dark-300 hover:text-dark-100 hover:bg-dark-800/80 hover:translate-x-1'
          )}
        >
          {isActive && (
            <span className="nav-laser-beam absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r-full bg-gradient-to-b from-emerald-400 to-teal-400" />
          )}
          <item.icon
            className={cn(
              'h-4 w-4 flex-shrink-0 transition-transform duration-200 group-hover:scale-110',
              isActive ? 'text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.7)]' : 'text-dark-400 group-hover:text-primary-400'
            )}
            aria-hidden="true"
          />
          <span className="flex-1 truncate tracking-tight">{item.label}</span>
          <ChevronRight
            className={cn(
              'h-3.5 w-3.5 flex-shrink-0 transition-transform duration-200',
              isActive ? 'rotate-90 text-emerald-400' : 'text-dark-500 group-hover:text-dark-300'
            )}
          />
        </NavLink>
        <div className="mt-1 space-y-1">
          {item.children!.map((child) => (
            <NavLinkItem key={child.href} item={child} isAdmin={isAdmin} level={level + 1} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <NavLink
      to={item.href}
      className={cn(
        'group relative flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 overflow-hidden nav-anim-item',
        level > 0 && 'pl-8',
        isActive
          ? 'nav-item-active text-emerald-700 dark:text-emerald-200 font-semibold'
          : 'text-dark-300 hover:text-dark-100 hover:bg-dark-800/70 hover:translate-x-1 border-l-2 border-transparent'
      )}
    >
      {/* Active Glowing Neon Laser Bar on left edge */}
      {isActive && (
        <span className="nav-laser-beam absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r-full bg-gradient-to-b from-emerald-400 to-teal-400" />
      )}

      {/* Nav Icon with subtle hover tilt and active neon glow */}
      <item.icon
        className={cn(
          'h-4 w-4 flex-shrink-0 transition-all duration-200 group-hover:scale-110',
          isActive
            ? 'text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.7)]'
            : 'text-dark-400 group-hover:text-primary-400'
        )}
        aria-hidden="true"
      />

      <span className="truncate tracking-tight flex-1">{item.label}</span>

      {/* Badges or subtle trailing hover chevron */}
      {item.badge ? (
        <RenderBadge badge={item.badge} type={item.badgeType} />
      ) : (
        <ChevronRight className="h-3 w-3 text-dark-500 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
      )}
    </NavLink>
  );
}

export function Sidebar({ isAdmin = false }: { isAdmin?: boolean }) {
  const { sidebarCollapsed, toggleSidebarCollapse, sidebarOpen, setSidebarOpen } = useUIStore();
  const location = useLocation();
  const navContainerRef = useRef<HTMLDivElement>(null);

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

  // Keyboard shortcut Ctrl+B / Cmd+B to toggle sidebar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        toggleSidebarCollapse();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleSidebarCollapse]);

  // COLLAPSED SIDEBAR (w-16)
  if (sidebarCollapsed) {
    return (
      <aside
        className={cn(
          'fixed left-0 top-0 z-40 h-full bg-dark-950/95 backdrop-blur-xl border-r border-dark-700/80 transition-all duration-300 shadow-xl',
          'w-16'
        )}
        aria-label="Sidebar navigation (collapsed)"
      >
        <div className="flex h-full flex-col justify-between">
          {/* Collapsed Brand Header */}
          <div>
            <div className="flex h-16 items-center justify-center border-b border-dark-700/80">
              <div className="relative group flex items-center justify-center w-10 h-10 rounded-xl bg-dark-900 border border-primary-500/30 hover:border-primary-500/60 transition-colors cursor-pointer">
                <Terminal className="h-5 w-5 text-primary-400 group-hover:scale-110 transition-transform" />
                <span className="absolute -top-1 -right-1 flex h-2 w-2">
                  <span className="nav-radar-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                </span>
                
                {/* Floating tooltip */}
                <div className="nav-tooltip absolute left-full ml-3 px-3 py-1.5 bg-dark-900/95 border border-primary-500/40 rounded-xl shadow-2xl backdrop-blur-xl z-50 whitespace-nowrap">
                  <span className="text-xs font-mono font-bold text-emerald-300">IT-HUB System</span>
                </div>
              </div>
            </div>

            {/* Collapsed Nav Items */}
            <nav className="p-2 space-y-1.5 max-h-[calc(100vh-8rem)] overflow-y-auto scrollbar-hide" aria-label="Main navigation">
              {navigation.map((section) => (
                <div key={section.label} className="space-y-1">
                  {section.items.map((item) => {
                    const isActive = location.pathname === item.href || (item.href !== '/' && location.pathname.startsWith(item.href + '/'));
                    return (
                      <div key={item.href} className="relative group">
                        <NavLink
                          to={item.href}
                          className={cn(
                            'flex items-center justify-center w-11 h-10 mx-auto rounded-xl transition-all duration-200 relative',
                            isActive
                              ? 'nav-item-active-collapsed text-emerald-400 border border-emerald-500/40'
                              : 'text-dark-400 hover:text-dark-100 hover:bg-dark-800/80'
                          )}
                          aria-label={item.label}
                        >
                          <item.icon
                            className={cn(
                              'h-5 w-5 transition-transform duration-200 group-hover:scale-110',
                              isActive && 'drop-shadow-[0_0_8px_rgba(52,211,153,0.8)]'
                            )}
                            aria-hidden="true"
                          />
                          {isActive && (
                            <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-4 rounded-r-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,1)]" />
                          )}
                        </NavLink>

                        {/* Floating Tooltip with Cyber Styling */}
                        <div className="nav-tooltip absolute left-full ml-3.5 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-dark-900/95 border border-dark-600/80 group-hover:border-primary-500/40 rounded-xl shadow-2xl backdrop-blur-xl z-50 whitespace-nowrap flex items-center gap-2">
                          <span className="text-xs font-mono font-semibold text-dark-100">{item.label}</span>
                          {item.badge && <RenderBadge badge={item.badge} type={item.badgeType} />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}

              {isAdmin && (
                <>
                  <div className="border-t border-dark-700/80 my-2" />
                  {adminNavigation.map((section) => (
                    <div key={section.label} className="space-y-1">
                      {section.items.map((item) => {
                        const isActive = location.pathname === item.href || (item.href !== '/' && location.pathname.startsWith(item.href + '/'));
                        return (
                          <div key={item.href} className="relative group">
                            <NavLink
                              to={item.href}
                              className={cn(
                                'flex items-center justify-center w-11 h-10 mx-auto rounded-xl transition-all duration-200 relative',
                                isActive
                                  ? 'nav-item-active-collapsed text-emerald-400 border border-emerald-500/40'
                                  : 'text-dark-400 hover:text-dark-100 hover:bg-dark-800/80'
                              )}
                              aria-label={item.label}
                            >
                              <item.icon className="h-5 w-5" aria-hidden="true" />
                            </NavLink>
                            <div className="nav-tooltip absolute left-full ml-3.5 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-dark-900/95 border border-dark-600 rounded-xl shadow-2xl backdrop-blur-xl z-50 whitespace-nowrap">
                              <span className="text-xs font-mono font-semibold text-dark-100">{item.label}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </>
              )}
            </nav>
          </div>

          {/* Expand Toggle Button */}
          <div className="p-2 border-t border-dark-700/80">
            <button
              onClick={toggleSidebarCollapse}
              className="w-full flex items-center justify-center h-10 rounded-xl text-dark-400 hover:text-primary-300 hover:bg-dark-800/80 transition-colors"
              aria-label="Expand sidebar"
              title="Expand sidebar (Ctrl+B)"
            >
              <ChevronRight className="h-5 w-5 hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </aside>
    );
  }

  // EXPANDED SIDEBAR (w-64)
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
          'fixed left-0 top-0 z-40 h-screen bg-dark-950/95 backdrop-blur-2xl border-r border-dark-700/80 transition-all duration-300 flex flex-col',
          'w-64 lg:w-64',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
        aria-label="Sidebar navigation"
      >
        {/* Brand Header */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-dark-700/80 bg-dark-900/40">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-8 h-8 rounded-xl bg-dark-800 border border-primary-500/30 shadow-sm">
              <Terminal className="h-4 w-4 text-emerald-600 dark:text-primary-400" />
              <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
                <span className="nav-radar-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
            </div>
            
            <div className="flex flex-col">
              <div className="flex items-center gap-1">
                <span className="font-mono text-sm font-bold tracking-tight text-dark-100">IT-HUB</span>
                <span className="animate-blink font-mono text-emerald-600 dark:text-primary-400 text-sm font-bold">_</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse" />
                <span className="text-[9px] font-mono tracking-wider text-emerald-700 dark:text-emerald-400/90 font-semibold">READY // ONLINE</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-xl text-dark-400 hover:text-dark-100 hover:bg-dark-800 transition-colors"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation List */}
        <div ref={navContainerRef} className="flex-1 overflow-y-auto p-2.5 space-y-3" aria-label="Main navigation">
          {navigation.map((section) => (
            <div key={section.label} className="space-y-1">
              {/* Category Header with Terminal Syntax */}
              <div className="flex items-center gap-2 px-3 pt-2 pb-1 text-[10px] font-mono font-bold tracking-widest text-dark-400/90 uppercase">
                <span className="text-emerald-600 dark:text-primary-500/60 font-black">//</span>
                <span>{section.label}</span>
                <span className="flex-1 h-px bg-gradient-to-r from-dark-700/60 via-dark-700/20 to-transparent" />
              </div>
              <div className="space-y-0.5">
                {section.items.map((item) => (
                  <NavLinkItem key={item.href} item={item} isAdmin={isAdmin} />
                ))}
              </div>
            </div>
          ))}

          {isAdmin && (
            <>
              <div className="border-t border-dark-700/80 my-2" />
              {adminNavigation.map((section) => (
                <div key={section.label} className="space-y-1">
                  <div className="flex items-center gap-2 px-3 pt-2 pb-1 text-[10px] font-mono font-bold tracking-widest text-dark-400/90 uppercase">
                    <span className="text-cyan-600 dark:text-cyan-500/60 font-black">//</span>
                    <span>{section.label}</span>
                    <span className="flex-1 h-px bg-gradient-to-r from-dark-700/60 via-dark-700/20 to-transparent" />
                  </div>
                  <div className="space-y-0.5">
                    {section.items.map((item) => (
                      <NavLinkItem key={item.href} item={item} isAdmin={isAdmin} />
                    ))}
                  </div>
                </div>
              ))}
            </>
          )}
        </div>

        {/* Sidebar Footer with Telemetry Widget and Collapse Button */}
        <div className="p-3 border-t border-dark-700/80 bg-dark-950/40 space-y-2">
          {/* Micro Telemetry Widget */}
          <div className="p-2 rounded-xl bg-dark-900/80 border border-dark-700/60 flex items-center justify-between text-[11px] font-mono shadow-sm">
            <div className="flex items-center gap-1.5 text-dark-400">
              <Activity className="h-3.5 w-3.5 text-emerald-600 dark:text-primary-400 animate-pulse" />
              <span>SYS HEALTH</span>
            </div>
            <span className="text-emerald-700 dark:text-emerald-400 font-bold tracking-wide">99.98% OK</span>
          </div>

          <button
            onClick={toggleSidebarCollapse}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-dark-400 hover:text-primary-300 hover:bg-dark-800/80 border border-transparent hover:border-dark-700/60 transition-all text-xs font-mono group"
            aria-label="Collapse sidebar"
            title="Collapse sidebar (Ctrl+B)"
          >
            <span className="flex items-center gap-2">
              <ChevronLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
              <span>Collapse</span>
            </span>
            <span className="text-[10px] text-dark-500 bg-dark-900 px-1.5 py-0.5 rounded border border-dark-700/70">
              Ctrl+B
            </span>
          </button>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;