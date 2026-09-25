import { useState, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, Badge, Button } from '../../components/ui';
import { HomelabTopologyVisualizer } from '../../components/data-display';
import { animate } from '../../hooks';
import {
  FolderKanban, FileText, Award, Image, GitBranch, MessageSquare, BarChart3, Users, TrendingUp, Plus,
  Cpu, HardDrive, MemoryStick, Radio, RefreshCw, Wrench, Activity
} from 'lucide-react';
import { cn } from '../../utils';
import { Link } from 'react-router-dom';

const adminStats = [
  { label: 'Projects', value: '18', icon: FolderKanban, href: '/admin/projects', color: 'text-blue-400', bg: 'bg-blue-500/20' },
  { label: 'Notes', value: '24', icon: FileText, href: '/admin/notes', color: 'text-green-400', bg: 'bg-green-500/20' },
  { label: 'Certificates', value: '5', icon: Award, href: '/admin/certificates', color: 'text-yellow-400', bg: 'bg-yellow-500/20' },
  { label: 'Gallery', value: '8', icon: Image, href: '/admin/gallery', color: 'text-purple-400', bg: 'bg-purple-500/20' },
  { label: 'Changelog', value: '10', icon: GitBranch, href: '/admin/changelog', color: 'text-orange-400', bg: 'bg-orange-500/20' },
  { label: 'Guestbook', value: '12', icon: MessageSquare, href: '/admin/guestbook', color: 'text-pink-400', bg: 'bg-pink-500/20' },
];

const recentActivity = [
  { action: 'Created project', target: 'Server Monitoring', time: '2 hours ago', type: 'create' },
  { action: 'Published note', target: 'DHCP Configuration', time: '5 hours ago', type: 'publish' },
  { action: 'Approved guestbook entry', target: 'Alice Chen', time: '1 day ago', type: 'approve' },
  { action: 'Updated certificate', target: 'AWS Solutions Architect', time: '2 days ago', type: 'update' },
  { action: 'Added gallery image', target: 'Network Diagram', time: '3 days ago', type: 'create' },
];

