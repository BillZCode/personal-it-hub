import React, { useState } from 'react';
import { AlertTriangle, Unlock, Lock, ExternalLink, RefreshCw, Server, ShieldAlert } from 'lucide-react';
import { hostingApi } from '../../services/api';

interface SuspendedDomainScreenProps {
  domainInfo: {
    hostname?: string;
    checkedDomain?: string;
    domain?: string;
    vhostId?: string;
    isSuspended?: boolean;
    status?: string;
    message?: string;
  };
  onUnsuspended?: () => void;
}

export function SuspendedDomainScreen({ domainInfo, onUnsuspended }: SuspendedDomainScreenProps) {
  const [isUnsuspending, setIsUnsuspending] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const displayDomain = domainInfo.domain || domainInfo.checkedDomain || domainInfo.hostname || window.location.hostname;
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const handleQuickUnsuspend = async () => {
    if (!domainInfo.vhostId) {
      window.location.href = '/admin/hosting';
      return;
    }

    try {
      setIsUnsuspending(true);
      setErrorMsg(null);
      await hostingApi.updateDomain(domainInfo.vhostId, { status: 'active' });
      if (onUnsuspended) {
        onUnsuspended();
      }
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (err: any) {
      setErrorMsg(err?.message || 'Gagal mengaktifkan kembali domain.');
      setIsUnsuspending(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080A10] text-[#F4F3F8] flex items-center justify-center p-4 sm:p-6 font-sans relative overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#F26676]/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-2xl w-full relative z-10 space-y-6">
        {/* cPanel / WHM Main Card */}
        <div className="p-6 sm:p-10 rounded-2xl bg-[#0D101A] border border-[#F26676]/40 shadow-[0_20px_60px_rgba(0,0,0,0.8)] backdrop-blur-xl space-y-6 text-center">
          
          {/* Header Badge */}
          <div className="flex justify-center">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold bg-[#F26676]/15 text-[#F26676] border border-[#F26676]/35 animate-pulse shadow-sm">
              <ShieldAlert className="h-4 w-4" />
              cPanel &amp; WHM Account Suspended
            </span>
          </div>

          {/* Heading */}
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-mono font-black text-white tracking-tight">
              Domain Sedang Ditangguhkan
            </h1>
            <p className="text-sm sm:text-base font-mono text-[#F7C95C]">
              {displayDomain}
            </p>
          </div>

          {/* Explanation Text */}
          <p className="text-xs sm:text-sm text-[#8E9AB5] leading-relaxed max-w-lg mx-auto">
            Website dan seluruh layanan pada domain <strong>{displayDomain}</strong> telah dinonaktifkan sementara oleh <strong>Administrator cPanel &amp; WHM Server</strong>. Akses publik ke seluruh halaman, dokumen, dan API ditutup (HTTP 503 Service Temporarily Unavailable).
          </p>

          {/* Technical Telemetry Box */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 p-3.5 rounded-xl bg-[#121624] border border-white/[0.08] text-left text-xs font-mono">
            <div>
              <span className="text-[10px] text-[#5E687E] block uppercase">STATUS CODE</span>
              <span className="text-[#F26676] font-bold">503 SUSPENDED</span>
            </div>
            <div>
              <span className="text-[10px] text-[#5E687E] block uppercase">VHOST ID</span>
              <span className="text-white font-semibold truncate block">{domainInfo.vhostId || 'vhost-custom'}</span>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <span className="text-[10px] text-[#5E687E] block uppercase">GATEWAY ENGINE</span>
              <span className="text-[#5B8DEF] font-semibold">cPanel / Edge Node</span>
            </div>
          </div>

          {/* Error Message if Unsuspend fails */}
          {errorMsg && (
            <div className="p-3 rounded-xl bg-[#F26676]/10 border border-[#F26676]/30 text-xs font-mono text-[#F26676] text-left">
              {errorMsg}
            </div>
          )}

          {/* Actions */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            {token ? (
              <>
                <button
                  onClick={handleQuickUnsuspend}
                  disabled={isUnsuspending}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-mono font-bold bg-[#4ED69E] hover:bg-[#40b886] text-[#080A10] transition-all shadow-lg active:scale-95 disabled:opacity-50"
                >
                  <Unlock className="h-4 w-4" />
                  {isUnsuspending ? 'Mengaktifkan...' : 'Buka Penangguhan (Unsuspend) Sekarang'}
                </button>
                <a
                  href="/admin/hosting"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono bg-[#161B2E] hover:bg-[#1E2540] text-white border border-white/[0.1] transition-all"
                >
                  <Server className="h-4 w-4 text-[#F7C95C]" />
                  Control Center
                </a>
              </>
            ) : (
              <>
                <a
                  href="/login"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-mono font-bold bg-[#F4F3F8] hover:bg-white text-[#080A10] transition-all shadow-md active:scale-95"
                >
                  <Lock className="h-4 w-4" />
                  Login Administrator cPanel
                </a>
                <button
                  onClick={() => window.location.reload()}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono bg-[#161B2E] hover:bg-[#1E2540] text-[#8E9AB5] hover:text-white border border-white/[0.1] transition-all"
                >
                  <RefreshCw className="h-4 w-4" />
                  Muat Ulang Halaman
                </button>
              </>
            )}
          </div>
        </div>

        {/* Footer Note */}
        <p className="text-center text-[11px] font-mono text-[#5E687E]">
          cPanel &amp; WHM Web Hosting Management Suite • Personal IT Hub Server Node
        </p>
      </div>
    </div>
  );
}
export default SuspendedDomainScreen;
