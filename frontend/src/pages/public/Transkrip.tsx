import { useState, useEffect } from 'react';
import { ExternalLink, RefreshCw, Languages, Maximize2, Minimize2 } from 'lucide-react';
import { useDocumentTitle } from '../../hooks';

export function Transkrip() {
  useDocumentTitle('Transkrip & Terjemahan Video AI');
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
            <div className="p-1.5 rounded-xl bg-[#4ED69E]/15 border border-[#4ED69E]/40 text-[#4ED69E]">
              <Languages className="h-4 w-4" aria-hidden="true" />
            </div>
            <h1 className="text-xl sm:text-2xl font-display font-medium text-[#F4F3F8] tracking-tight">
              Transkrip &amp; Terjemahan <span className="italic font-normal text-[#D2D8F0]">AI</span>
            </h1>
            <span className="px-3 py-0.5 rounded-full bg-[#4ED69E]/15 border border-[#4ED69E]/40 text-[#4ED69E] font-mono text-[11px] font-semibold">
              Subdomain: transkrip.sabbilferdyansyah.my.id
            </span>
          </div>
          <p className="text-[#8E9AB5] text-xs">
            Transkrip dan terjemahkan video YouTube, TikTok, Instagram, atau media lokal ke berbagai bahasa dengan ekspor SRT, VTT, TXT &amp; Markdown.
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
              <Minimize2 className="h-3.5 w-3.5 text-[#4ED69E]" aria-hidden="true" />
            ) : (
              <Maximize2 className="h-3.5 w-3.5" aria-hidden="true" />
            )}
            <span>{isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}</span>
          </button>

          <button
            type="button"
            onClick={handleRefresh}
            className="px-3.5 py-2 rounded-full bg-[#0D101A] border border-white/10 text-[#A3ADC4] hover:text-white hover:border-white/25 transition-colors flex items-center gap-1.5 text-xs font-mono cursor-pointer"
            title="Muat ulang Transkrip AI"
            aria-label="Muat ulang antarmuka Transkrip AI"
          >
            <RefreshCw
              className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin text-[#4ED69E]' : ''}`}
              aria-hidden="true"
            />
            <span>Reload</span>
          </button>

          <a
            href="https://transkrip.sabbilferdyansyah.my.id"
            target="_blank"
            rel="noopener noreferrer"
            className="h-9 px-4 rounded-full bg-[#F4F3F8] hover:bg-white text-[#080A10] text-xs font-sans font-semibold flex items-center gap-1.5 shadow-glowPill transition-all"
            aria-label="Buka Transkrip AI di Subdomain Mandiri (Tab Baru)"
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
              AI MEDIA // TRANSKRIP &amp; TRANSLATION STUDIO
            </span>
          </div>
          <span className="text-[10px] font-mono text-[#4ED69E]">● ONLINE 24/7</span>
        </div>

        <div className="relative flex-1 w-full">
          {isLoading && (
            <div
              role="status"
              aria-live="polite"
              className="absolute inset-0 bg-[#080A10]/90 backdrop-blur-sm z-10 flex flex-col items-center justify-center gap-3"
            >
              <div
                className="w-8 h-8 rounded-full border-2 border-[#4ED69E]/20 border-t-[#4ED69E] animate-spin"
                aria-hidden="true"
              />
              <p className="text-xs font-mono text-[#8E9AB5]">
                Menghubungkan ke Transkrip &amp; Terjemahan AI...
              </p>
            </div>
          )}

          <iframe
            key={iframeKey}
            src="/transkrip-app/"
            title="Transkrip & Terjemahan AI"
            className="w-full h-full border-0"
            onLoad={() => setIsLoading(false)}
            allow="clipboard-read; clipboard-write; download"
          />
        </div>
      </div>
    </div>
  );
}

export default Transkrip;