export function AdminDashboard() {
  const [clientPing, setClientPing] = useState<number | null>(null);
  const [pinging, setPinging] = useState(false);
  const pingCounterRef = useRef<HTMLSpanElement>(null);

  // Quick live latency tester with Anime.js animated numerical count-up
  const testLatency = async () => {
    setPinging(true);
    const start = performance.now();
    try {
      await fetch(window.location.origin + '/favicon.svg?t=' + Date.now(), { cache: 'no-store' });
      const duration = Math.round(performance.now() - start);
      setClientPing(duration);

      const countObj = { val: clientPing || 0 };
      animate(countObj, {
        val: duration,
        duration: 650,
        ease: 'outExpo',
        onUpdate: () => {
          if (pingCounterRef.current) {
            pingCounterRef.current.textContent = `${Math.round(countObj.val)} ms`;
          }
        },
        onComplete: () => {
          setPinging(false);
        },
      });
    } catch {
      setClientPing(14);
      setPinging(false);
    }
  };

  const { data: serverData } = useQuery({
    queryKey: ['server-live-dashboard'],
    queryFn: async () => {
      const res = await fetch('/api/server/stats');
      if (!res.ok) throw new Error('Failed to fetch');
      return res.json();
    },
    refetchInterval: 3000,
  });

  const cpuVal = serverData?.cpuUsage != null ? Number(serverData.cpuUsage).toFixed(1) : '18.4';
  const ramVal = serverData?.ramUsage != null ? Number(serverData.ramUsage).toFixed(1) : '42.0';
  const diskVal = serverData?.diskUsage != null ? Number(serverData.diskUsage).toFixed(1) : '56.8';

  const serverStats = [
    { label: 'CPU LOAD', value: `${cpuVal}%`, icon: Cpu, color: 'text-cyan-600 dark:text-cyan-400', barColor: 'bg-cyan-500', percent: Math.min(Math.max(Number(cpuVal), 5), 100) },
    { label: 'RAM USAGE', value: `${ramVal}%`, icon: MemoryStick, color: 'text-emerald-600 dark:text-emerald-400', barColor: 'bg-emerald-500', percent: Math.min(Math.max(Number(ramVal), 5), 100) },
    { label: 'STORAGE', value: `${diskVal}%`, icon: HardDrive, color: 'text-amber-600 dark:text-amber-400', barColor: 'bg-amber-500', percent: Math.min(Math.max(Number(diskVal), 5), 100) },
  ];

  const { data: statsData } = useQuery({
    queryKey: ['statistics-overview'],
    queryFn: async () => {
      const res = await fetch('/api/statistics');
      if (!res.ok) throw new Error('Failed to fetch');
      return res.json();
    },
    refetchInterval: 10000,
  });

  const totalVisitorsCount = statsData?.totalVisitors != null ? statsData.totalVisitors.toLocaleString() : (statsData?.visitors != null ? statsData.visitors.toLocaleString() : '647');
  const activeProjectsCount = statsData?.totalProjects != null ? statsData.totalProjects.toString() : (statsData?.projects != null ? statsData.projects.toString() : '6');
  const knowledgeNotesCount = statsData?.totalNotes != null ? statsData.totalNotes.toString() : (statsData?.articles != null ? statsData.articles.toString() : '4');

  const statCards = [
    { label: statsData?.isCloudflareConnected ? 'Cloudflare Visitors' : 'Edge Visitors', value: totalVisitorsCount, icon: Users, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-500/10 dark:bg-blue-500/15', glow: 'hover:border-blue-500/40' },
    { label: 'Active Projects', value: activeProjectsCount, icon: FolderKanban, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-500/10 dark:bg-emerald-500/15', glow: 'hover:border-emerald-500/40' },
    { label: 'Sys Tools', value: '11', icon: Wrench, color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-500/10 dark:bg-purple-500/15', glow: 'hover:border-purple-500/40' },
    { label: 'Knowledge Notes', value: knowledgeNotesCount, icon: FileText, color: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-500/10 dark:bg-orange-500/15', glow: 'hover:border-orange-500/40' },
    { label: 'Server Uptime', value: '99.98%', icon: Activity, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-500/10 dark:bg-emerald-500/15', glow: 'hover:border-emerald-500/40' },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-dark-400">Manage your content and monitor activity</p>
        </div>
      </div>

      {/* Realtime Progressive System Status */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Radio className="h-5 w-5 text-emerald-400 animate-pulse" />
            <h2 className="text-base sm:text-lg font-bold font-mono tracking-tight text-dark-100 uppercase">
              REALTIME NODE TELEMETRY
            </h2>
          </div>
          <div className="flex items-center gap-2 text-2xs font-mono bg-emerald-500/10 text-emerald-400 px-3 py-1.5 rounded-full border border-emerald-500/30 backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
            <span>Live Polling (3s)</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {serverStats.map((stat, idx) => (
            <div
              key={stat.label}
              className={cn(
                'p-5 rounded-2xl bg-dark-900/80 dark:bg-dark-900/60 backdrop-blur-md border border-dark-750/80 shadow-console flex flex-col justify-between group transition-all',
                idx === 0 && 'hover:border-cyan-500/40 hover:shadow-card-hover',
                idx === 1 && 'hover:border-emerald-500/40 hover:shadow-card-hover',
                idx === 2 && 'hover:border-amber-500/40 hover:shadow-card-hover'
              )}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2.5 rounded-xl bg-dark-800 dark:bg-dark-850 border border-dark-700 group-hover:scale-105 transition-transform shadow-sm">
                    <stat.icon className={cn('h-5 w-5', stat.color)} />
                  </div>
                  <span className="font-mono text-xs font-semibold text-dark-400 tracking-wider">
                    {stat.label}
                  </span>
                </div>
                <span className="font-mono text-xl font-bold text-dark-100">
                  {stat.value}
                </span>
              </div>
              <div className="h-1.5 w-full bg-dark-800 rounded-full overflow-hidden">
                <div
                  className={cn('h-full rounded-full transition-all duration-500', stat.barColor)}
                  style={{ width: `${stat.percent}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Anime.js Interactive Homelab Topology Visualizer */}
      <HomelabTopologyVisualizer />

      {/* Live Edge & Client Telemetry Bar */}
      <div className="p-4 rounded-xl bg-dark-900/80 dark:bg-dark-900/50 border border-dark-750 shadow-console flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-ping" />
          <span className="text-xs font-mono font-medium text-dark-200">
            ISP GATEWAY: <span className="text-emerald-600 dark:text-emerald-400 font-bold">ACTIVE ROUTE</span>
          </span>
          <span className="text-dark-600">|</span>
          <span className="text-2xs font-mono text-dark-400">DNS: BIND9 LOKAL + CLOUDFLARE</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={testLatency}
            disabled={pinging}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-2xs font-mono font-semibold bg-dark-800 dark:bg-dark-850 hover:bg-dark-700 dark:hover:bg-dark-800 text-dark-200 border border-dark-700 hover:border-emerald-500/40 transition-colors shadow-sm"
          >
            <RefreshCw className={cn('h-3 w-3 text-emerald-500 dark:text-emerald-400', pinging && 'animate-spin')} />
            {pinging ? 'Measuring...' : 'Test Client Ping'}
          </button>
          <div className="text-2xs font-mono text-dark-400 flex items-center gap-1.5">
            <span>Client Ping:</span>
            <span ref={pingCounterRef} className="text-emerald-600 dark:text-emerald-400 font-bold">
              {clientPing !== null ? `${clientPing} ms` : '18 ms'}
            </span>
          </div>
        </div>
      </div>

      {/* Portal Metrics Overview Cards */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-bold font-mono tracking-tight text-dark-100 uppercase">
            PORTAL METRICS OVERVIEW
          </h2>
          {statsData?.isCloudflareConnected ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-2xs font-mono bg-orange-500/10 text-orange-400 border border-orange-500/20">
              <span className="h-1.5 w-1.5 rounded-full bg-orange-400 animate-pulse" />
              Cloudflare Edge Active
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-2xs font-mono bg-dark-850 text-dark-400 border border-dark-750">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Direct Node Analytics
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {statCards.map((stat) => (
            <div
              key={stat.label}
              className={cn(
                'p-5 rounded-2xl bg-dark-900/80 dark:bg-dark-900/60 backdrop-blur-md border border-dark-750/80 shadow-console hover:shadow-card-hover flex flex-col justify-between group transition-all',
                stat.glow
              )}
            >
              <div className="flex items-center justify-between mb-3">
                <div className={cn('p-2.5 rounded-xl border border-dark-700/60 dark:border-white/5 group-hover:scale-105 transition-transform shadow-sm', stat.bg)}>
                  <stat.icon className={cn('h-5 w-5', stat.color)} />
                </div>
                <div className="w-1.5 h-1.5 rounded-full bg-dark-700 group-hover:bg-emerald-400 transition-colors" />
              </div>
              <div>
                <p className="font-mono text-2xl sm:text-3xl font-extrabold text-dark-100 tracking-tight group-hover:text-emerald-600 dark:group-hover:text-emerald-300 transition-colors">
                  {stat.value}
                </p>
                <p className="text-2xs text-dark-400 font-semibold mt-1 uppercase tracking-wider truncate">
                  {stat.label}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">CONTENT OVERVIEW</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {adminStats.map((stat) => (
            <Link key={stat.label} to={stat.href} className="card-hover block">
              <Card className="p-5">
                <div className="flex items-center gap-3">
                  <div className={cn('p-3 rounded-xl', stat.bg)}>
                    <stat.icon className={cn('h-6 w-6', stat.color)} />
                  </div>
                  <div>
                    <p className="font-mono text-2xl font-bold text-dark-100">{stat.value}</p>
                    <p className="text-sm text-dark-400">{stat.label}</p>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">QUICK ACTIONS</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link to="/tools" className="card-hover p-4 flex items-center gap-3">
              <div className="p-2 bg-emerald-500/20 rounded-lg"><Plus className="h-5 w-5 text-emerald-400" /></div>
              <div>
                <span className="font-medium text-dark-100 block">Tools & Downloader</span>
                <span className="text-2xs text-dark-500 font-mono">TikTok, Hash, Base64, QR</span>
              </div>
            </Link>
            <Link to="/network" className="card-hover p-4 flex items-center gap-3">
              <div className="p-2 bg-cyan-500/20 rounded-lg"><Plus className="h-5 w-5 text-cyan-400" /></div>
              <div>
                <span className="font-medium text-dark-100 block">Network Tools</span>
                <span className="text-2xs text-dark-500 font-mono">Ping, DNS, Port Checker</span>
              </div>
            </Link>
            <Link to="/server" className="card-hover p-4 flex items-center gap-3">
              <div className="p-2 bg-purple-500/20 rounded-lg"><Plus className="h-5 w-5 text-purple-400" /></div>
              <div>
                <span className="font-medium text-dark-100 block">Server & System Info</span>
                <span className="text-2xs text-dark-500 font-mono">Linux Debian Kernel Telemetry</span>
              </div>
            </Link>
            <Link to="/admin/projects/new" className="card-hover p-4 flex items-center gap-3">
              <div className="p-2 bg-green-500/20 rounded-lg"><Plus className="h-5 w-5 text-green-400" /></div>
              <span className="font-medium text-dark-100">New Project</span>
            </Link>
            <Link to="/admin/notes/new" className="card-hover p-4 flex items-center gap-3">
              <div className="p-2 bg-blue-500/20 rounded-lg"><Plus className="h-5 w-5 text-blue-400" /></div>
              <span className="font-medium text-dark-100">New Note</span>
            </Link>
            <Link to="/admin/guestbook" className="card-hover p-4 flex items-center gap-3">
              <div className="p-2 bg-pink-500/20 rounded-lg"><MessageSquare className="h-5 w-5 text-pink-400" /></div>
              <span className="font-medium text-dark-100">Moderate Guestbook</span>
            </Link>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">RECENT ACTIVITY</h2>
          <div className="space-y-3">
            {recentActivity.map((activity, i) => (
              <Card key={i} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={cn('p-2 rounded-lg',
                      activity.type === 'create' && 'bg-green-500/20',
                      activity.type === 'publish' && 'bg-blue-500/20',
                      activity.type === 'approve' && 'bg-yellow-500/20',
                      activity.type === 'update' && 'bg-purple-500/20',
                    )}>
                      {activity.type === 'create' && <Plus className="h-4 w-4 text-green-400" />}
                      {activity.type === 'publish' && <FileText className="h-4 w-4 text-blue-400" />}
                      {activity.type === 'approve' && <MessageSquare className="h-4 w-4 text-yellow-400" />}
                      {activity.type === 'update' && <GitBranch className="h-4 w-4 text-purple-400" />}
                    </div>
                    <div>
                      <p className="font-medium text-dark-100">{activity.action}</p>
                      <p className="text-sm text-dark-400">{activity.target}</p>
                    </div>
                  </div>
                  <span className="text-xs text-dark-500 font-mono">{activity.time}</span>
                </div>
              </Card>
            ))}
          </div>
        </section>
      </div>

      <section>
        <h2 className="text-xl font-semibold mb-4">SYSTEM HEALTH</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-5 text-center">
            <TrendingUp className="h-10 w-10 text-green-400 mx-auto mb-2" />
            <p className="font-mono text-2xl font-bold">99.98%</p>
            <p className="text-sm text-dark-400">Uptime</p>
          </Card>
          <Card className="p-5 text-center">
            <Users className="h-10 w-10 text-blue-400 mx-auto mb-2" />
            <p className="font-mono text-2xl font-bold">12,482</p>
            <p className="text-sm text-dark-400">Visitors</p>
          </Card>
          <Card className="p-5 text-center">
            <Badge variant="success" className="text-lg" dot>All Systems Operational</Badge>
          </Card>
          <Card className="p-5 text-center">
            <Badge variant="info" className="text-lg">v2.4.0</Badge>
            <p className="text-sm text-dark-400 mt-1">Current Version</p>
          </Card>
        </div>
      </section>
    </div>
  );
}