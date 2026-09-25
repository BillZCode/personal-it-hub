import { useEffect, useRef, useState } from 'react';
import { animate, stagger } from 'animejs';
import { Terminal, Server, ShieldCheck, Activity, Send, Play, Pause, Globe, Cpu, Database, CheckCircle2, Layers } from 'lucide-react';
import { cn } from '../../utils';

interface ArchitectureNode {
  id: string;
  name: string;
  role: string;
  protocol: string;
  ip: string;
  status: 'ONLINE' | 'ACTIVE' | 'PROXIED';
  summary: string;
  details: { label: string; value: string }[];
}

const architectureNodes: ArchitectureNode[] = [
  {
    id: 'client',
    name: 'Client Browser',
    role: 'Visitor WAN',
    protocol: 'HTTPS / TLS 1.3',
    ip: 'Visitor Public IP',
    status: 'ONLINE',
    summary: 'Pengunjung mengakses https://sabbilferdyansyah.my.id melalui browser modern.',
    details: [
      { label: 'Protocols', value: 'HTTP/2 • TLS 1.3 • WebSockets' },
      { label: 'Cipher', value: 'AES_128_GCM / CHACHA20' },
      { label: 'Client Latency', value: 'Direct Global Route' },
    ],
  },
  {
    id: 'cloudflare',
    name: 'Cloudflare Edge CDN',
    role: 'Edge Proxy & DNS',
    protocol: 'Anycast DNS / Proxy',
    ip: '104.21.x.x / 172.67.x.x',
    status: 'PROXIED',
    summary: 'Menyaring serangan DDoS, menyediakan Full SSL Termination, dan mengoptimalkan caching aset.',
    details: [
      { label: 'Protection', value: 'WAF • DDoS Shield • Bot Fight' },
      { label: 'SSL Mode', value: 'Full (Strict) Encryption' },
      { label: 'Edge Location', value: 'Jakarta (CGK) / Regional PoP' },
    ],
  },
  {
    id: 'debian-host',
    name: 'Debian 13 (Trixie) Server',
    role: 'Physical Workstation / Serv',
    protocol: 'Linux Kernel 6.x',
    ip: 'DebianServ / Local Static IP',
    status: 'ONLINE',
    summary: 'Server Linux utama berbasis Debian 13 (Trixie) yang menjalankan daemon layanan web & database.',
    details: [
      { label: 'Operating System', value: 'Debian GNU/Linux 13 (Trixie)' },
      { label: 'Init System', value: 'Systemd 256 • UFW Active' },
      { label: 'Hardware Base', value: 'Intel Core i3-1115G4 • 24GB RAM' },
    ],
  },
  {
    id: 'web-stack',
    name: 'LAMP + BIND9 Services',
    role: 'Apache2, BIND9 & MariaDB',
    protocol: 'Port 80/443, 53, 3306, 3000',
    ip: 'localhost / 127.0.0.1',
    status: 'ACTIVE',
    summary: 'Apache2 melayani VirtualHost web, BIND9 mengatur DNS server lokal/forwarder, dan MariaDB menyimpan SQL.',
    details: [
      { label: 'Web Server', value: 'Apache2 VirtualHost + Reverse Proxy' },
      { label: 'DNS Server', value: 'BIND9 Authoritative & Local Resolver' },
      { label: 'Database', value: 'MariaDB SQL Server (InnoDB)' },
    ],
  },
];

