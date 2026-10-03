import React, { Component, ErrorInfo, ReactNode, useState } from 'react';
import { Button } from '../ui/Button';
import { AlertTriangle, RefreshCw, Copy, Check, Home } from 'lucide-react';
import { cn } from '../../utils';

interface Props {
  children: ReactNode;
  fallback?: ReactNode | ((props: { error: Error; resetErrorBoundary: () => void }) => ReactNode);
}

interface State {
  hasError: boolean;
  error: Error | null;
  copied: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    copied: false,
  };

  public static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('ErrorBoundary caught an unhandled exception:', error, errorInfo);
  }

  private handleRetry = (): void => {
    this.setState({ hasError: false, error: null, copied: false });
  };

  private handleCopyError = (): void => {
    if (!this.state.error) return;
    const errorDetails = `Error: ${this.state.error.message}\n\nStack:\n${this.state.error.stack || 'No stack trace available'}`;
    navigator.clipboard.writeText(errorDetails).then(() => {
      this.setState({ copied: true });
      setTimeout(() => this.setState({ copied: false }), 2500);
    }).catch((err) => {
      console.warn('Failed to copy error to clipboard:', err);
    });
  };

  public render(): ReactNode {
    if (this.state.hasError && this.state.error) {
      if (typeof this.props.fallback === 'function') {
        return this.props.fallback({
          error: this.state.error,
          resetErrorBoundary: this.handleRetry,
        });
      }

      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-[60vh] flex items-center justify-center p-4">
          <div className="max-w-xl w-full">
            <div className="rounded-3xl p-1 bg-gradient-to-b from-rose-500/25 via-dark-800/40 to-dark-900/80 shadow-2xl">
              <div
                role="alert"
                aria-live="assertive"
                className="p-8 sm:p-10 bg-dark-950/95 border border-dark-700/60 rounded-[22px] backdrop-blur-xl text-center space-y-6"
              >
                <div className="space-y-3">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-rose-500/10 border border-rose-500/25 text-rose-400 font-mono text-2xs tracking-widest uppercase">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" aria-hidden="true" />
                    Runtime Exception Caught
                  </div>
                  <div className="mx-auto w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 shadow-lg shadow-rose-500/10">
                    <AlertTriangle className="h-7 w-7" aria-hidden="true" />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-dark-100 font-sans tracking-tight">
                    Terjadi Kesalahan pada Aplikasi
                  </h2>
                  <p className="text-dark-400 text-sm max-w-md mx-auto leading-relaxed">
                    Sistem mendeteksi kendala tak terduga saat memproses komponen ini. Anda dapat mencoba memuat ulang status atau kembali ke beranda.
                  </p>
                </div>

                <div className="bg-dark-900/80 border border-dark-800 rounded-xl p-3.5 text-left space-y-2">
                  <div className="flex items-center justify-between text-xs text-dark-400">
                    <span className="font-mono text-2xs text-rose-400 font-medium">
                      {this.state.error.name || 'Error'}: {this.state.error.message}
                    </span>
                    <button
                      type="button"
                      onClick={this.handleCopyError}
                      className="inline-flex items-center gap-1 px-2 py-1 rounded bg-dark-800 hover:bg-dark-750 text-2xs font-mono text-dark-300 hover:text-white transition-colors"
                      aria-label="Salin detail error ke clipboard"
                    >
                      {this.state.copied ? (
                        <>
                          <Check className="h-3 w-3 text-emerald-400" aria-hidden="true" />
                          <span className="text-emerald-400">Tersalin</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3" aria-hidden="true" />
                          <span>Salin Stack</span>
                        </>
                      )}
                    </button>
                  </div>
                  {this.state.error.stack && (
                    <details className="text-left group">
                      <summary className="text-2xs font-mono text-dark-500 cursor-pointer hover:text-dark-300 select-none">
                        Tampilkan stack trace teknis
                      </summary>
                      <pre className="mt-2 p-2.5 bg-dark-950/80 rounded-lg text-2xs font-mono text-dark-400 overflow-x-auto max-h-36 scrollbar-thin border border-dark-850">
                        {this.state.error.stack}
                      </pre>
                    </details>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                  <Button
                    onClick={this.handleRetry}
                    leftIcon={<RefreshCw className="h-4 w-4" aria-hidden="true" />}
                    className="v7-btn-gold text-xs font-semibold py-2.5 px-5"
                    aria-label="Coba render ulang komponen"
                  >
                    Muat Ulang Komponen
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => { window.location.href = '/'; }}
                    leftIcon={<Home className="h-4 w-4" aria-hidden="true" />}
                    className="text-xs font-mono text-dark-300 hover:text-white border border-dark-750 hover:bg-dark-850"
                    aria-label="Kembali ke Beranda"
                  >
                    Kembali ke Beranda
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export function ErrorFallback({
  error,
  resetErrorBoundary,
}: {
  error: Error;
  resetErrorBoundary: () => void;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const errorDetails = `Error: ${error.message}\n\nStack:\n${error.stack || 'No stack trace available'}`;
    navigator.clipboard.writeText(errorDetails).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  return (
    <div
      role="alert"
      aria-live="assertive"
      className="p-6 rounded-2xl bg-dark-950/80 border border-rose-500/20 text-left space-y-4 shadow-xl"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <AlertTriangle className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <h3 className="font-semibold text-dark-100 text-sm">Gagal Memuat Komponen</h3>
            <p className="text-2xs font-mono text-dark-400">Modul mengalami kesalahan runtime</p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-dark-800 hover:bg-dark-750 text-2xs font-mono text-dark-300 hover:text-white border border-dark-700 transition-colors"
          aria-label="Salin teks kesalahan"
        >
          {copied ? <Check className="h-3 w-3 text-emerald-400" aria-hidden="true" /> : <Copy className="h-3 w-3" aria-hidden="true" />}
          <span>{copied ? 'Tersalin' : 'Salin'}</span>
        </button>
      </div>

      <p className="text-xs font-mono text-rose-300 bg-dark-900/80 p-3 rounded-xl border border-dark-800/80 break-words">
        {error.message}
      </p>

      <div className="flex justify-end pt-1">
        <Button
          size="sm"
          onClick={resetErrorBoundary}
          leftIcon={<RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />}
          className="text-xs"
          aria-label="Coba ulang komponen yang gagal"
        >
          Coba Lagi
        </Button>
      </div>
    </div>
  );
}