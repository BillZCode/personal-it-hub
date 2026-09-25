import { useState } from 'react';
import { ExternalLink, RefreshCw, Sparkles, ShieldCheck, Zap } from 'lucide-react';
import { Badge } from '../../components/ui';

export function Chatbot() {
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
            <h1 className="text-2xl sm:text-3xl font-bold text-dark-100 tracking-tight font-sans">
              Omni AI Assistant
            </h1>
            <Badge variant="primary" dot className="font-mono text-2xs">
              Live Core
            </Badge>
          </div>
          <p className="text-dark-400 text-xs sm:text-sm">
            Workspace AI multi-model mandiri: didukung Gemma 4 Open Weights & Flash Lite hemat token.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            className="p-2 rounded-lg bg-dark-900 border border-dark-700/80 text-dark-300 hover:text-white hover:border-emerald-500/40 transition-colors flex items-center gap-1.5 text-xs font-mono shadow-sm"
            title="Muat ulang chatbot"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin text-emerald-400' : ''}`} />
            <span>Reload</span>
          </button>

          <a
            href="/chatbot/"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary text-xs py-2 px-3 h-8 flex items-center gap-1.5 shadow-sm font-sans"
          >
            <span>Buka Tab Penuh</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>

      {/* Feature Badges Bar */}
      <div className="flex flex-wrap items-center gap-2 p-2.5 rounded-xl bg-dark-900/60 border border-dark-800/80 text-xs text-dark-300 font-mono">
        <span className="flex items-center gap-1 text-emerald-400">
          <Zap className="h-3.5 w-3.5" />
          <span>Flash 3 Preview (Instan)</span>
        </span>
        <span className="text-dark-600">•</span>
        <span className="flex items-center gap-1 text-cyan-400">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Embodied Agentic ER-2</span>
        </span>
        <span className="text-dark-600">•</span>
        <span className="flex items-center gap-1 text-emerald-300">
          <ShieldCheck className="h-3.5 w-3.5" />
          <span>Gemma 4 26B Open Weights</span>
        </span>
      </div>

      {/* Embedded Iframe Container */}
      <div className="w-full h-[78vh] min-h-[620px] rounded-2xl overflow-hidden border border-dark-800 bg-dark-950 shadow-2xl relative">
        {isLoading && (
          <div className="absolute inset-0 bg-dark-950/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 rounded-full border-2 border-emerald-500/20 border-t-emerald-500 animate-spin" />
            <p className="text-xs font-mono text-dark-400">Menghubungkan ke Omni AI Core...</p>
          </div>
        )}

        <iframe
          key={iframeKey}
          src="/chatbot/"
          title="Omni AI Assistant"
          className="w-full h-full border-0"
          onLoad={() => setIsLoading(false)}
          allow="clipboard-read; clipboard-write"
        />
      </div>
    </div>
  );
}

export default Chatbot;

