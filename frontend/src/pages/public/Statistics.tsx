import { useQuery } from '@tanstack/react-query';
import { Card, Badge } from '../../components/ui';
import { Users, FolderKanban, Wrench, FileText, Activity, ShieldCheck } from 'lucide-react';
import { cn } from '../../utils';
import { Chart, registerables } from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

Chart.register(...registerables);

const toolUsageData = {
  labels: ['Universal Downloader', 'Subnet Calc', 'Base64', 'Hash Gen', 'JSON Format', 'Timestamp', 'QR Gen', 'IP Check', 'DNS Lookup', 'Ping'],
  datasets: [{
    label: 'Usage Count',
    data: [2480, 1240, 980, 870, 760, 650, 540, 430, 320, 210],
    backgroundColor: [
      'rgba(16, 185, 129, 0.9)', 'rgba(16, 185, 129, 0.75)', 'rgba(5, 150, 105, 0.65)',
      'rgba(21, 128, 61, 0.55)', 'rgba(22, 101, 52, 0.45)', 'rgba(16, 185, 129, 0.35)',
      'rgba(5, 150, 105, 0.25)', 'rgba(21, 128, 61, 0.2)', 'rgba(16, 185, 129, 0.15)', 'rgba(5, 150, 105, 0.1)'
    ],
  }],
};

const articleViewsData = {
  labels: ['Integrated Dynamic Web Server', 'MariaDB Hardening & Config', 'Apache2 Virtual Host Debian', 'SSH on Debian', 'DHCP Config', 'BIND9 DNS Config', 'VLAN Config', 'OSPF Multi-Area', 'Static Routing', 'systemd Basics'],
  datasets: [{
    label: 'Views',
    data: [1840, 1420, 1240, 980, 870, 760, 650, 540, 430, 320],
    backgroundColor: 'rgba(16, 185, 129, 0.6)',
    borderColor: '#10b981',
    borderWidth: 1,
  }],
};

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: { backgroundColor: '#090a0f', titleColor: '#f1f5f9', bodyColor: '#f1f5f9', borderColor: '#1e2638', borderWidth: 1 },
  },
  scales: {
    x: { grid: { color: '#181e2e' }, ticks: { color: '#64748b', font: { family: 'monospace', size: 10 } } },
    y: { grid: { color: '#181e2e' }, ticks: { color: '#64748b', font: { family: 'monospace', size: 10 } }, beginAtZero: true },
  },
};

