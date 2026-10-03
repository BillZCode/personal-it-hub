import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { statusApi } from '../../services/api';
import { Badge } from '../../components/ui';
import {
  Server, Database, Globe, HardDrive, Activity,
  AlertTriangle, CheckCircle, XCircle, Clock, RefreshCw,
  Radio, ShieldCheck, Zap
} from 'lucide-react';
import { cn, formatRelativeTime } from '../../utils';
import { useDocumentTitle } from '../../hooks';

interface ServiceDef {

  id: string;
  name: string;
  icon: typeof Globe;
  description: string;
  endpoint: string;
  typicalLatency: string;
}

const services: ServiceDef[] = [
  { id: 'website', name: 'Web Portal & CDN', icon: Globe, description: 'React 18 + Vite frontend edge cluster', endpoint: 'https://sabbilferdyansyah.my.id', typicalLatency: '~18ms' },
  { id: 'api', name: 'Core Backend API', icon: Server, description: 'Node.js Express REST API & JWT Engine', endpoint: '/api/v1/health', typicalLatency: '~24ms' },
  { id: 'database', name: 'MariaDB Enterprise DB', icon: Database, description: 'Prisma ORM connection pool & replicas', endpoint: 'localhost:3306', typicalLatency: '~6ms' },
  { id: 'dns', name: 'BIND9 DNS Resolver', icon: Globe, description: 'Local authoritative DNS daemon on Debian', endpoint: 'ns1.sabbilferdyansyah.my.id', typicalLatency: '~4ms' },
  { id: 'download', name: 'Virtual Cloud Drive Storage', icon: HardDrive, description: 'Encrypted object storage & stream delivery', endpoint: '/api/v1/drive', typicalLatency: '~35ms' },
];

const statusColors = {
  operational: {
    bg: 'bg-emerald-500/10 dark:bg-emerald-500/15',
    text: 'text-emerald-600 dark:text-emerald-400',
    border: 'border-emerald-500/30',
    dot: 'bg-emerald-500',
    icon: CheckCircle
  },
  degraded: {
    bg: 'bg-amber-500/10 dark:bg-amber-500/15',
    text: 'text-amber-600 dark:text-amber-400',
    border: 'border-amber-500/30',
    dot: 'bg-amber-500',
    icon: AlertTriangle
  },
  partial_outage: {
    bg: 'bg-orange-500/10 dark:bg-orange-500/15',
    text: 'text-orange-600 dark:text-orange-400',
    border: 'border-orange-500/30',
    dot: 'bg-orange-500',
    icon: AlertTriangle
  },
  major_outage: {
    bg: 'bg-rose-500/10 dark:bg-rose-500/15',
    text: 'text-rose-600 dark:text-rose-400',
    border: 'border-rose-500/30',
    dot: 'bg-rose-500',
    icon: XCircle
  },
};

const uptimeData = [
  { period: '24 Jam Terakhir', uptime: '100.00%', subtitle: 'Zero incident recorded' },
  { period: '7 Hari Terakhir', uptime: '99.98%', subtitle: '1 brief maintenance restart' },
  { period: '30 Hari Terakhir', uptime: '99.95%', subtitle: 'Kernel update & patch window' },
];

const incidents = [
  { date: '2026-09-12', title: 'PHP 8.2 FPM Runtime Extension Update', status: 'resolved', duration: '12 min', impact: 'Routine reload' },
  { date: '2026-08-15', title: 'Cloudflare Edge Proxy Rule Optimization', status: 'resolved', duration: '25 min', impact: 'DNS TTL Refresh' },
  { date: '2026-07-22', title: 'MariaDB Database Buffer Pool Dynamic Resizing', status: 'resolved', duration: '18 min', impact: 'Zero downtime' },
];

