import { Card, CardContent, Badge, Button } from '../../components/ui';
import { Users, FolderKanban, Wrench, FileText, Activity, BarChart3, TrendingUp, Server, Database, Globe } from 'lucide-react';
import { cn } from '../../utils';
import { useDocumentTitle } from '../../hooks';

export function AdminStatistics() {
  useDocumentTitle('System Statistics - Admin');
  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in">
      <div>
        <h1 className="text-3xl font-bold">Statistics Dashboard</h1>
        <p className="text-dark-400">System and content analytics overview</p>
      </div>

      <section aria-labelledby="content-stats-heading">
        <h2 id="content-stats-heading" className="text-xl font-semibold mb-4">CONTENT STATISTICS</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" role="list" aria-label="Content statistics summary">
          <Card role="listitem" className="p-5"><div className="flex items-center gap-3"><div className="p-3 bg-blue-500/20 rounded-xl"><Users className="h-6 w-6 text-blue-400" aria-hidden="true" /></div><div><p className="font-mono text-2xl font-bold">12,482</p><p className="text-sm text-dark-400">Total Visitors</p></div></div></Card>
          <Card role="listitem" className="p-5"><div className="flex items-center gap-3"><div className="p-3 bg-green-500/20 rounded-xl"><FolderKanban className="h-6 w-6 text-green-400" aria-hidden="true" /></div><div><p className="font-mono text-2xl font-bold">18</p><p className="text-sm text-dark-400">Projects</p></div></div></Card>
          <Card role="listitem" className="p-5"><div className="flex items-center gap-3"><div className="p-3 bg-purple-500/20 rounded-xl"><Wrench className="h-6 w-6 text-purple-400" aria-hidden="true" /></div><div><p className="font-mono text-2xl font-bold">9</p><p className="text-sm text-dark-400">Tools</p></div></div></Card>
          <Card role="listitem" className="p-5"><div className="flex items-center gap-3"><div className="p-3 bg-orange-500/20 rounded-xl"><FileText className="h-6 w-6 text-orange-400" aria-hidden="true" /></div><div><p className="font-mono text-2xl font-bold">24</p><p className="text-sm text-dark-400">Articles</p></div></div></Card>
        </div>
      </section>

      <section aria-labelledby="system-metrics-heading">
        <h2 id="system-metrics-heading" className="text-xl font-semibold mb-4">SYSTEM METRICS</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" role="list" aria-label="System metrics summary">
          <Card role="listitem" className="p-5"><div className="flex items-center gap-3"><div className="p-3 bg-emerald-500/20 rounded-xl"><Activity className="h-6 w-6 text-emerald-400" aria-hidden="true" /></div><div><p className="font-mono text-2xl font-bold">99.98%</p><p className="text-sm text-dark-400">Uptime</p></div></div></Card>
          <Card role="listitem" className="p-5"><div className="flex items-center gap-3"><div className="p-3 bg-blue-500/20 rounded-xl"><Server className="h-6 w-6 text-blue-400" aria-hidden="true" /></div><div><p className="font-mono text-2xl font-bold">32%</p><p className="text-sm text-dark-400">CPU Usage</p></div></div></Card>
          <Card role="listitem" className="p-5"><div className="flex items-center gap-3"><div className="p-3 bg-green-500/20 rounded-xl"><Database className="h-6 w-6 text-green-400" aria-hidden="true" /></div><div><p className="font-mono text-2xl font-bold">48%</p><p className="text-sm text-dark-400">RAM Usage</p></div></div></Card>
          <Card role="listitem" className="p-5"><div className="flex items-center gap-3"><div className="p-3 bg-orange-500/20 rounded-xl"><Globe className="h-6 w-6 text-orange-400" aria-hidden="true" /></div><div><p className="font-mono text-2xl font-bold">61%</p><p className="text-sm text-dark-400">Disk Usage</p></div></div></Card>
        </div>
      </section>

      <section aria-labelledby="tool-usage-heading">
        <h2 id="tool-usage-heading" className="text-xl font-semibold mb-4">TOOL USAGE (This Month)</h2>
        <Card className="p-5">
          <div className="space-y-4" role="list" aria-label="Tool usage rankings">
            {[
              { name: 'Subnet Calculator', count: 1240, icon: BarChart3 },
              { name: 'Base64 Encoder', count: 980, icon: FileText },
              { name: 'Hash Generator', count: 870, icon: Wrench },
              { name: 'JSON Formatter', count: 760, icon: FileText },
              { name: 'Timestamp Converter', count: 650, icon: Activity },
              { name: 'QR Generator', count: 540, icon: TrendingUp },
              { name: 'IP Checker', count: 430, icon: Globe },
              { name: 'DNS Lookup', count: 320, icon: Globe },
              { name: 'Ping Test', count: 210, icon: Activity },
            ].map((tool) => (
              <div key={tool.name} role="listitem" className="flex items-center gap-4">
                <div className="w-10 h-10 bg-dark-800 rounded-lg flex items-center justify-center flex-shrink-0"><tool.icon className="h-5 w-5 text-dark-400" aria-hidden="true" /></div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-dark-100 text-sm truncate">{tool.name}</p>
                  <div
                    className="h-2 bg-dark-800 rounded-full overflow-hidden mt-1"
                    role="progressbar"
                    aria-label={`Penggunaan ${tool.name}`}
                    aria-valuenow={tool.count}
                    aria-valuemin={0}
                    aria-valuemax={1240}
                  >
                    <div className="h-full bg-amber-500 rounded-full transition-all duration-500" style={{ width: `${(tool.count / 1240) * 100}%` }} />
                  </div>
                </div>
                <span className="font-mono text-dark-100 w-16 text-right text-sm">{tool.count}</span>
              </div>
            ))}
          </div>
        </Card>
      </section>

      <section aria-labelledby="article-views-heading">
        <h2 id="article-views-heading" className="text-xl font-semibold mb-4">ARTICLE VIEWS (Top 10)</h2>
        <Card className="p-5">
          <div className="space-y-3" role="list" aria-label="Top article views ranking">
            {[
              { title: 'Installing SSH on Debian', views: 1240 },
              { title: 'DHCP Server Configuration', views: 980 },
              { title: 'DNS Server Configuration', views: 870 },
              { title: 'VLAN Configuration', views: 760 },
              { title: 'OSPF Basic Configuration', views: 650 },
              { title: 'Static Routing', views: 540 },
              { title: 'Linux systemd Basics', views: 430 },
              { title: 'AWS VPC Fundamentals', views: 320 },
              { title: 'AWS EC2', views: 210 },
              { title: 'AWS Security Groups', views: 180 },
            ].map((article, i) => (
              <div key={i} role="listitem" className="flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="w-8 text-center font-mono text-dark-400 text-sm flex-shrink-0">{i + 1}</span>
                  <span className="text-dark-300 truncate max-w-md text-sm">{article.title}</span>
                </div>
                <span className="font-mono text-amber-400 text-sm font-semibold">{article.views}</span>
              </div>
            ))}
          </div>
        </Card>
      </section>
    </div>
  );
}