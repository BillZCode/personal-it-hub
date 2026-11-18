import { useRef, useMemo } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useUIStore } from '../../store/ui';
import { cn } from '../../utils';
import {
  LayoutDashboard,
  FolderKanban,
  Award,
  BookOpen,
  Wrench,
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
  Bot,
  Shield,
  ExternalLink,
  Compass,
  Languages,
  type LucideIcon,
} from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  external?: boolean;
  subdomainUrl?: string;
  children?: NavItem[];
  adminOnly?: boolean;
}

interface NavSection {
  label: string;
  items: NavItem[];
}

const navigation: NavSection[] = [
  {
    label: 'MAIN HUB',
    items: [
      {
        label: 'Dashboard & Portfolio',
        href: '/dashboard',
        icon: LayoutDashboard,
      },
      { label: 'Navigation Portal', href: '/portal', icon: Compass },
    ],
  },
  {
    label: 'PORTFOLIO & PROFILE',
    items: [
      {
        label: 'Featured Projects',
        href: '/projects',
        icon: FolderKanban,
      },
      { label: 'About & Profile', href: '/about', icon: UserIcon },
      { label: 'Certifications', href: '/certificates', icon: Award },
      {
        label: 'Technical Notes',
        href: '/notes',
        icon: BookOpen,
      },
    ],
  },
  {
    label: 'TOOLS & WORKSTATIONS',
    items: [
      { label: 'DevKit CLI Studio', href: '/devkit', icon: Wrench },
      { label: 'CyberLab CTF', href: '/cyberlab', icon: Shield },
      { label: 'Omni AI Studio', href: '/ai', icon: Bot },
      { label: 'Transkrip & Terjemahan', href: '/transkrip', icon: Languages },
      {
        label: 'Tools & Network Probe',
        href: '/tools',
        icon: Wrench,
      },
      {
        label: 'System Infrastructure',
        href: '/system',
        icon: Server,
      },
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
      {
        label: 'Antigravity Remote Agent',
        href: '/admin/agent',
        icon: Bot,
        adminOnly: true,
      },
      {
        label: 'Private Cloud Drive',
        href: '/drive',
        icon: HardDrive,
        adminOnly: true,
      },
    ],
  },
  {
    label: 'SYSTEM & DIAGNOSTICS',
    items: [
      {
        label: 'Tools & Network Diagnostics',
        href: '/tools',
        icon: Wrench,
        adminOnly: true,
      },
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

function NavLinkItem({
  item,
  onItemClick,
}: {
  item: NavItem;
  isAdmin?: boolean;
  onItemClick: () => void;
}) {
  const Icon = item.icon;
  const location = useLocation();
  const isExact = item.href === '/' || item.href === '/admin' || item.href === '/dashboard';
  const isActive = isExact
    ? location.pathname === item.href
    : location.pathname.startsWith(item.href);

  return (
    <div className="relative group/item">
      <NavLink
        to={item.href}
        end={isExact}
        onClick={onItemClick}
        className={cn(
          'flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-200',
          isActive
            ? 'bg-[#F4F3F8] text-[#080A10] font-semibold shadow-glowPill'
            : 'text-[#8E9AB5] hover:text-[#F4F3F8] hover:bg-white/[0.05]'
        )}
      >
        <div className="flex items-center gap-3 min-w-0">
          <Icon
            className={cn(
              'h-4 w-4 shrink-0 transition-colors',
              isActive ? 'text-[#080A10]' : 'text-[#A3ADC4] group-hover/item:text-[#F4F3F8]'
            )}
          />
          <span className="truncate">{item.label}</span>
        </div>

        {item.subdomainUrl && (
          <div className="flex items-center gap-1.5 shrink-0">
            <a
              href={item.subdomainUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="p-1 rounded-md hover:bg-white/10 text-[#8E9AB5] hover:text-white transition-colors"
              title={`Open ${item.subdomainUrl}`}
            >
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        )}
      </NavLink>
    </div>
  );
}

interface SidebarProps {
  isAdmin?: boolean;
  isAdminPage?: boolean;
}

export function Sidebar({ isAdmin = false, isAdminPage = false }: SidebarProps) {
  const { sidebarOpen, setSidebarOpen, sidebarCollapsed, toggleSidebarCollapse } = useUIStore();
  const location = useLocation();
  const navContainerRef = useRef<HTMLDivElement>(null);

  const isCurrentAdminPage = isAdminPage || location.pathname.startsWith('/admin');

  const displayedNavigation = useMemo(() => navigation, []);

  // Collapsed Floating Island Dock Mode (Desktop)
  if (sidebarCollapsed) {
    const quickItems = isCurrentAdminPage
      ? adminNavigation.flatMap((s) => s.items)
      : navigation.flatMap((s) => s.items);

    return (
      <aside
        aria-label="Collapsed navigation dock"
        className="hidden lg:flex fixed top-4 left-4 bottom-4 w-16 z-40 flex-col items-center justify-between py-4 rounded-3xl bg-[#0B0E17]/95 backdrop-blur-2xl border border-white/[0.08] shadow-2xl"
      >
        <button
          onClick={toggleSidebarCollapse}
          className="w-10 h-10 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 flex items-center justify-center text-[#D2D8F0] transition-colors"
          title="Expand Sidebar"
          aria-label="Expand sidebar"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        <nav className="flex-1 overflow-y-auto py-4 space-y-2 scrollbar-hide flex flex-col items-center">
          {quickItems.map((item) => {
            const Icon = item.icon;
            const isExact =
              item.href === '/' || item.href === '/admin' || item.href === '/dashboard';
            const isActive = isExact
              ? location.pathname === item.href
              : location.pathname.startsWith(item.href);

            return (
              <NavLink
                key={item.href}
                to={item.href}
                end={isExact}
                title={item.label}
                className={cn(
                  'w-10 h-10 rounded-xl flex items-center justify-center transition-all',
                  isActive
                    ? 'bg-[#F4F3F8] text-[#080A10] shadow-glowPill'
                    : 'text-[#8E9AB5] hover:text-[#F4F3F8] hover:bg-white/[0.06]'
                )}
              >
                <Icon className="w-4 h-4" />
              </NavLink>
            );
          })}
        </nav>

        <div className="flex flex-col items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#4ED69E]" title="System Online" />
        </div>
      </aside>
    );
  }

  return (
    <>
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-[#080A10]/80 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        aria-label="Main Sidebar Navigation"
        className={cn(
          'fixed top-0 left-0 bottom-0 z-50 w-72 lg:w-72 flex flex-col bg-[#0B0E17]/95 backdrop-blur-2xl border-r border-white/[0.06] transition-transform duration-300 ease-out',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Top Mega Project Nocturne Header */}
        <div className="h-16 px-4 border-b border-white/[0.06] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative flex h-9 w-9 items-center justify-center rounded-full bg-white/[0.06] border border-white/15">
              <Terminal className="h-4 w-4 text-[#D2D8F0]" />
              <span className="absolute -bottom-0.5 -right-0.5 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4ED69E] opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#4ED69E]" />
              </span>
            </div>

            <div className="flex flex-col">
              <span className="font-display text-sm font-semibold tracking-tight text-[#F4F3F8]">
                IT-HUB OS
              </span>
              <span className="text-[10px] font-mono tracking-wider text-[#8E9AB5]">
                Admin Console
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={toggleSidebarCollapse}
              className="hidden lg:flex p-1.5 rounded-full text-[#8E9AB5] hover:text-[#F4F3F8] hover:bg-white/[0.06] transition-colors"
              aria-label="Collapse to island dock"
              title="Dock mode (Ctrl+B)"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-full text-[#8E9AB5] hover:text-white hover:bg-white/[0.06] transition-colors"
              aria-label="Close sidebar"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Navigation List */}
        <div
          ref={navContainerRef}
          className="flex-1 overflow-y-auto p-3.5 space-y-4 scrollbar-hide"
          aria-label="Main navigation"
        >
          {isCurrentAdminPage ? (
            <>
              {adminNavigation.map((section) => (
                <div key={section.label} className="space-y-1">
                  <div className="flex items-center gap-2 px-3 pt-2 pb-1 text-[10px] font-mono font-medium tracking-widest text-[#5E687E] uppercase">
                    <span className="text-[#D2D8F0]">✦</span>
                    <span>{section.label}</span>
                    <span className="flex-1 h-px bg-white/[0.05]" />
                  </div>
                  <div className="space-y-1">
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
                      <div className="flex items-center gap-2 px-3 pt-2 pb-1 text-[10px] font-mono font-medium tracking-widest text-[#5E687E] uppercase">
                        <span className="text-[#D2D8F0]">✦</span>
                        <span>{section.label}</span>
                        <span className="flex-1 h-px bg-white/[0.05]" />
                      </div>
                      <div className="space-y-1">
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
                  <div className="flex items-center gap-2 px-3 pt-2 pb-1 text-[10px] font-mono font-medium tracking-widest text-[#5E687E] uppercase">
                    <span className="text-[#D2D8F0]">✦</span>
                    <span>{section.label}</span>
                    <span className="flex-1 h-px bg-white/[0.05]" />
                  </div>
                  <div className="space-y-1">
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
                      <div className="flex items-center gap-2 px-3 pt-2 pb-1 text-[10px] font-mono font-medium tracking-widest text-[#5E687E] uppercase">
                        <span className="text-[#D2D8F0]">✦</span>
                        <span>{section.label}</span>
                        <span className="flex-1 h-px bg-white/[0.05]" />
                      </div>
                      <div className="space-y-1">
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

        {/* Sidebar Footer with Collapse Button */}
        <div className="p-3.5 border-t border-white/[0.06] bg-[#080A10]/60">
          <button
            onClick={toggleSidebarCollapse}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-[#8E9AB5] hover:text-[#F4F3F8] hover:bg-white/[0.04] border border-transparent hover:border-white/[0.08] transition-all text-xs font-mono group"
            aria-label="Collapse sidebar"
            title="Collapse sidebar (Ctrl+B)"
          >
            <span className="flex items-center gap-2">
              <ChevronLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
              <span>Minimize to Island Dock</span>
            </span>
            <span className="text-[10px] text-[#8E9AB5] bg-[#0D101A] px-2 py-0.5 rounded-full border border-white/10">
              Ctrl+B
            </span>
          </button>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;