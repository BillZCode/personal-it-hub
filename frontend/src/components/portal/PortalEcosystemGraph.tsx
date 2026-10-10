import React, { useState } from 'react';
import { 
  Network, 
  Server, 
  Shield, 
  Cpu, 
  Bot, 
  Wrench, 
  Database, 
  Layers, 
  ArrowRight, 
  CheckCircle2, 
  ExternalLink,
  Radio,
  Globe
} from 'lucide-react';
import { cn } from '../../utils';

interface NodeInfo {
  id: string;
  name: string;
  port: string;
  role: string;
  tech: string;
  status: 'ONLINE' | 'ACTIVE';
  type: 'edge' | 'gateway' | 'service' | 'data';
  routeOrUrl?: string;
  isExternal?: boolean;
}

const NODES: NodeInfo[] = [
  {
    id: 'edge',
    name: 'Edge & DNS Resolution',
    port: 'Port :443 / DoH',
    role: 'Cloudflare DNS, SSL Termination & Edge Routing',
    tech: 'DNS over HTTPS • WAF Protection',
    status: 'ONLINE',
    type: 'edge',
  },
  {
    id: 'gateway',
    name: 'Nginx Reverse Proxy',
    port: 'Port :80 / :443',
    role: 'Central Dispatcher & SSL VHost Routing',
    tech: 'Nginx Engine • HTTP/2 • WebSockets',
    status: 'ACTIVE',
    type: 'gateway',
  },
  {
    id: 'frontend',
    name: 'Frontend Hub & SPA',
    port: 'Port :3000',
    role: 'Portal Utama, Telemetri, & Workstation GUI',
    tech: 'React 18 • Vite • Tailwind • TypeScript',
    status: 'ACTIVE',
    type: 'service',
    routeOrUrl: '/dashboard',
  },
  {
    id: 'backend',
    name: 'Core API Backend',
    port: 'Port :3001',
    role: 'RESTful API, Auth, Telemetri Sysinfo, & Storage',
    tech: 'Express.js • Prisma ORM • Node.js',
    status: 'ACTIVE',
    type: 'service',
  },
  {
    id: 'omni',
    name: 'Omni AI Multimodal',
    port: 'Port :3002',
    role: 'Subdomain AI Studio (Gemma 4 & Gemini Flash)',
    tech: 'Google Generative AI • Node Proxy',
    status: 'ONLINE',
    type: 'service',
    routeOrUrl: 'https://ai.sabbilferdyansyah.my.id',
    isExternal: true,
  },
  {
    id: 'cyberlab',
    name: 'CyberLab SecOps Lab',
    port: 'Port :3003',
    role: 'Laboratorium Keamanan Siber, Port Recon, & CTF',
    tech: 'SecOps Toolkit • Socket.io Engine',
    status: 'ACTIVE',
    type: 'service',
    routeOrUrl: 'https://cybertool.sabbilferdyansyah.my.id',
    isExternal: true,
  },
  {
    id: 'devkit',
    name: 'DevKit Utility Engine',
    port: 'Port :3004',
    role: 'CLI Scaffold Engine & Formatting Studio',
    tech: 'Go CLI Engine • TypeScript Web GUI',
    status: 'ACTIVE',
    type: 'service',
    routeOrUrl: '/devkit',
  },
  {
    id: 'host',
    name: 'Debian 12 Host OS',
    port: 'Kernel 6.1+ LTS',
    role: 'Infrastruktur Server Mandiri, NVMe & Systemd',
    tech: 'Debian GNU/Linux • Arch Hyprland Rice',
    status: 'ONLINE',
    type: 'data',
  },
];

