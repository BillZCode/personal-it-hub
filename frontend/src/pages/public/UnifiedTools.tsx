import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  Wrench, 
  Network, 
  Download, 
  Binary, 
  Activity, 
  Shield, 
  Terminal, 
  Layers, 
  Search, 
  Sparkles,
  Lock,
  ExternalLink,
  Edit
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
  badge?: string;
  description: string;
}

const TABS: TabItem[] = [
  {
    id: 'tools',
    label: 'System & Developer Utilities',
    shortLabel: 'System Tools',
    icon: Wrench,
    badge: '11 TOOLS',
    description: 'File downloader yt-dlp, format JSON/Base64, kriptografi hash, dan QR generator.',
  },
  {
    id: 'network',
    label: 'Network Diagnostics & Matrix',
    shortLabel: 'Network Diag',
    icon: Network,
    badge: 'TKJ SUITE',
    description: 'DNS Lookup, Ping latency, IP/Subnet calculator, Port check, dan Traceroute.',
  },
];

export function UnifiedTools() {
  const { isAuthenticated } = useAuthStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const location = window.location;
  const isNetworkRoute = location.pathname.includes('/network');
  const activeTabParam = searchParams.get('tab') as UnifiedToolTabKey | null;
  const activeTab: UnifiedToolTabKey = (activeTabParam && ['tools', 'network'].includes(activeTabParam))
    ? activeTabParam
    : (isNetworkRoute ? 'network' : 'tools');

  const setActiveTab = (tab: UnifiedToolTabKey) => {
    setSearchParams({ tab });
  };

  useDocumentTitle(activeTab === 'network' ? 'Network Diagnostics — Personal IT Hub' : 'System Tools & Utilitas — Personal IT Hub');

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in pb-16">
      {/* 1. Header Command Hub */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-dark-800/80 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-2xs font-mono font-bold uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/25">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              UTILITIES & NETWORK WORKSTATION
            </span>
            <span className="text-2xs font-mono text-dark-500 hidden sm:inline">
              SYSADMIN & TKJ TOOLKIT
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-dark-100 tracking-tight font-sans">
            Tools & Network Diagnostics
          </h1>
          <p className="text-xs sm:text-sm text-dark-400 mt-1 max-w-3xl font-sans leading-relaxed">
            Kumpulan komprehensif utilitas sistem harian, konversi data, downloader media, serta perangkat pengujian konektivitas dan diagnostik jaringan TKJ.
          </p>
        </div>

        {/* Quick info & Admin mode quick action */}
        <div className="flex items-center gap-2.5 shrink-0">
          {isAuthenticated ? (
            <Link
              to="/admin"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-2xs font-mono font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30 hover:bg-amber-500/25 transition-all shadow-[0_0_12px_rgba(245,158,11,0.2)] group"
              title="Akses Mode Admin Dashboard"
            >
              <Shield className="w-3.5 h-3.5 text-amber-400" />
              <span>ADMIN MODE</span>
              <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 transition-transform opacity-75" />
            </Link>
          ) : (
            <Link
              to="/admin/login"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-2xs font-mono text-dark-400 hover:text-dark-200 bg-dark-900/60 border border-dark-800 hover:border-dark-700 transition-all"
              title="Masuk sebagai Administrator"
            >
              <Lock className="w-3 h-3" />
              <span>Admin Login</span>
            </Link>
          )}

          <div className="flex items-center gap-2 text-2xs font-mono text-dark-400 bg-dark-900/80 border border-dark-800 px-3.5 py-1.5 rounded-xl">
            <Activity className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>Active: <span className="text-dark-200 font-bold uppercase">{activeTab}</span></span>
          </div>
        </div>
      </div>

      {/* 2. Interactive Unified Tabs Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" role="tablist" aria-label="Tools Navigation Tabs">
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
                'group relative flex items-start gap-4 p-4 rounded-2xl border text-left transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/60',
                isActive
                  ? 'bg-gradient-to-r from-amber-500/15 via-dark-900 to-dark-900 border-amber-500/40 shadow-console'
                  : 'bg-dark-900/60 border-dark-800 hover:border-dark-700/80 hover:bg-dark-850/60'
              )}
            >
              {/* Icon Container */}
              <div
                className={cn(
                  'p-3 rounded-xl border transition-all duration-200 shrink-0 mt-0.5',
                  isActive
                    ? 'bg-amber-500/20 text-amber-400 border-amber-500/40 shadow-sm'
                    : 'bg-dark-850 text-dark-400 border-dark-750 group-hover:text-dark-200'
                )}
              >
                <Icon className="w-5 h-5" />
              </div>

              {/* Text Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={cn(
                      'text-sm font-bold font-mono transition-colors truncate',
                      isActive ? 'text-white' : 'text-dark-200 group-hover:text-white'
                    )}
                  >
                    {tab.label}
                  </span>
                  {tab.badge && (
                    <span
                      className={cn(
                        'text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border shrink-0',
                        isActive
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                          : 'bg-dark-800 text-dark-400 border-dark-700'
                      )}
                    >
                      {tab.badge}
                    </span>
                  )}
                </div>
                <p className="text-xs text-dark-400 mt-1 line-clamp-1 leading-relaxed">
                  {tab.description}
                </p>
              </div>

              {/* Bottom Active Glow Indicator */}
              {isActive && (
                <div className="absolute inset-x-6 -bottom-[1px] h-[2px] bg-gradient-to-r from-transparent via-amber-400 to-transparent" />
              )}
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
