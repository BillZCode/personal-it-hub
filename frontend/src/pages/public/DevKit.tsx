import { useState, useEffect } from 'react';
import { ExternalLink, RefreshCw, Terminal, Maximize2, Minimize2 } from 'lucide-react';
import { Badge } from '../../components/ui';
import { useDocumentTitle } from '../../hooks';

export function DevKit() {
  useDocumentTitle('DevKit CLI Studio & Developer Suite');
  const [iframeKey, setIframeKey] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen]);

  const handleRefresh = () => {
    setIsLoading(true);
    setIframeKey((prev) => prev + 1);
  };


  return (
    <div className={`space-y-3 animate-in pb-4 ${isFullscreen ? 'fixed inset-0 z-50 bg-dark-950 p-4 space-y-2' : ''}`}>
      {/* Top Banner & Quick Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-dark-800/80 pb-3">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <div className="p-1 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Terminal className="h-4 w-4" aria-hidden="true" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-dark-100 tracking-tight font-sans">
              DevKit CLI Studio
            </h1>
            <Badge variant="warning" dot className="font-mono text-2xs">
              CLI & Interactive Web Suite
            </Badge>
          </div>
          <p className="text-dark-400 text-xs">
            Modular developer utilities: Subnet CIDR, JWT inspector, Cryptographic Hashing, JSON minifier, and Unix pipelines.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="px-2.5 py-1.5 rounded-lg bg-dark-900 border border-dark-750 text-dark-300 hover:text-white hover:border-amber-500/40 transition-colors flex items-center gap-1.5 text-xs font-mono shadow-sm cursor-pointer outline-none focus-visible:ring-1 focus-visible:ring-amber-400"
            title={isFullscreen ? 'Keluar dari Fullscreen' : 'Layar Penuh Workstation'}
            aria-label={isFullscreen ? 'Keluar dari Layar Penuh' : 'Masuk ke Layar Penuh'}
          >
            {isFullscreen ? <Minimize2 className="h-3.5 w-3.5 text-amber-400" aria-hidden="true" /> : <Maximize2 className="h-3.5 w-3.5" aria-hidden="true" />}
            <span>{isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}</span>
          </button>

          <button
            type="button"
            onClick={handleRefresh}
            className="px-2.5 py-1.5 rounded-lg bg-dark-900 border border-dark-750 text-dark-300 hover:text-white hover:border-amber-500/40 transition-colors flex items-center gap-1.5 text-xs font-mono shadow-sm cursor-pointer outline-none focus-visible:ring-1 focus-visible:ring-amber-400"
            title="Muat ulang DevKit"
            aria-label="Muat ulang antarmuka DevKit"
          >
            <RefreshCw className={`h-3 w-3 ${isLoading ? 'animate-spin text-amber-400' : ''}`} aria-hidden="true" />
            <span>Reload</span>
          </button>

          <a
            href="/devkit/"
            target="_blank"
            rel="noopener noreferrer"
            className="v7-btn-gold text-xs py-1.5 px-3 rounded-lg text-dark-950 font-bold font-mono flex items-center gap-1.5 shadow-sm outline-none focus-visible:ring-1 focus-visible:ring-amber-400"
            aria-label="Buka DevKit di Tab Baru"
          >
            <span>Buka Standalone Window</span>
            <ExternalLink className="h-3 w-3" aria-hidden="true" />
          </a>
        </div>
      </div>

      {/* Embedded Iframe Container */}
      <div className={`w-full rounded-xl overflow-hidden border border-dark-800 bg-dark-950 shadow-2xl relative ${
        isFullscreen ? 'h-[calc(100vh-80px)]' : 'h-[calc(100vh-180px)] min-h-[600px] sm:min-h-[800px]'
      }`}>
        {isLoading && (
          <div role="status" aria-live="polite" className="absolute inset-0 bg-dark-950/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 rounded-full border-2 border-amber-500/20 border-t-amber-500 animate-spin" aria-hidden="true" />
            <p className="text-xs font-mono text-dark-400">Menghubungkan ke DevKit CLI Studio Engine...</p>
          </div>
        )}

        <iframe
          key={iframeKey}
          src="/devkit/"
          title="DevKit CLI Studio"
          className="w-full h-full border-0"
          onLoad={() => setIsLoading(false)}
          allow="clipboard-read; clipboard-write; download"
        />
      </div>
    </div>
  );
}

export default DevKit;
