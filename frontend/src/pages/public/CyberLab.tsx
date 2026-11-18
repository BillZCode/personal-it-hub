import { useState, useEffect } from 'react';
import { ExternalLink, RefreshCw, Shield, Maximize2, Minimize2 } from 'lucide-react';
import { useDocumentTitle } from '../../hooks';

export function CyberLab() {
  useDocumentTitle('CyberLab Platform & CTF Toolkit');
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
    <div
      className={`space-y-4 animate-in pb-4 ${
        isFullscreen ? 'fixed inset-0 z-50 bg-[#080A10] p-4 space-y-3' : ''
      }`}
    >
      {/* Mega Project Nocturne Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-white/[0.06] pb-4">
        <div>
          <div className="flex flex-wrap items-center gap-2.5 mb-1">
            <div className="p-1.5 rounded-xl bg-[#F26676]/15 border border-[#F26676]/40 text-[#F26676]">
              <Shield className="h-4 w-4" aria-hidden="true" />
            </div>
            <h1 className="text-xl sm:text-2xl font-display font-medium text-[#F4F3F8] tracking-tight">
              CyberLab <span className="italic font-normal text-[#D2D8F0]">Platform</span>
            </h1>
            <span className="px-3 py-0.5 rounded-full bg-[#F26676]/15 border border-[#F26676]/40 text-[#F26676] font-mono text-[11px] font-semibold">
              Subdomain: cybertool.sabbilferdyansyah.my.id
            </span>
          </div>
          <p className="text-[#8E9AB5] text-xs">
            Workstation investigasi keamanan siber &amp; CTF mandiri dengan 8 modul taktis lengkap.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="px-3.5 py-2 rounded-full bg-[#0D101A] border border-white/10 text-[#A3ADC4] hover:text-white hover:border-white/25 transition-colors flex items-center gap-1.5 text-xs font-mono cursor-pointer"
            title={isFullscreen ? 'Keluar dari Fullscreen' : 'Layar Penuh Workstation'}
            aria-label={isFullscreen ? 'Keluar dari Layar Penuh' : 'Masuk ke Layar Penuh'}
          >
            {isFullscreen ? (
              <Minimize2 className="h-3.5 w-3.5 text-[#F26676]" aria-hidden="true" />
            ) : (
              <Maximize2 className="h-3.5 w-3.5" aria-hidden="true" />
            )}
            <span>{isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}</span>
          </button>

          <button
            type="button"
            onClick={handleRefresh}
            className="px-3.5 py-2 rounded-full bg-[#0D101A] border border-white/10 text-[#A3ADC4] hover:text-white hover:border-white/25 transition-colors flex items-center gap-1.5 text-xs font-mono cursor-pointer"
            title="Muat ulang CyberLab"
            aria-label="Muat ulang antarmuka CyberLab"
          >
            <RefreshCw
              className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin text-[#4ED69E]' : ''}`}
              aria-hidden="true"
            />
            <span>Reload</span>
          </button>

          <a
            href="https://cybertool.sabbilferdyansyah.my.id"
            target="_blank"
            rel="noopener noreferrer"
            className="h-9 px-4 rounded-full bg-[#F4F3F8] hover:bg-white text-[#080A10] text-xs font-sans font-semibold flex items-center gap-1.5 shadow-glowPill transition-all"
            aria-label="Buka CyberLab di Subdomain Mandiri (Tab Baru)"
          >
            <span>Buka Subdomain Mandiri</span>
            <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
          </a>
        </div>
      </div>

      {/* Embedded Iframe in Mega Project Nocturne Window Chrome */}
      <div
        className={`w-full rounded-2xl overflow-hidden border border-white/[0.08] bg-[#0D101A] shadow-nocturneCard relative flex flex-col ${
          isFullscreen
            ? 'h-[calc(100vh-80px)]'
            : 'h-[calc(100vh-180px)] min-h-[600px] sm:min-h-[800px]'
        }`}
      >
        <div className="bg-[#080A10] px-4 py-2.5 border-b border-white/[0.06] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-[#F26676]/80" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#F7C95C]/80" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#4ED69E]/80" />
            </div>
            <span className="text-[11px] font-mono text-[#8E9AB5] ml-2">
              SECOPS // CYBERLAB WORKSTATION
            </span>
          </div>
          <span className="text-[10px] font-mono text-[#4ED69E]">● ACTIVE SANDBOX</span>
        </div>

        <div className="relative flex-1 w-full">
          {isLoading && (
            <div
              role="status"
              aria-live="polite"
              className="absolute inset-0 bg-[#080A10]/90 backdrop-blur-sm z-10 flex flex-col items-center justify-center gap-3"
            >
              <div
                className="w-8 h-8 rounded-full border-2 border-[#F26676]/20 border-t-[#F26676] animate-spin"
                aria-hidden="true"
              />
              <p className="text-xs font-mono text-[#8E9AB5]">
                Memuat CyberLab Analysis Workstation...
              </p>
            </div>
          )}

          <iframe
            key={iframeKey}
            src="/cyberlab/"
            title="CyberLab Workstation"
            className="w-full h-full border-0"
            onLoad={() => setIsLoading(false)}
            allow="clipboard-read; clipboard-write; download"
          />
        </div>
      </div>
    </div>
  );
}

export default CyberLab;
