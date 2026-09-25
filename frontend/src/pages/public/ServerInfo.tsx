import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, Button } from '../../components/ui';
import {
  Cpu, HardDrive, MemoryStick, Wifi, Activity, Server,
  TrendingUp, RefreshCw, Thermometer, Monitor, Zap
} from 'lucide-react';
import { cn, formatUptime } from '../../utils';

function formatBitsPerSecond(bits: number): string {
  if (bits < 1000) return `${bits.toFixed(0)} bps`;
  if (bits < 1_000_000) return `${(bits / 1000).toFixed(1)} Kbps`;
  if (bits < 1_000_000_000) return `${(bits / 1_000_000).toFixed(1)} Mbps`;
  return `${(bits / 1_000_000_000).toFixed(2)} Gbps`;
}

function ProgressBar({ value, color }: { value: number; color: string }) {
  const clampedValue = Math.min(Math.max(value, 0), 100);
  const colorClass = {
    blue: 'from-blue-500 to-blue-400',
    green: 'from-emerald-500 to-teal-400',
    orange: 'from-amber-500 to-yellow-400',
    red: 'from-red-500 to-rose-400',
    cyan: 'from-cyan-500 to-cyan-400',
    purple: 'from-purple-500 to-purple-400',
  }[color] || 'from-emerald-500 to-emerald-400';

  return (
    <div className="h-2 bg-dark-800 rounded-full overflow-hidden">
      <div
        className={`h-full bg-gradient-to-r ${colorClass} rounded-full transition-all duration-700 ease-out`}
        style={{ width: `${clampedValue}%` }}
      />
    </div>
  );
}

function MetricCard({ label, value, icon: Icon, color, bg, progress }: {
  label: string; value: string; icon: React.ElementType;
  color: string; bg: string; progress?: number;
}) {
  return (
    <Card className="p-5 bg-dark-900/60 border border-dark-800 hover:border-emerald-500/30 transition-all">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={cn('p-2.5 rounded-xl border border-white/5', bg)}>
            <Icon className={cn('h-5 w-5', color)} />
          </div>
          <div>
            <p className="text-xs font-mono text-dark-400 uppercase tracking-wider">{label}</p>
            <p className={cn('font-mono text-xl font-bold mt-0.5', color)}>{value}</p>
          </div>
        </div>
        {progress !== undefined && (
          <span className="text-xs font-mono text-dark-500">{Math.round(progress)}%</span>
        )}
      </div>
      {progress !== undefined && (
        <ProgressBar value={progress} color={color.replace('text-', '').replace('-400', '').replace('-500', '')} />
      )}
    </Card>
  );
}

