import React from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Activity,
  Server,
  Terminal,
  BarChart3,
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
  step: string;
  label: string;
  shortLabel: string;
  icon: React.ElementType;
  badgeClass: string;
  description: string;
}

const TABS: TabItem[] = [
  {
    id: 'status',
    step: '01',
    label: 'Status Layanan',
    shortLabel: 'Status',
    icon: Activity,
    badgeClass: 'bg-[#4ED69E]/15 text-[#4ED69E] border-[#4ED69E]/40',
    description: 'Pemantauan kesehatan daemon, microservices, dan uptime ketersediaan.',
  },
  {
    id: 'server',
    step: '02',
    label: 'Hardware & Telemetri Server',
    shortLabel: 'Hardware',
    icon: Server,
    badgeClass: 'bg-[#5B8DEF]/15 text-[#5B8DEF] border-[#5B8DEF]/40',
    description: 'Metrik penggunaan CPU, RAM, Disk, suhu prosesor, dan bandwidth jaringan.',
  },
  {
    id: 'linux-setup',
    step: '03',
    label: 'Linux Setup & Dotfiles',
    shortLabel: 'Dotfiles',
    icon: Terminal,
    badgeClass: 'bg-[#F7C95C]/15 text-[#F7C95C] border-[#F7C95C]/40',
    description: 'Konfigurasi workstation harian, compositor Hyprland, terminal, dan dotfiles.',
  },
  {
    id: 'statistics',
    step: '04',
    label: 'Analytics & Pengunjung',
    shortLabel: 'Analytics',
    icon: BarChart3,
    badgeClass: 'bg-[#F26676]/15 text-[#F26676] border-[#F26676]/40',
    description: 'Tren statistik kunjungan, grafik pemakaian tools, dan pembaca artikel.',
  },
];

export function SystemOverview() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTabParam = searchParams.get('tab') as SystemTabKey | null;
  const activeTab: SystemTabKey =
    activeTabParam && ['status', 'server', 'linux-setup', 'statistics'].includes(activeTabParam)
      ? activeTabParam
      : 'status';

  const setActiveTab = (tab: SystemTabKey) => {
    setSearchParams({ tab });
  };

  useDocumentTitle('System Overview & Telemetry Hub');

  return (
    <div className="space-y-8 animate-in pb-16">
      {/* 1. Mega Project Nocturne Editorial Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/[0.06] pb-6">
        <div>
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-medium text-[#F4F3F8] tracking-tight">
            System &amp;{' '}
            <span className="italic font-normal text-[#D2D8F0]">Infrastructure Center</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#8E9AB5] mt-2 max-w-3xl font-sans leading-relaxed">
            Pusat terpadu informasi infrastruktur: pantau status server, konsumsi hardware,
            konfigurasi workstation Linux, dan statistik pengunjung dalam satu dashboard
            terintegrasi.
          </p>
        </div>
      </div>

      {/* 2. Mega Project 4-Card Semantic Navigation Tabs */}
      <div
        role="tablist"
        aria-label="System Infrastructure Tabs"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
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
                'group relative flex flex-col items-start p-5 rounded-2xl text-left transition-all duration-300 cursor-pointer outline-none border shadow-nocturneCard',
                isSelected
                  ? 'bg-[#121624] text-[#F4F3F8] border-white/25 ring-1 ring-white/15'
                  : 'bg-[#0D101A] text-[#8E9AB5] border-white/[0.08] hover:border-white/20 hover:text-[#F4F3F8]'
              )}
            >
              <div className="flex items-center justify-between w-full mb-4">
                <div
                  className={cn(
                    'w-9 h-9 rounded-xl border flex items-center justify-center font-mono text-xs font-bold',
                    tab.badgeClass
                  )}
                >
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              <div className="space-y-1">
                <div className="font-display font-medium text-sm sm:text-base text-[#F4F3F8] tracking-tight">
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span className="sm:hidden">{tab.shortLabel}</span>
                </div>
                <p className="text-xs font-sans text-[#8E9AB5] line-clamp-2 leading-relaxed">
                  {tab.description}
                </p>
              </div>
            </button>
          );
        })}
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