export const PortalEcosystemGraph: React.FC = () => {
  const [selectedNode, setSelectedNode] = useState<NodeInfo>(NODES[2]); // Default to Frontend Hub

  return (
    <section 
      aria-labelledby="graphify-heading"
      className="p-6 sm:p-8 rounded-3xl bg-white/70 dark:bg-[#090c19]/90 border border-slate-200/90 dark:border-white/10 shadow-lg relative overflow-hidden space-y-6"
    >
      {/* Background Micro Matrix */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-30 dark:opacity-15 bg-[radial-gradient(#64748b_1px,transparent_1px)] [background-size:20px_20px]" 
        aria-hidden="true" 
      />

      {/* Header */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-white/10">
        <div>
          <div className="flex items-center gap-2 text-violet-600 dark:text-violet-400 text-xs font-mono font-semibold uppercase tracking-wider mb-1">
            <Network className="w-4 h-4" />
            <span>GRAPHIFY // TOPOLOGY &amp; SERVICE MESH</span>
          </div>
          <h2 id="graphify-heading" className="font-display text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Arsitektur Jaringan &amp; Ekosistem Multi-Port
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-xl font-sans">
            Topologi layanan server mandiri: integrasi reverse proxy Nginx, service mesh multi-port (:3000 s.d. :3004), serta host Debian 12.
          </p>
        </div>

        <div className="flex items-center gap-2 text-[11px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20 font-semibold self-start md:self-auto">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>8 Active Service Nodes</span>
        </div>
      </div>

      {/* Interactive Grid of Nodes */}
      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {NODES.map((node) => {
          const isSelected = selectedNode.id === node.id;
          return (
            <button
              key={node.id}
              type="button"
              onClick={() => setSelectedNode(node)}
              className={cn(
                "p-4 rounded-2xl text-left transition-all duration-200 border cursor-pointer relative flex flex-col justify-between group",
                isSelected
                  ? "bg-violet-50/90 dark:bg-violet-950/30 border-violet-500 dark:border-violet-400 shadow-md ring-1 ring-violet-500/30"
                  : "bg-white/60 dark:bg-white/[0.03] border-slate-200/80 dark:border-white/10 hover:border-violet-400/50 hover:bg-white dark:hover:bg-white/[0.05]"
              )}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2 font-mono text-xs">
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-white/[0.06] text-slate-600 dark:text-slate-300 font-semibold">
                    {node.port}
                  </span>
                  <span className="text-emerald-600 dark:text-emerald-400 text-[10px] flex items-center gap-1 font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    {node.status}
                  </span>
                </div>

                <h3 className="font-display font-bold text-sm sm:text-base text-slate-900 dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                  {node.name}
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">
                  {node.role}
                </p>
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-[10px] font-mono text-slate-400">
                <span className="truncate max-w-[120px]">{node.tech.split('•')[0]}</span>
                <span className={cn(
                  "font-semibold transition-colors",
                  isSelected ? "text-violet-600 dark:text-violet-400" : "text-slate-400"
                )}>
                  Inspect ›
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Node Live Telemetry Inspection Card */}
      <div className="relative z-10 p-5 sm:p-6 rounded-2xl bg-slate-900 text-white border border-slate-800 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-5 font-mono">
        <div className="space-y-1.5 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="text-xs px-2.5 py-0.5 rounded-md bg-violet-500/20 text-violet-300 border border-violet-500/30 font-bold">
              NODE INSPECTOR // {selectedNode.port}
            </span>
            <span className="text-xs text-slate-400">Status: Operational</span>
          </div>
          <h4 className="font-display text-lg sm:text-xl font-bold text-white tracking-tight">
            {selectedNode.name}
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed font-sans">
            {selectedNode.role}
          </p>
          <div className="text-xs text-cyan-300 font-semibold pt-1">
            Teknologi: <span className="text-slate-200">{selectedNode.tech}</span>
          </div>
        </div>

        {selectedNode.routeOrUrl && (
          <div className="shrink-0">
            {selectedNode.isExternal ? (
              <a
                href={selectedNode.routeOrUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold flex items-center gap-2 shadow-md transition-all cursor-pointer"
              >
                <span>Buka Endpoint Layanan</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            ) : (
              <a
                href={selectedNode.routeOrUrl}
                className="px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold flex items-center gap-2 shadow-md transition-all cursor-pointer"
              >
                <span>Akses Modul Terkait</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            )}
          </div>
        )}
      </div>

    </section>
  );
};

export default PortalEcosystemGraph;