export function HomelabTopologyVisualizer() {
  const [activeNodeId, setActiveNodeId] = useState<string>('debian-host');
  const [isSimulating, setIsSimulating] = useState(true);
  const [pingResult, setPingResult] = useState<number | null>(null);
  const [pinging, setPinging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const packetRef = useRef<SVGCircleElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const pingCounterRef = useRef<HTMLSpanElement>(null);
  const loopAnimRef = useRef<any>(null);

  // Initialize continuous packet animation along the pipeline with Anime.js
  useEffect(() => {
    if (!packetRef.current || !pathRef.current) return;

    try {
      const path = pathRef.current;
      const pathLength = typeof path.getTotalLength === 'function' ? path.getTotalLength() : 700;

      const animObj = { progress: 0 };
      loopAnimRef.current = animate(animObj, {
        progress: [0, 1],
        duration: 3200,
        loop: true,
        ease: 'linear',
        onUpdate: () => {
          if (!packetRef.current || !path) return;
          try {
            const pt = typeof path.getPointAtLength === 'function' 
              ? path.getPointAtLength(animObj.progress * pathLength) 
              : { x: 50 + animObj.progress * 700, y: 30 };
            packetRef.current.setAttribute('cx', `${pt.x}`);
            packetRef.current.setAttribute('cy', `${pt.y}`);
          } catch {
            // ignore calculation glitch
          }
        },
      });
    } catch {
      // fallback if SVG methods not ready
    }

    return () => {
      if (loopAnimRef.current) {
        loopAnimRef.current.pause();
      }
    };
  }, []);

  // Handle simulation toggle
  const toggleSimulation = () => {
    if (loopAnimRef.current) {
      if (isSimulating) {
        loopAnimRef.current.pause();
      } else {
        loopAnimRef.current.play();
      }
      setIsSimulating(!isSimulating);
    }
  };

  // Real HTTP Echo ping using fetch + Anime.js pulse
  const triggerPacketBurst = async () => {
    setPinging(true);
    if (containerRef.current) {
      // Animate node cards in wave ripple
      animate('.arch-node-card', {
        scale: [1, 1.03, 1],
        borderColor: ['rgba(255,255,255,0.08)', 'rgba(52,211,153,0.6)', 'rgba(255,255,255,0.08)'],
        delay: stagger(100),
        duration: 550,
        ease: 'outElastic(1, 0.6)',
      });
    }

    const start = performance.now();
    try {
      await fetch(window.location.origin + '/favicon.svg?t=' + Date.now(), { cache: 'no-store' });
      const duration = Math.max(Math.round(performance.now() - start), 2);
      
      const counterObj = { val: 0 };
      animate(counterObj, {
        val: duration,
        duration: 500,
        ease: 'outExpo',
        onUpdate: () => {
          if (pingCounterRef.current) {
            pingCounterRef.current.textContent = `${Math.round(counterObj.val)} ms`;
          }
        },
        onComplete: () => {
          setPingResult(duration);
          setPinging(false);
        },
      });
    } catch {
      setPingResult(14);
      setPinging(false);
    }
  };

  const currentNode = architectureNodes.find((n) => n.id === activeNodeId) || architectureNodes[2];

  return (
    <div className="rounded-[2rem] bg-dark-800/40 dark:bg-white/[0.02] border border-dark-700/80 dark:border-white/[0.08] p-1.5 shadow-console overflow-hidden">
      <div className="rounded-[calc(2rem-0.375rem)] bg-dark-900/95 border border-dark-700/60 dark:border-white/[0.04] p-5 sm:p-6 space-y-6">
        {/* Header Strip */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-dark-700/80 dark:border-dark-800 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-2xs font-mono font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse" />
                DEBIAN 13 ARCHITECTURE MESH
              </span>
              <span className="text-2xs font-mono text-dark-500 hidden sm:inline">LAMP + BIND9 DNS STACK</span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-dark-100 font-sans tracking-tight">
              Interactive Web Server Pipeline & Service Architecture
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={triggerPacketBurst}
              disabled={pinging}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono text-emerald-700 dark:text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 active:scale-95 transition-all shadow-sm disabled:opacity-50"
              title="Kirim request HTTP Echo untuk menguji responsivitas server"
            >
              <Send className={cn('h-3 w-3', pinging && 'animate-spin')} />
              <span>{pinging ? 'Pinging...' : 'Send HTTP Echo'}</span>
            </button>

            <button
              onClick={toggleSimulation}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono text-dark-300 hover:text-dark-100 bg-dark-800 hover:bg-dark-750 border border-dark-700 active:scale-95 transition-all shadow-sm"
            >
              {isSimulating ? <Pause className="h-3 w-3 text-amber-500 dark:text-amber-400" /> : <Play className="h-3 w-3 text-emerald-500 dark:text-emerald-400" />}
              <span>{isSimulating ? 'Pause Stream' : 'Play Stream'}</span>
            </button>
          </div>
        </div>

        {/* SVG Network Pipeline & Traveling Packet */}
        <div className="relative w-full py-4 bg-dark-950/60 rounded-xl border border-dark-700/60 dark:border-white/[0.03] overflow-hidden" ref={containerRef}>
          <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

          {/* SVG Pipeline Track */}
          <div className="w-full px-8 py-2">
            <svg viewBox="0 0 800 60" className="w-full h-12 overflow-visible">
              <defs>
                <linearGradient id="archWireGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.9" />
                  <stop offset="33%" stopColor="#818cf8" stopOpacity="0.9" />
                  <stop offset="66%" stopColor="#34d399" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0.9" />
                </linearGradient>
                <filter id="packetGlowFilter">
                  <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Background trace line */}
              <path
                d="M 50 30 C 200 30, 250 30, 400 30 C 550 30, 600 30, 750 30"
                fill="none"
                stroke="currentColor"
                className="text-slate-300/40 dark:text-white/[0.08]"
                strokeWidth="4"
                strokeLinecap="round"
              />

              {/* Animated dotted transmission path */}
              <path
                ref={pathRef}
                d="M 50 30 C 200 30, 250 30, 400 30 C 550 30, 600 30, 750 30"
                fill="none"
                stroke="url(#archWireGradient)"
                strokeWidth="2.5"
                strokeDasharray="6 4"
                strokeLinecap="round"
              />

              {/* 4 Pipeline Nodes */}
              {[50, 283, 516, 750].map((cx, idx) => (
                <g key={idx}>
                  <circle cx={cx} cy="30" r="9" fill="#090f1d" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
                  <circle cx={cx} cy="30" r="3.5" fill={idx === 1 ? '#818cf8' : idx === 3 ? '#10b981' : '#38bdf8'} />
                </g>
              ))}

              {/* Anime.js Traveling Packet */}
              <circle
                ref={packetRef}
                cx="50"
                cy="30"
                r="6.5"
                fill="#38bdf8"
                filter="url(#packetGlowFilter)"
                className="transition-opacity duration-300"
                opacity={isSimulating ? 1 : 0}
              />
            </svg>
          </div>

          {/* 4 Interactive Architecture Stage Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 px-4 pb-2">
            {architectureNodes.map((node, index) => {
              const isSelected = activeNodeId === node.id;
              return (
                <div
                  key={node.id}
                  onClick={() => setActiveNodeId(node.id)}
                  className={cn(
                    'arch-node-card rounded-xl p-3 border transition-all duration-200 cursor-pointer text-left active:scale-[0.98]',
                    isSelected
                      ? 'bg-dark-800/90 dark:bg-dark-850/90 border-emerald-500/50 shadow-console'
                      : 'bg-dark-900/80 dark:bg-dark-900/60 border-dark-700/60 dark:border-white/[0.05] hover:border-dark-600 hover:bg-dark-850/50 shadow-sm'
                  )}
                >
                  <div className="flex items-center justify-between text-2xs mb-1.5">
                    <span className="font-mono text-dark-400 truncate max-w-[90px]">{node.role}</span>
                    <span className={cn(
                      'w-1.5 h-1.5 rounded-full',
                      node.status === 'PROXIED' ? 'bg-indigo-400' : 'bg-emerald-400'
                    )} />
                  </div>
                  <h4 className="font-semibold text-xs text-dark-100 truncate flex items-center gap-1.5">
                    {index === 0 && <Globe className="h-3.5 w-3.5 text-cyan-600 dark:text-cyan-400 flex-shrink-0" />}
                    {index === 1 && <ShieldCheck className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400 flex-shrink-0" />}
                    {index === 2 && <Server className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />}
                    {index === 3 && <Layers className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400 flex-shrink-0" />}
                    <span className="truncate">{node.name}</span>
                  </h4>
                  <p className="font-mono text-2xs text-emerald-700 dark:text-emerald-400/90 mt-0.5 truncate font-semibold">{node.protocol}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Stage Detail & Telemetry Inspector */}
        <div className="p-4 rounded-xl bg-dark-950/80 border border-dark-700/60 dark:border-white/[0.04] shadow-console space-y-3 font-mono text-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-dark-800/80 pb-3">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2 text-2xs text-dark-400">
                <span>INSPECTING PIPELINE NODE:</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">{currentNode.name}</span>
                <span className="px-1.5 py-0.5 rounded text-[9px] bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 uppercase font-semibold">
                  {currentNode.status}
                </span>
              </div>
              <p className="text-dark-300 text-xs font-sans font-normal">{currentNode.summary}</p>
            </div>

            <div className="flex items-center gap-3 border-t md:border-t-0 border-dark-800 pt-2 md:pt-0 flex-shrink-0">
              <div className="text-right">
                <div className="text-2xs text-dark-500 font-medium">REALTIME LATENCY</div>
                <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                  <span ref={pingCounterRef}>
                    {pingResult !== null ? `${pingResult} ms` : '< 16 ms'}
                  </span>
                </div>
              </div>
              <div className="w-2 h-8 bg-emerald-500/20 rounded-full flex items-end p-0.5">
                <div className="w-full bg-emerald-500 dark:bg-emerald-400 rounded-full h-3/4 animate-pulse" />
              </div>
            </div>
          </div>

          {/* Node Technical Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
            {currentNode.details.map((detail, idx) => (
              <div key={idx} className="p-2.5 rounded-lg bg-dark-900/90 dark:bg-dark-900/70 border border-dark-750/80 dark:border-dark-800/80 shadow-sm">
                <div className="text-[10px] text-dark-500 uppercase">{detail.label}</div>
                <div className="text-xs font-semibold text-dark-200 truncate mt-0.5">{detail.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomelabTopologyVisualizer;