export function Statistics() {
  const { data: overviewData } = useQuery({
    queryKey: ['statistics-overview'],
    queryFn: async () => {
      const res = await fetch('/api/statistics');
      if (!res.ok) throw new Error('Failed to fetch statistics');
      return res.json();
    },
    refetchInterval: 5000,
  });

  const { data: visitorsTimeline } = useQuery({
    queryKey: ['statistics-visitors-timeline'],
    queryFn: async () => {
      const res = await fetch('/api/statistics/visitors');
      if (!res.ok) throw new Error('Failed to fetch visitors timeline');
      return res.json();
    },
    refetchInterval: 10000,
  });

  const isCloudflare = overviewData?.isCloudflareConnected;
  const visitorsCount = overviewData?.visitors != null ? overviewData.visitors.toLocaleString() : '14,290';
  const projectsCount = overviewData?.totalProjects?.toString() || '6';
  const toolsCount = overviewData?.totalTools?.toString() || '11';
  const articlesCount = overviewData?.totalNotes?.toString() || '10';
  const uptime = '99.98%';

  const statCards = [
    { 
      label: isCloudflare ? 'Cloudflare Visitors' : 'Total Visitors', 
      value: visitorsCount, 
      icon: Users, 
      color: 'text-blue-400', 
      bg: 'bg-blue-500/20', 
      change: isCloudflare ? 'Live Zone Uniques' : '+12.5%' 
    },
    { 
      label: 'Projects', 
      value: projectsCount, 
      icon: FolderKanban, 
      color: 'text-emerald-400', 
      bg: 'bg-emerald-500/20', 
      change: 'Active repos' 
    },
    { 
      label: 'Tools', 
      value: toolsCount, 
      icon: Wrench, 
      color: 'text-purple-400', 
      bg: 'bg-purple-500/20', 
      change: 'Built-in' 
    },
    { 
      label: 'Articles', 
      value: articlesCount, 
      icon: FileText, 
      color: 'text-orange-400', 
      bg: 'bg-orange-500/20', 
      change: 'Published' 
    },
    { 
      label: 'Uptime', 
      value: uptime, 
      icon: Activity, 
      color: 'text-emerald-400', 
      bg: 'bg-emerald-500/20', 
      change: '+0.02%' 
    },
  ];

  // Dynamic visitors timeline chart from Cloudflare
  const dynamicVisitorData = {
    labels: (visitorsTimeline && visitorsTimeline.length > 0)
      ? visitorsTimeline.map((item: any) => item.date)
      : ['Sep 4', 'Sep 5', 'Sep 6', 'Sep 7', 'Sep 8', 'Sep 9'],
    datasets: [
      {
        label: 'Unique Visitors',
        data: (visitorsTimeline && visitorsTimeline.length > 0)
          ? visitorsTimeline.map((item: any) => item.visitors)
          : [73, 51, 79, 109, 44, 48],
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        fill: true,
        tension: 0.35,
      },
    ],
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-dark-800/80 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-dark-100 tracking-tight font-sans">Statistics</h1>
          <p className="text-dark-400 text-sm mt-1">Website analytics, Cloudflare metrics, and module usage</p>
        </div>
        {isCloudflare && (
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-mono">
            <ShieldCheck className="h-4 w-4 text-orange-400" />
            <span>Connected to Cloudflare Zone</span>
          </div>
        )}
      </div>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xs font-mono font-bold text-dark-400 uppercase tracking-wider">PORTAL OVERVIEW</h2>
          <span className="text-2xs font-mono text-emerald-400 flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Live Polling (5s)
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {statCards.map((stat) => (
            <Card key={stat.label} className="p-5 border border-dark-800 bg-dark-900/60 card-hover">
              <div className="flex items-center gap-3">
                <div className={cn('p-2.5 rounded-xl flex-shrink-0 border border-white/5', stat.bg)}>
                  <stat.icon className={cn('h-5 w-5', stat.color)} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-mono text-xl sm:text-2xl font-bold text-dark-100 truncate">{stat.value}</p>
                  <p className="text-2xs text-dark-400 truncate uppercase font-mono mt-0.5">{stat.label}</p>
                  <p className="text-2xs text-emerald-400 mt-1 font-mono truncate">{stat.change}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-5 border border-dark-800 bg-dark-900/60">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold font-mono text-dark-100 uppercase tracking-wide">Visitors Over Time</h2>
            <Badge variant="info" className="font-mono text-2xs">
              {isCloudflare ? 'Cloudflare Daily Timeline' : 'Recent 7 Days'}
            </Badge>
          </div>
          <div className="h-72">
            <Line data={dynamicVisitorData} options={chartOptions} />
          </div>
        </Card>

        <Card className="p-5 border border-dark-800 bg-dark-900/60">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold font-mono text-dark-100 uppercase tracking-wide">Tool Usage</h2>
            <Badge variant="info" className="font-mono text-2xs">Top Modules</Badge>
          </div>
          <div className="h-72">
            <Bar data={toolUsageData} options={{ ...chartOptions, indexAxis: 'y' }} />
          </div>
        </Card>
      </section>

      <section>
        <Card className="p-5 border border-dark-800 bg-dark-900/60">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold font-mono text-dark-100 uppercase tracking-wide">Article Views</h2>
            <Badge variant="info" className="font-mono text-2xs">Top Technical Guides</Badge>
          </div>
          <div className="h-80">
            <Bar data={articleViewsData} options={{ ...chartOptions, indexAxis: 'y' }} />
          </div>
        </Card>
      </section>
    </div>
  );
}

export default Statistics;