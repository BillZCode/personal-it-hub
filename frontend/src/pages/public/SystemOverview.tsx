import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Activity, 
  Server, 
  Terminal, 
  BarChart3, 
  Radio, 
  Sparkles,
  Layers,
  Cpu,
  RefreshCw
} from 'lucide-react';
import { useDocumentTitle } from '../../hooks';
import { SystemStatus } from './SystemStatus';
import { ServerInfo } from './ServerInfo';
import { LinuxSetup } from './LinuxSetup';
import { Statistics } from './Statistics';
import { cn } from '../../utils';

export type SystemTabKey = 'status' | 'server' | 'linux-setup' | 'statistics';

interface TabItem {
  id: SystemTabKey;
  label: string;
  shortLabel: string;
  icon: React.ElementType;
  badge?: string;
  description: string;
}

const TABS: TabItem[] = [
  {
    id: 'status',
    label: 'Status Layanan',
    shortLabel: 'Status',
    icon: Activity,
    badge: 'LIVE 99.98%',
    description: 'Pemantauan kesehatan daemon, microservices, dan uptime ketersediaan.',
  },
  {
    id: 'server',
    label: 'Hardware & Telemetri Server',
    shortLabel: 'Hardware',
    icon: Server,
    badge: 'DEBIAN 12',
    description: 'Metrik penggunaan CPU, RAM, Disk, suhu prosesor, dan bandwidth jaringan.',
  },
  {
    id: 'linux-setup',
    label: 'Linux Setup & Dotfiles',
    shortLabel: 'Dotfiles',
    icon: Terminal,
    badge: 'ARCH + HYPRLAND',
    description: 'Konfigurasi workstation harian, compositor Hyprland, terminal, dan dotfiles.',
  },
  {
    id: 'statistics',
    label: 'Analytics & Pengunjung',
    shortLabel: 'Analytics',
    icon: BarChart3,
    badge: 'REALTIME',
    description: 'Tren statistik kunjungan, grafik pemakaian tools, dan pembaca artikel.',
  },
];

export function SystemOverview() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTabParam = searchParams.get('tab') as SystemTabKey | null;
  const activeTab: SystemTabKey = (activeTabParam && ['status', 'server', 'linux-setup', 'statistics'].includes(activeTabParam))
    ? activeTabParam
    : 'status';

  const setActiveTab = (tab: SystemTabKey) => {
    setSearchParams({ tab });
  };

  useDocumentTitle('System Overview & Telemetry Hub');

  return (
    <div className="space-y-8 animate-in pb-16">
      {/* 1. Header Command Hub */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-dark-800/80 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-2xs font-mono font-bold uppercase tracking-wider bg-violet-500/10 text-violet-400 border border-violet-500/25">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              INFRASTRUCTURE COMMAND CENTER
            </span>
            <span className="text-2xs font-mono text-dark-500 hidden sm:inline">
              NODE: DEBIAN 12 / ARCH LINUX
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-dark-100 tracking-tight font-sans">
            System & Infrastructure Center
          </h1>
          <p className="text-xs sm:text-sm text-dark-400 mt-1 max-w-3xl font-sans leading-relaxed">
            Pusat terpadu informasi infrastruktur: pantau status server, konsumsi hardware, konfigurasi workstation Linux, dan statistik pengunjung dalam satu dashboard terintegrasi.
          </p>
        </div>

        {/* Status Pill */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-dark-900/80 border border-dark-750 text-2xs font-mono text-dark-300 shadow-inner">
            <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span className="text-dark-200 font-semibold">ALL NODES ONLINE</span>
          </div>
        </div>
      </div>

      {/* 2. Interactive Unified Navigation Tabs */}
      <div className="space-y-2">
        <div 
          role="tablist" 
          aria-label="System Infrastructure Tabs"
          className="grid grid-cols-2 md:grid-cols-4 gap-2.5 p-1.5 rounded-2xl bg-dark-900/60 border border-dark-800/80 backdrop-blur-xl"
        >
          {TABS.map((tab) => {
            const isSelected = activeTab === tab.id;
            const Icon = tab.icon;

            return (
              <button
                key={tab.id}
                role="tab"
                aria-selected={isSelected}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'group relative flex flex-col items-start p-3.5 sm:p-4 rounded-xl text-left transition-all duration-300 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-violet-500',
                  isSelected
                    ? 'bg-dark-950 text-dark-100 shadow-xl border border-violet-500/30'
                    : 'bg-transparent text-dark-400 hover:text-dark-200 hover:bg-dark-850/50'
                )}
              >
                {/* Active Indicator bar */}
                {isSelected && (
                  <div className="absolute top-0 inset-x-4 h-0.5 rounded-full bg-gradient-to-r from-violet-500 via-sky-400 to-indigo-500" />
                )}

                <div className="flex items-center justify-between w-full mb-2">
                  <div className={cn(
                    'p-2 rounded-lg transition-colors',
                    isSelected 
                      ? 'bg-violet-500/20 text-violet-400 border border-violet-500/30' 
                      : 'bg-dark-800/80 text-dark-400 group-hover:text-dark-200 group-hover:bg-dark-800'
                  )}>
                    <Icon className="w-4 h-4" />
                  </div>

                  {tab.badge && (
                    <span className={cn(
                      'text-[10px] font-mono px-2 py-0.5 rounded-md font-semibold tracking-wider',
                      isSelected
                        ? 'bg-violet-500/20 text-violet-300 border border-violet-500/30'
                        : 'bg-dark-800 text-dark-500 border border-dark-750'
                    )}>
                      {tab.badge}
                    </span>
                  )}
                </div>

                <div className="space-y-0.5">
                  <div className="font-bold text-xs sm:text-sm font-sans tracking-tight">
                    <span className="hidden sm:inline">{tab.label}</span>
                    <span className="sm:hidden">{tab.shortLabel}</span>
                  </div>
                  <p className="text-[11px] font-sans text-dark-500 line-clamp-1 hidden md:block">
                    {tab.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Tab Content Viewport */}
      <div className="transition-all duration-300">
        {activeTab === 'status' && (
          <div className="animate-in fade-in duration-300">
            <SystemStatus />
          </div>
        )}

        {activeTab === 'server' && (
          <div className="animate-in fade-in duration-300">
            <ServerInfo />
          </div>
        )}

        {activeTab === 'linux-setup' && (
          <div className="animate-in fade-in duration-300">
            <LinuxSetup />
          </div>
        )}

        {activeTab === 'statistics' && (
          <div className="animate-in fade-in duration-300">
            <Statistics />
          </div>
        )}
      </div>
    </div>
  );
}

export default SystemOverview;