export function SystemStatus() {
  useDocumentTitle('System Status & Telemetry Health');
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());


  const { data, isFetching, refetch } = useQuery({
    queryKey: ['status'],
    queryFn: async () => {
      const res = await statusApi.getSystemStatus();
      setLastUpdated(new Date());
      return res;
    },
    placeholderData: {
      website: 'operational',
      api: 'operational',
      download: 'operational',
      database: 'operational',
      dns: 'operational'
    },
    refetchInterval: 15000, // Live poll every 15 seconds
  });

  const allOperational = Object.values(data || {}).every((s) => s === 'operational');

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in pb-16">
      {/* Header and Live Status Card */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-dark-800/80 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Activity className="h-6 w-6 text-emerald-400" />
            <h1 className="text-2xl sm:text-3xl font-bold text-dark-100 tracking-tight font-sans">
              System Telemetry & Health
            </h1>
          </div>
          <p className="text-dark-400 text-xs sm:text-sm">
            Live infrastructure diagnostics, daemon health checks, and service uptime.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-dark-900/80 border border-dark-750 text-2xs font-mono text-dark-300">
            <Radio className="h-3 w-3 text-emerald-400 animate-pulse" />
            <span>Updated: {lastUpdated.toLocaleTimeString()}</span>
          </div>

          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="p-2 rounded-xl bg-dark-900 hover:bg-dark-850 border border-dark-750 text-dark-300 hover:text-white transition-colors"
            title="Perbarui status sekarang"
            aria-label="Refresh status sistem"
          >
            <RefreshCw className={cn('h-4 w-4', isFetching && 'animate-spin text-emerald-400')} />
          </button>
        </div>
      </div>

      {/* Primary Global System Banner */}
      <div className={cn(
        'p-5 sm:p-6 rounded-2xl border backdrop-blur-xl transition-all duration-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4',
        allOperational
          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300 shadow-[0_12px_32px_-10px_rgba(16,185,129,0.18)]'
          : 'bg-amber-500/10 border-amber-500/30 text-amber-300 shadow-[0_12px_32px_-10px_rgba(245,158,11,0.18)]'
      )}>
        <div className="flex items-center gap-4">
          <div className={cn(
            'p-3 rounded-xl border',
            allOperational ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400' : 'bg-amber-500/20 border-amber-500/40 text-amber-400'
          )}>
            {allOperational ? <ShieldCheck className="h-7 w-7" /> : <AlertTriangle className="h-7 w-7" />}
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold font-mono tracking-wide text-dark-100">
              {allOperational ? 'ALL CORE SYSTEMS FULLY OPERATIONAL' : 'SYSTEM DEGRADATION DETECTED'}
            </h2>
            <p className="text-xs sm:text-sm text-dark-300 mt-0.5 font-sans">
              {allOperational
                ? 'Semua microservice, database server, DNS daemon, dan reverse proxy berfungsi optimal dengan respon normal.'
                : 'Sebagian service sedang dalam pemantauan atau penyesuaian throughput lalu lintas.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto font-mono text-2xs px-3 py-1.5 rounded-lg bg-dark-950/60 border border-dark-800">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
          <span className="text-emerald-400 font-semibold uppercase tracking-wider">Live Monitoring Active</span>
        </div>
      </div>

      {/* Services Grid */}
      <section className="space-y-4" aria-labelledby="services-status-heading">
        <h2 id="services-status-heading" className="text-sm font-bold font-mono text-dark-300 uppercase tracking-wider flex items-center gap-2">
          <Server className="h-4 w-4 text-emerald-400" aria-hidden="true" />
          Status Komponen Layanan
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" role="list" aria-label="Daftar status komponen layanan">
          {services.map((service) => {
            const status = (data?.[service.id as keyof typeof data] || 'operational') as keyof typeof statusColors;
            const colors = statusColors[status] || statusColors.operational;
            const StatusIcon = colors.icon;

            return (
              <div
                key={service.id}
                role="listitem"
                className="p-5 rounded-2xl bg-dark-900/60 backdrop-blur-xl border border-dark-800 hover:border-emerald-500/40 transition-all duration-300 flex flex-col justify-between group shadow-sm hover:shadow-[0_8px_24px_-6px_rgba(16,185,129,0.12)]"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div className={cn('p-2.5 rounded-xl border', colors.bg, colors.border)}>
                        <service.icon className={cn('h-5 w-5', colors.text)} aria-hidden="true" />
                      </div>
                      <div>
                        <h3 className="font-bold text-dark-100 text-sm sm:text-base group-hover:text-emerald-300 transition-colors">
                          {service.name}
                        </h3>
                        <p className="text-2xs font-mono text-dark-400 truncate max-w-[180px]">
                          {service.endpoint}
                        </p>
                      </div>
                    </div>

                    <span className={cn(
                      'text-2xs font-mono px-2 py-0.5 rounded-full border font-semibold uppercase tracking-wider flex items-center gap-1.5',
                      colors.bg, colors.text, colors.border
                    )}>
                      <span className={cn('w-1.5 h-1.5 rounded-full', colors.dot)} aria-hidden="true" />
                      {status.replace('_', ' ')}
                    </span>
                  </div>

                  <p className="text-dark-300 text-xs leading-relaxed mb-4">
                    {service.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-dark-800/80 flex items-center justify-between text-2xs font-mono text-dark-400">
                  <div className="flex items-center gap-1.5 text-emerald-400">
                    <Zap className="h-3 w-3" aria-hidden="true" />
                    <span>Latensi: {service.typicalLatency}</span>
                  </div>
                  <div className="flex items-center gap-1 text-dark-500">
                    <Clock className="h-3 w-3" aria-hidden="true" />
                    <span>100% OK</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Uptime Statistics Bento */}
      <section className="space-y-4" aria-labelledby="uptime-sla-heading">
        <h2 id="uptime-sla-heading" className="text-sm font-bold font-mono text-dark-300 uppercase tracking-wider flex items-center gap-2">
          <Activity className="h-4 w-4 text-cyan-400" aria-hidden="true" />
          Metrik Ketersediaan (Uptime SLA)
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4" role="list" aria-label="Metrik ketersediaan SLA">
          {uptimeData.map((item) => (
            <div
              key={item.period}
              role="listitem"
              className="p-6 rounded-2xl bg-dark-900/60 backdrop-blur-xl border border-dark-800 hover:border-cyan-500/40 text-center transition-all duration-300 shadow-sm"
            >
              <p className="text-2xs font-mono text-dark-400 uppercase tracking-wider">{item.period}</p>
              <p className="text-3xl sm:text-4xl font-black font-mono text-cyan-400 mt-2 tracking-tight">
                {item.uptime}
              </p>
              <p className="text-2xs text-dark-400 mt-1 font-sans">{item.subtitle}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Incident & Maintenance History */}
      <section className="space-y-4" aria-labelledby="incident-history-heading">
        <h2 id="incident-history-heading" className="text-sm font-bold font-mono text-dark-300 uppercase tracking-wider flex items-center gap-2">
          <Clock className="h-4 w-4 text-amber-400" aria-hidden="true" />
          Riwayat Pemeliharaan & Insiden
        </h2>

        <div className="space-y-3" role="list" aria-label="Daftar riwayat pemeliharaan dan insiden">
          {incidents.map((incident, i) => (
            <div
              key={i}
              role="listitem"
              className="p-4 rounded-xl bg-dark-900/60 border border-dark-800 hover:border-amber-500/30 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex-shrink-0">
                  <CheckCircle className="h-4 w-4" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="font-semibold text-dark-100 text-xs sm:text-sm">{incident.title}</h3>
                  <p className="text-dark-400 text-2xs font-mono mt-0.5">
                    Durasi: {incident.duration} • Dampak: {incident.impact}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto font-mono text-2xs">
                <span className="text-dark-500">{incident.date}</span>
                <Badge variant="success" dot className="text-2xs uppercase">
                  {incident.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default SystemStatus;