export function ServerInfo() {
  const [autoRefresh, setAutoRefresh] = useState(true);
  const refreshInterval = 3000;

  const { data, isLoading, error, refetch, dataUpdatedAt } = useQuery({
    queryKey: ['server-live'],
    queryFn: async () => {
      const res = await fetch('/api/server/stats');
      if (!res.ok) throw new Error('Failed to fetch');
      return res.json();
    },
    refetchInterval: autoRefresh ? refreshInterval : false,
    refetchIntervalInBackground: false,
    staleTime: 1000,
  });

  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  useEffect(() => {
    if (dataUpdatedAt) setLastUpdate(new Date(dataUpdatedAt));
  }, [dataUpdatedAt]);

  const metrics = [
    { label: 'CPU Usage', value: `${data?.cpuUsage?.toFixed(1) || '0'}%`, icon: Cpu, color: 'text-blue-400', bg: 'bg-blue-500/20', progress: data?.cpuUsage || 0 },
    { label: 'RAM Usage', value: `${data?.ramUsage?.toFixed(1) || '0'}%`, icon: MemoryStick, color: 'text-emerald-400', bg: 'bg-emerald-500/20', progress: data?.ramUsage || 0 },
    { label: 'Disk Usage', value: `${data?.diskUsage?.toFixed(1) || '0'}%`, icon: HardDrive, color: 'text-amber-400', bg: 'bg-amber-500/20', progress: data?.diskUsage || 0 },
    { label: 'CPU Temp', value: `${data?.cpuTemp?.toFixed(1) || '0'}°C`, icon: Thermometer, color: 'text-rose-400', bg: 'bg-rose-500/20', progress: Math.min(((data?.cpuTemp || 0) / 100) * 100, 100) },
    { label: 'Download', value: formatBitsPerSecond((data?.networkDown || 0) * 8) + '/s', icon: Wifi, color: 'text-cyan-400', bg: 'bg-cyan-500/20' },
    { label: 'Upload', value: formatBitsPerSecond((data?.networkUp || 0) * 8) + '/s', icon: Activity, color: 'text-purple-400', bg: 'bg-purple-500/20' },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-10 animate-in pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-dark-800/80 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-dark-100 tracking-tight font-sans">Server Information</h1>
          <p className="text-dark-400 text-sm mt-1">Real-time system telemetry, network bandwidth, and hardware architecture</p>
        </div>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-xs font-mono text-dark-300 cursor-pointer">
            <div
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={cn(
                'relative w-10 h-5 rounded-full transition-colors cursor-pointer',
                autoRefresh ? 'bg-emerald-500' : 'bg-dark-700'
              )}
            >
              <div className={cn(
                'absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all',
                autoRefresh ? 'left-5.5 translate-x-0.5' : 'left-0.5'
              )} />
            </div>
            <span className={autoRefresh ? 'text-emerald-400' : 'text-dark-500'}>
              {autoRefresh ? `Live (${refreshInterval/1000}s)` : 'Paused'}
            </span>
          </label>
          <Button variant="secondary" size="sm" onClick={() => refetch()} className="text-xs font-mono">
            <RefreshCw className="h-3.5 w-3.5 mr-1" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Live indicator */}
      <div className="flex items-center gap-2 text-2xs font-mono text-dark-500">
        <div className={cn('w-2 h-2 rounded-full', autoRefresh ? 'bg-emerald-400 animate-pulse' : 'bg-dark-600')} />
        {lastUpdate ? `Last updated: ${lastUpdate.toLocaleTimeString()}` : 'Connecting...'}
      </div>

      {/* Live Metrics */}
      <section>
        <h2 className="text-xs font-mono font-bold text-dark-400 uppercase tracking-wider mb-4">LIVE METRICS TELEMETRY</h2>
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="p-5 animate-pulse bg-dark-900/60 border border-dark-800">
                <div className="h-12 bg-dark-800 rounded" />
              </Card>
            ))}
          </div>
        ) : error ? (
          <Card className="p-6 text-center bg-dark-900/60 border border-dark-800">
            <p className="text-rose-400 mb-4 text-sm">Failed to load live metrics</p>
            <Button onClick={() => refetch()}>Retry</Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {metrics.map((m) => (
              <MetricCard key={m.label} {...m} />
            ))}
          </div>
        )}
      </section>

      {/* Resource Usage Summary */}
      {data && (
        <section>
          <h2 className="text-xs font-mono font-bold text-dark-400 uppercase tracking-wider mb-4">RESOURCE UTILIZATION</h2>
          <Card className="p-6 bg-dark-900/60 border border-dark-800">
            <div className="space-y-5">
              {[
                { label: 'CPU Utilization', value: data.cpuUsage?.toFixed(1), color: 'blue' },
                { label: 'RAM Utilization', value: data.ramUsage?.toFixed(1), color: 'green' },
                { label: 'Disk Utilization', value: data.diskUsage?.toFixed(1), color: 'orange' },
              ].map(({ label, value, color }) => (
                <div key={label}>
                  <div className="flex justify-between text-xs mb-1.5 font-mono">
                    <span className="text-dark-400">{label}</span>
                    <span className="text-dark-100 font-semibold">{value}%</span>
                  </div>
                  <ProgressBar value={parseFloat(value || '0')} color={color} />
                </div>
              ))}
            </div>
          </Card>
        </section>
      )}

      {/* System Details */}
      <section>
        <h2 className="text-xs font-mono font-bold text-dark-400 uppercase tracking-wider mb-4">SYSTEM ENVIRONMENT</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* OS & Runtime */}
          <Card className="p-5 bg-dark-900/60 border border-dark-800">
            <h3 className="font-semibold mb-4 flex items-center gap-2 text-dark-100 font-mono text-sm">
              <Server className="h-4 w-4 text-emerald-400" /> Host System
            </h3>
            <div className="space-y-3 text-xs">
              {[
                { label: 'OS', value: 'Debian GNU/Linux 13 (trixie)' },
                { label: 'Kernel', value: '6.12.94+deb13-amd64' },
                { label: 'Architecture', value: 'x86_64' },
                { label: 'Uptime', value: data?.uptime ? formatUptime(data.uptime) : 'N/A' },
                { label: 'Processes', value: data?.processCount?.toString() || 'N/A' },
                { label: 'Last Updated', value: lastUpdate?.toLocaleTimeString() || 'N/A' },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between gap-4 py-1 border-b border-dark-800">
                  <span className="text-dark-500 shrink-0 font-mono">{label}</span>
                  <span className="font-mono text-dark-200 text-right truncate">{value}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Network */}
          <Card className="p-5 bg-dark-900/60 border border-dark-800">
            <h3 className="font-semibold mb-4 flex items-center gap-2 text-dark-100 font-mono text-sm">
              <TrendingUp className="h-4 w-4 text-cyan-400" /> Network Throughput (Live)
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-cyan-500/10 border border-cyan-500/20 rounded-lg">
                <div className="flex items-center gap-2">
                  <Wifi className="h-4 w-4 text-cyan-400" />
                  <span className="text-xs font-mono text-dark-300">Download Rate</span>
                </div>
                <span className="font-mono text-base font-bold text-cyan-400">
                  {formatBitsPerSecond((data?.networkDown || 0) * 8)}/s
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-purple-400" />
                  <span className="text-xs font-mono text-dark-300">Upload Rate</span>
                </div>
                <span className="font-mono text-base font-bold text-purple-400">
                  {formatBitsPerSecond((data?.networkUp || 0) * 8)}/s
                </span>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Hardware Specs - Actual Laptop */}
      <section>
        <h2 className="text-xs font-mono font-bold text-dark-400 uppercase tracking-wider mb-4">HARDWARE ARCHITECTURE</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {/* CPU */}
          <Card className="p-5 bg-dark-900/60 border border-dark-800">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 bg-blue-500/10 rounded-xl text-blue-400 border border-blue-500/20">
                <Cpu className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xs font-mono text-dark-500 uppercase tracking-wider">Processor</p>
                <p className="font-semibold text-dark-100 text-sm">CPU</p>
              </div>
            </div>
            <div className="space-y-2 text-xs">
              {[
                { label: 'Model', value: 'Intel Core i3-1115G4' },
                { label: 'Base Clock', value: '3.00 GHz' },
                { label: 'Max Turbo', value: '4.10 GHz' },
                { label: 'Cores / Threads', value: '2 Cores / 4 Threads' },
                { label: 'Lithography', value: '10nm SuperFin' },
                { label: 'Cache', value: '6 MB Intel Smart Cache' },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between gap-2 py-0.5 border-b border-dark-800/60">
                  <span className="text-dark-500 font-mono">{label}</span>
                  <span className="font-mono text-dark-200 text-right">{value}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* RAM */}
          <Card className="p-5 bg-dark-900/60 border border-dark-800">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 bg-emerald-500/10 rounded-xl text-emerald-400 border border-emerald-500/20">
                <MemoryStick className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xs font-mono text-dark-500 uppercase tracking-wider">Memory</p>
                <p className="font-semibold text-dark-100 text-sm">RAM</p>
              </div>
            </div>
            <div className="space-y-2 text-xs">
              {[
                { label: 'Total', value: '24 GB' },
                { label: 'Type', value: 'DDR4' },
                { label: 'Speed', value: '3200 MHz' },
                { label: 'Slots', value: '2 x SO-DIMM' },
                { label: 'Max Support', value: '32 GB' },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between gap-2 py-0.5 border-b border-dark-800/60">
                  <span className="text-dark-500 font-mono">{label}</span>
                  <span className="font-mono text-dark-200 text-right">{value}</span>
                </div>
              ))}
              <div className="mt-3 pt-2 border-t border-dark-800">
                <div className="flex justify-between text-2xs mb-1 font-mono">
                  <span className="text-dark-500">Active Usage</span>
                  <span className="text-emerald-400">
                    ~{((data?.ramUsage || 0) / 100 * 24).toFixed(1)} GB / 24 GB
                  </span>
                </div>
                <ProgressBar value={data?.ramUsage || 0} color="green" />
              </div>
            </div>
          </Card>

          {/* Storage */}
          <Card className="p-5 bg-dark-900/60 border border-dark-800">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 bg-amber-500/10 rounded-xl text-amber-400 border border-amber-500/20">
                <HardDrive className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xs font-mono text-dark-500 uppercase tracking-wider">Storage</p>
                <p className="font-semibold text-dark-100 text-sm">Disk</p>
              </div>
            </div>
            <div className="space-y-2.5 text-xs">
              <div className="p-2.5 bg-dark-950/60 rounded-lg border border-dark-800">
                <p className="text-dark-300 font-medium mb-1 font-mono text-2xs text-emerald-400">Primary (NVMe)</p>
                {[
                  { label: 'Model', value: 'Intel SSD 512G' },
                  { label: 'Capacity', value: '476.9 GB' },
                  { label: 'Interface', value: 'PCIe NVMe M.2' },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between gap-2 text-2xs mt-0.5 font-mono">
                    <span className="text-dark-500">{label}</span>
                    <span className="text-dark-300">{value}</span>
                  </div>
                ))}
              </div>
              <div className="p-2.5 bg-dark-950/60 rounded-lg border border-dark-800">
                <p className="text-dark-300 font-medium mb-1 font-mono text-2xs text-cyan-400">Secondary (SATA)</p>
                {[
                  { label: 'Model', value: 'T-FORCE 1TB' },
                  { label: 'Capacity', value: '953.9 GB' },
                  { label: 'Interface', value: 'SATA III' },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between gap-2 text-2xs mt-0.5 font-mono">
                    <span className="text-dark-500">{label}</span>
                    <span className="text-dark-300">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* GPU */}
          <Card className="p-5 bg-dark-900/60 border border-dark-800">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 bg-purple-500/10 rounded-xl text-purple-400 border border-purple-500/20">
                <Monitor className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xs font-mono text-dark-500 uppercase tracking-wider">Graphics</p>
                <p className="font-semibold text-dark-100 text-sm">GPU</p>
              </div>
            </div>
            <div className="space-y-2 text-xs">
              {[
                { label: 'Model', value: 'Intel UHD Graphics' },
                { label: 'GPU Name', value: 'Tiger Lake GT2 G4' },
                { label: 'Type', value: 'Integrated' },
                { label: 'VRAM', value: 'Shared (up to 8GB)' },
                { label: 'API', value: 'OpenGL 4.6 / Vulkan 1.2' },
                { label: 'Display', value: '14" FHD 1920×1080' },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between gap-2 py-0.5 border-b border-dark-800/60 font-mono">
                  <span className="text-dark-500">{label}</span>
                  <span className="text-dark-200 text-right">{value}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Laptop Info */}
          <Card className="p-5 bg-dark-900/60 border border-dark-800">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 bg-emerald-500/10 rounded-xl text-emerald-400 border border-emerald-500/20">
                <Zap className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xs font-mono text-dark-500 uppercase tracking-wider">Device</p>
                <p className="font-semibold text-dark-100 text-sm">Laptop</p>
              </div>
            </div>
            <div className="space-y-2 text-xs">
              {[
                { label: 'Brand', value: 'Lenovo' },
                { label: 'Model', value: 'IdeaPad 3 14ITL6' },
                { label: 'ID', value: '82H7' },
                { label: 'Screen', value: '14" FHD IPS' },
                { label: 'Battery', value: '38 Wh Li-Ion' },
                { label: 'Weight', value: '~1.65 kg' },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between gap-2 py-0.5 border-b border-dark-800/60 font-mono">
                  <span className="text-dark-500">{label}</span>
                  <span className="text-dark-200 text-right">{value}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Network Interfaces */}
          <Card className="p-5 bg-dark-900/60 border border-dark-800">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 bg-cyan-500/10 rounded-xl text-cyan-400 border border-cyan-500/20">
                <Wifi className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xs font-mono text-dark-500 uppercase tracking-wider">Connectivity</p>
                <p className="font-semibold text-dark-100 text-sm">Network</p>
              </div>
            </div>
            <div className="space-y-2 text-xs">
              {[
                { label: 'WiFi', value: 'Wireless (802.11ac)' },
                { label: 'Ethernet', value: 'Gigabit Ethernet' },
                { label: 'VPN', value: 'Protected WireGuard/VPN' },
                { label: 'Bridge', value: 'Docker Container Bridge' },
                { label: 'Bluetooth', value: 'Integrated Bluetooth 5.0' },
                { label: 'USB', value: 'USB 3.2 / USB-C' },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between gap-2 py-0.5 border-b border-dark-800/60 font-mono">
                  <span className="text-dark-500">{label}</span>
                  <span className="text-dark-200 text-right text-2xs">{value}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}

export default ServerInfo;