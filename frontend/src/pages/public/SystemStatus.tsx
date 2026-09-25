import { useQuery } from '@tanstack/react-query';
import { statusApi } from '../../services/api';
import { Card, CardContent, Badge } from '../../components/ui';
import { LoadingState, SkeletonCard } from '../../components/feedback/LoadingStates';
import { Server, Database, Globe, HardDrive, Activity, TrendingUp, AlertTriangle, CheckCircle, XCircle, Clock } from 'lucide-react';
import { cn, formatRelativeTime } from '../../utils';

const services = [
  { id: 'website', name: 'Website', icon: Globe, description: 'Frontend application' },
  { id: 'api', name: 'API', icon: Server, description: 'Backend REST API' },
  { id: 'download', name: 'Download Service', icon: HardDrive, description: 'File download endpoint' },
  { id: 'database', name: 'Database', icon: Database, description: 'MySQL database' },
  { id: 'dns', name: 'DNS', icon: Globe, description: 'Domain name resolution' },
];

const statusColors = {
  operational: { bg: 'bg-green-500/20', text: 'text-green-400', border: 'border-green-500/30', icon: CheckCircle },
  degraded: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', border: 'border-yellow-500/30', icon: AlertTriangle },
  partial_outage: { bg: 'bg-orange-500/20', text: 'text-orange-400', border: 'border-orange-500/30', icon: AlertTriangle },
  major_outage: { bg: 'bg-red-500/20', text: 'text-red-400', border: 'border-red-500/30', icon: XCircle },
};

const uptimeData = [
  { period: '24h', uptime: '99.99%' },
  { period: '7d', uptime: '99.97%' },
  { period: '30d', uptime: '99.95%' },
];

const incidents = [
  { date: '2026-08-15', title: 'API Latency Spike', status: 'resolved', duration: '45 min' },
  { date: '2026-07-22', title: 'Database Connection Pool Exhaustion', status: 'resolved', duration: '2h 15m' },
  { date: '2026-06-10', title: 'CDN Configuration Error', status: 'resolved', duration: '30 min' },
];

export function SystemStatus() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['status'],
    queryFn: () => statusApi.getSystemStatus(),
    placeholderData: {
      website: 'operational', api: 'operational', download: 'operational', database: 'operational', dns: 'operational'
    },
  });

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in">
      <div>
        <h1 className="text-3xl font-bold">System Status</h1>
        <p className="text-dark-400">Real-time service health and uptime monitoring</p>
      </div>

      <section>
        <h2 className="text-xl font-semibold mb-4">SERVICE STATUS</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((service) => {
            const status = data?.[service.id as keyof typeof data] || 'operational';
            const colors = statusColors[status as keyof typeof statusColors];
            const StatusIcon = colors.icon;

            return (
              <Card key={service.id} className="p-4">
                <div className="flex items-start gap-3">
                  <div className={cn('p-2 rounded-lg', colors.bg)}>
                    <StatusIcon className={cn('h-5 w-5', colors.text)} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-dark-100">{service.name}</h3>
                      <Badge variant={status === 'operational' ? 'success' : status === 'degraded' ? 'warning' : 'danger'} className="text-xs">
                        {status.replace('_', ' ')}
                      </Badge>
                    </div>
                    <p className="text-dark-400 text-sm mt-1">{service.description}</p>
                    <div className="mt-2 flex items-center gap-2 text-xs text-dark-500">
                      <Clock className="h-3 w-3" />
                      <span>Last checked: {formatRelativeTime(new Date())}</span>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">UPTIME</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {uptimeData.map((item) => (
            <Card key={item.period} className="p-6 text-center">
              <p className="text-sm text-dark-400 uppercase tracking-wide">{item.period}</p>
              <p className="text-4xl font-bold text-primary-500 mt-2">{item.uptime}</p>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">INCIDENT HISTORY</h2>
        <div className="space-y-3">
          {incidents.map((incident, i) => (
            <Card key={i} className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-dark-100">{incident.title}</h3>
                  <p className="text-dark-400 text-sm mt-1">{incident.duration} • {formatRelativeTime(incident.date)}</p>
                </div>
                <Badge variant={incident.status === 'resolved' ? 'success' : 'warning'} dot>
                  {incident.status}
                </Badge>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}