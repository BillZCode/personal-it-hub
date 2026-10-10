import React from 'react';
import { Server, Network, CheckCircle2, Shield } from 'lucide-react';
import { PROFILE_INFO } from '../../data/portalNavigation';

export const PortalTelemetryStrip: React.FC = () => {
  return (
    <section 
      aria-label="System Telemetry & Engineering Stack"
      className="space-y-4 pt-1"
    >
      {/* 4-Column Architectural Telemetry Dock */}
      <div className="w-full px-5 sm:px-8 py-4 rounded-2xl bg-white/70 dark:bg-[#0c0f1e]/80 border border-slate-200/90 dark:border-white/10 shadow-sm grid grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono">
        <div className="space-y-1 gsap-telemetry-item">
          <div className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider font-semibold">
            01 // PRIMARY NODE
          </div>
          <div className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 truncate text-xs sm:text-sm">
            <Server className="w-3.5 h-3.5 text-violet-500 shrink-0" />
            <span className="truncate">Debian 12 + Arch Hyprland</span>
          </div>
        </div>

        <div className="space-y-1 gsap-telemetry-item">
          <div className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider font-semibold">
            02 // CORE SPECIALTY
          </div>
          <div className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 truncate text-xs sm:text-sm">
            <Network className="w-3.5 h-3.5 text-cyan-500 shrink-0" />
            <span className="truncate">Cisco &amp; Linux Sysadmin</span>
          </div>
        </div>

        <div className="space-y-1 gsap-telemetry-item">
          <div className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider font-semibold">
            03 // CLUSTER UPTIME
          </div>
          <div className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 truncate text-xs sm:text-sm">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            <span>99.98% Monitored Uptime</span>
          </div>
        </div>

        <div className="space-y-1 gsap-telemetry-item">
          <div className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider font-semibold">
            04 // SECURITY GATEWAY
          </div>
          <div className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 truncate text-xs sm:text-sm">
            <Shield className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
            <span className="truncate">Nginx Reverse Proxy • TLS</span>
          </div>
        </div>
      </div>

      {/* Engineering Stack Capability Strip */}
      <div className="px-5 sm:px-7 py-3 rounded-xl bg-slate-100/70 dark:bg-white/[0.03] border border-slate-200/70 dark:border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-2.5 font-mono text-xs gsap-tech-stack">
        <span className="text-[11px] text-slate-400 dark:text-slate-500 uppercase tracking-wider font-semibold shrink-0">
          Verified Core Stack:
        </span>
        <div className="flex flex-wrap items-center gap-1.5">
          {[
            'Cisco IOS',
            'Debian 12',
            'Mikrotik RouterOS',
            'Arch Hyprland',
            'Docker Compose',
            'Nginx Reverse Proxy',
            'TypeScript',
            'Python Automation',
            'WireGuard VPN',
          ].map((tech) => (
            <span
              key={tech}
              className="px-2.5 py-1 rounded-md text-[11px] bg-white/90 dark:bg-white/[0.05] text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-white/[0.08]"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PortalTelemetryStrip;
