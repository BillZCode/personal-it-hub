import { useState } from 'react';
import { ExternalLink, RefreshCw, Shield, Terminal, Cpu, Lock, Search, Globe, ChevronRight } from 'lucide-react';
import { Badge } from '../../components/ui';

export function CyberLab() {
  const [iframeKey, setIframeKey] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const handleRefresh = () => {
    setIsLoading(true);
    setIframeKey((prev) => prev + 1);
  };

  return (
    <div className="space-y-4 animate-in pb-8">
      {/* Top Banner & Quick Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-dark-800/80 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <Shield className="h-5 w-5" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-dark-100 tracking-tight font-sans">
              CyberLab LKS
            </h1>
            <Badge variant="primary" dot className="font-mono text-2xs">
              Live Workstation
            </Badge>
          </div>
          <p className="text-dark-400 text-xs sm:text-sm">
            All-in-one cybersecurity toolkit & dynamic investigation workspace untuk persiapan LKS Cyber Security & CTF.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="/ai"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg bg-dark-900 border border-dark-700/80 text-emerald-400 hover:text-white hover:border-emerald-500/40 transition-colors flex items-center gap-1.5 text-xs font-mono shadow-sm"
            title="Buka Omni AI Copilot"
          >
            <span>🤖 Omni AI</span>
          </a>

          <button
            onClick={handleRefresh}
            className="p-2 rounded-lg bg-dark-900 border border-dark-700/80 text-dark-300 hover:text-white hover:border-emerald-500/40 transition-colors flex items-center gap-1.5 text-xs font-mono shadow-sm"
            title="Muat ulang CyberLab"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin text-emerald-400' : ''}`} />
            <span>Reload</span>
          </button>

          <a
            href="/cyberlab/"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary text-xs py-2 px-3 h-8 flex items-center gap-1.5 shadow-sm font-sans"
          >
            <span>Buka Tab Mandiri</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>

      {/* Category Pills Bar */}
      <div className="flex flex-wrap items-center gap-2 p-2.5 rounded-xl bg-dark-900/60 border border-dark-800/80 text-xs text-dark-300 font-mono overflow-x-auto">
        <span className="flex items-center gap-1 text-emerald-400">
          <Lock className="h-3.5 w-3.5" />
          <span>1. Crypto</span>
        </span>
        <span className="text-dark-600">•</span>
        <span className="flex items-center gap-1 text-cyan-400">
          <Terminal className="h-3.5 w-3.5" />
          <span>2. Forensics</span>
        </span>
        <span className="text-dark-600">•</span>
        <span className="flex items-center gap-1 text-purple-400">
          <Cpu className="h-3.5 w-3.5" />
          <span>3. Stego</span>
        </span>
        <span className="text-dark-600">•</span>
        <span className="flex items-center gap-1 text-amber-400">
          <Globe className="h-3.5 w-3.5" />
          <span>4. Web Exploit</span>
        </span>
        <span className="text-dark-600">•</span>
        <span className="flex items-center gap-1 text-rose-400">
          <Terminal className="h-3.5 w-3.5" />
          <span>5. Reverse Eng</span>
        </span>
        <span className="text-dark-600">•</span>
        <span className="flex items-center gap-1 text-red-400">
          <Shield className="h-3.5 w-3.5" />
          <span>6. Pwn/Binary</span>
        </span>
        <span className="text-dark-600">•</span>
        <span className="flex items-center gap-1 text-blue-400">
          <Search className="h-3.5 w-3.5" />
          <span>7. OSINT</span>
        </span>
        <span className="text-dark-600">•</span>
        <span className="flex items-center gap-1 text-emerald-300">
          <ChevronRight className="h-3.5 w-3.5" />
          <span>8. Misc & Pipeline</span>
        </span>
      </div>

      {/* Subdomain Notice */}
      <div className="flex items-center justify-between text-2xs font-mono bg-dark-900/40 border border-dark-800/60 rounded-lg px-3 py-1.5 text-dark-400">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Direct Access Subdomain:</span>
          <a
            href="http://cybertool-sabbilferdyansyah.my.id"
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-400 hover:underline"
          >
            cybertool-sabbilferdyansyah.my.id
          </a>
        </div>
        <span className="hidden sm:inline text-dark-500">Port 3003 (Local Isolated Engine)</span>
      </div>

      {/* Embedded Iframe Container */}
      <div className="w-full h-[82vh] min-h-[720px] rounded-2xl overflow-hidden border border-dark-800 bg-dark-950 shadow-2xl relative">
        {isLoading && (
          <div className="absolute inset-0 bg-dark-950/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 rounded-full border-2 border-emerald-500/20 border-t-emerald-500 animate-spin" />
            <p className="text-xs font-mono text-dark-400">Memuat CyberLab LKS Analysis Workstation...</p>
          </div>
        )}

        <iframe
          key={iframeKey}
          src="/cyberlab/"
          title="CyberLab LKS Workstation"
          className="w-full h-full border-0"
          onLoad={() => setIsLoading(false)}
          allow="clipboard-read; clipboard-write; download"
        />
      </div>
    </div>
  );
}

export default CyberLab;
