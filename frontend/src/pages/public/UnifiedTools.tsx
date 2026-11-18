import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Wrench,
  Network,
  Activity,
  Shield,
  Lock,
  ExternalLink,
} from 'lucide-react';
import { useDocumentTitle } from '../../hooks';
import { useAuthStore } from '../../store/auth';
import { Tools } from './Tools';
import { NetworkTools } from './NetworkTools';
import { cn } from '../../utils';

export type UnifiedToolTabKey = 'tools' | 'network';

interface TabItem {
  id: UnifiedToolTabKey;
  label: string;
  shortLabel: string;
  icon: React.ElementType;
  badgeClass: string;
  description: string;
}

const TABS: TabItem[] = [
  {
    id: 'tools',
    label: 'System & Developer Utilities',
    shortLabel: 'System Tools',
    icon: Wrench,
    badgeClass: 'bg-[#F7C95C]/15 text-[#F7C95C] border-[#F7C95C]/40',
    description:
      'File downloader yt-dlp, format JSON/Base64, kriptografi hash, dan QR generator.',
  },
  {
    id: 'network',
    label: 'Network Diagnostics & Matrix',
    shortLabel: 'Network Diag',
    icon: Network,
    badgeClass: 'bg-[#5B8DEF]/15 text-[#5B8DEF] border-[#5B8DEF]/40',
    description:
      'DNS Lookup, Ping latency, IP/Subnet calculator, Port check, dan Traceroute.',
  },
];

export function UnifiedTools() {
  const { isAuthenticated } = useAuthStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const location = window.location;
  const isNetworkRoute = location.pathname.includes('/network');
  const activeTabParam = searchParams.get('tab') as UnifiedToolTabKey | null;
  const activeTab: UnifiedToolTabKey =
    activeTabParam && ['tools', 'network'].includes(activeTabParam)
      ? activeTabParam
      : isNetworkRoute
      ? 'network'
      : 'tools';

  const setActiveTab = (tab: UnifiedToolTabKey) => {
    setSearchParams({ tab });
  };

  useDocumentTitle(
    activeTab === 'network'
      ? 'Network Diagnostics — Personal IT Hub'
      : 'System Tools & Utilitas — Personal IT Hub'
  );

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in pb-16">
      {/* 1. Mega Project Nocturne Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/[0.06] pb-6">
        <div>
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-medium text-[#F4F3F8] tracking-tight">
            Tools &amp;{' '}
            <span className="italic font-normal text-[#D2D8F0]">Network Diagnostics</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#8E9AB5] mt-2 max-w-3xl font-sans leading-relaxed">
            Kumpulan komprehensif utilitas sistem harian, konversi data, downloader media, serta
            perangkat pengujian konektivitas dan diagnostik jaringan TKJ.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          {isAuthenticated ? (
            <Link
              to="/admin"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-mono font-semibold bg-[#F7C95C]/15 text-[#F7C95C] border border-[#F7C95C]/40 hover:bg-[#F7C95C]/25 transition-all group"
              title="Akses Mode Admin Dashboard"
            >
              <Shield className="w-3.5 h-3.5 text-[#F7C95C]" />
              <span>ADMIN MODE</span>
              <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 transition-transform opacity-75" />
            </Link>
          ) : (
            <Link
              to="/admin/login"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-mono text-[#A3ADC4] hover:text-[#F4F3F8] bg-[#0D101A] border border-white/10 hover:border-white/20 transition-all"
              title="Masuk sebagai Administrator"
            >
              <Lock className="w-3 h-3" />
              <span>Admin Login</span>
            </Link>
          )}

          <div className="flex items-center gap-2 text-xs font-mono text-[#8E9AB5] bg-[#0D101A] border border-white/[0.08] px-3.5 py-1.5 rounded-full">
            <Activity className="w-3.5 h-3.5 text-[#4ED69E] animate-pulse" />
            <span>
              Active: <span className="text-[#F4F3F8] font-bold uppercase">{activeTab}</span>
            </span>
          </div>
        </div>
      </div>

      {/* 2. Interactive Unified Tabs Bar */}
      <div
        className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        role="tablist"
        aria-label="Tools Navigation Tabs"
      >
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'group relative flex items-start gap-4 p-5 rounded-2xl border text-left transition-all duration-200 focus:outline-none shadow-nocturneCard',
                isActive
                  ? 'bg-[#121624] border-white/25 ring-1 ring-white/15'
                  : 'bg-[#0D101A] border-white/[0.08] hover:border-white/20'
              )}
            >
              <div
                className={cn(
                  'w-11 h-11 rounded-xl border flex items-center justify-center shrink-0 mt-0.5',
                  tab.badgeClass
                )}
              >
                <Icon className="w-5 h-5" />
              </div>

              <div className="flex-1 min-w-0">
                <span className="text-base font-display font-medium text-[#F4F3F8] block truncate">
                  {tab.label}
                </span>
                <p className="text-xs text-[#8E9AB5] mt-1 line-clamp-1 leading-relaxed">
                  {tab.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* 3. Tab Content Viewport */}
      <div className="pt-2">
        {activeTab === 'tools' && (
          <div className="animate-in">
            <Tools />
          </div>
        )}

        {activeTab === 'network' && (
          <div className="animate-in">
            <NetworkTools />
          </div>
        )}
      </div>
    </div>
  );
}

export default UnifiedTools;
