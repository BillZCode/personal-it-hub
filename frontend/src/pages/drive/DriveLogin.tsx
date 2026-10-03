import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { authApi } from '../../services/api';
import { Lock, Mail, Eye, EyeOff, AlertCircle, ArrowLeft, ArrowRight, HardDrive, ShieldCheck } from 'lucide-react';
import { useAuthStore } from '../../store/auth';
import { useToast } from '../../hooks';

export function DriveLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { setUser } = useAuthStore();
  const { showToast } = useToast();

  useEffect(() => {
    document.title = 'Akses Private Cloud Drive - Personal IT Hub';
  }, []);

  const loginMutation = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      authApi.login(email, password),
    onSuccess: (data) => {
      setUser(data.user);
      showToast('Akses Private Cloud Drive Diberikan', 'success');
      navigate('/drive', { replace: true });
    },
    onError: (err: any) => {
      setError(err.message || 'Kredensial tidak valid. Silakan periksa username dan password.');
      showToast('Autentikasi gagal', 'error');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setError('Harap masukkan email atau username.');
      return;
    }
    if (!password) {
      setError('Harap masukkan kata sandi.');
      return;
    }
    loginMutation.mutate({ email: trimmedEmail, password });
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center px-4 py-8 overflow-hidden bg-black selection:bg-amber-500/30 selection:text-amber-200">
      {/* Immersive Fluid Metallic Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-50 scale-105 pointer-events-none transform transition-transform duration-1000"
        style={{ backgroundImage: "url('/images/backgrounds/metallic_wave_v7.jpg')" }}
      />
      {/* Vignette & Ambient Radial Glows */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/80 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-black pointer-events-none" />

      {/* Top Floating Return Navigation */}
      <div className="absolute top-6 left-6 z-20 flex items-center gap-3">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/50 border border-white/10 text-xs font-mono text-zinc-300 hover:text-white hover:border-amber-500/40 hover:bg-black/70 backdrop-blur-md transition-all shadow-lg group outline-none focus-visible:ring-1 focus-visible:ring-amber-400"
        >
          <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5 text-amber-400" />
          <span>Kembali ke Public Website</span>
        </Link>
        <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 bg-black/50 border border-white/10 rounded-full text-xs font-mono text-amber-400 backdrop-blur-md">
          <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
          Secure Node Active
        </span>
      </div>

      <div className="relative z-10 w-full max-w-[440px] mx-auto">
        {/* Double-Bezel Card Architecture */}
        <div className="p-1 rounded-[2rem] bg-gradient-to-b from-amber-400/25 via-white/5 to-transparent border border-white/10 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.9)]">
          <div className="rounded-[calc(2rem-0.25rem)] bg-zinc-950/85 backdrop-blur-2xl border border-white/5 p-7 sm:p-9 relative overflow-hidden shadow-inner">
            {/* Ambient Top Light Beam */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-400/30 to-transparent pointer-events-none" />

            {/* Header Text */}
            <div className="text-center mb-7">
              <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 mb-3 shadow-lg shadow-amber-500/10">
                <HardDrive className="h-6 w-6" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center justify-center gap-2">
                <span>Private</span>
                <span className="text-amber-400 drop-shadow-[0_0_12px_rgba(251,191,36,0.35)]">Cloud</span>
              </h1>
              <p className="text-xs sm:text-sm text-zinc-400 mt-1.5 font-normal">
                Masukkan kredensial untuk mengakses volume drive aman
              </p>
            </div>

            {error && (
              <div
                id="login-error-msg"
                role="alert"
                className="mb-5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center gap-2.5 text-rose-400 text-xs font-mono animate-in fade-in duration-200"
              >
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              {/* Email / Username Input */}
              <div className="space-y-1.5">
                <label htmlFor="drive-username" className="block text-xs font-medium text-zinc-300">
                  Email Address / Username
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500 group-focus-within:text-amber-400 transition-colors">
                    <Mail className="h-4 w-4" />
                  </div>
                  <input
                    id="drive-username"
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@domain.com"
                    required
                    autoComplete="username"
                    aria-invalid={!!error}
                    aria-describedby={error ? 'login-error-msg' : undefined}
                    className="w-full pl-10 pr-4 py-2.5 bg-black/60 border border-zinc-700/80 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400/80 focus:ring-2 focus:ring-amber-400/20 transition-all font-sans"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1.5">
                <label htmlFor="drive-password" className="block text-xs font-medium text-zinc-300">
                  Password
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500 group-focus-within:text-amber-400 transition-colors">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    id="drive-password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    required
                    autoComplete="current-password"
                    aria-invalid={!!error}
                    aria-describedby={error ? 'login-error-msg' : undefined}
                    className="w-full pl-10 pr-10 py-2.5 bg-black/60 border border-zinc-700/80 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400/80 focus:ring-2 focus:ring-amber-400/20 transition-all font-sans"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-zinc-500 hover:text-zinc-200 transition-colors focus:outline-none"
                    aria-label={showPassword ? 'Sembunyikan password' : 'Lihat password'}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password Row */}
              <div className="flex items-center justify-between text-xs pt-1 pb-1">
                <label className="flex items-center gap-2 cursor-pointer select-none text-zinc-300 hover:text-white transition-colors">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-zinc-700 bg-black/60 text-amber-400 focus:ring-amber-400/30 focus:ring-offset-0 transition-colors accent-amber-400 cursor-pointer"
                  />
                  <span>Ingat saya</span>
                </label>
                <button
                  type="button"
                  onClick={() => showToast('Hubungi administrator server untuk reset kredensial.', 'info')}
                  className="text-zinc-400 hover:text-amber-300 transition-colors text-xs"
                >
                  Lupa password?
                </button>
              </div>

              {/* Button-in-Button Trailing Pattern for Primary CTA */}
              <button
                type="submit"
                disabled={loginMutation.isPending}
                className="w-full mt-2 py-2.5 pl-5 pr-2.5 rounded-xl font-semibold text-sm text-black bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-300 hover:from-amber-300 hover:to-yellow-300 active:scale-[0.99] shadow-[0_4px_20px_rgba(245,158,11,0.35)] transition-all flex items-center justify-between cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed group outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <span>{loginMutation.isPending ? 'Mengautentikasi...' : 'Masuk ke Drive'}</span>
                <div className="w-8 h-8 rounded-lg bg-black/10 flex items-center justify-center group-hover:translate-x-0.5 group-hover:scale-105 transition-all">
                  <ArrowRight className="h-4 w-4 text-black" />
                </div>
              </button>
            </form>

            {/* Separator */}
            <div className="relative my-6 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-zinc-800" />
              </div>
              <span className="relative px-3 bg-zinc-950 text-[10px] font-mono tracking-wider uppercase text-zinc-500 rounded-full">
                SECURE STORAGE NODE
              </span>
            </div>

            {/* Security Footprint */}
            <div className="p-3.5 rounded-xl bg-black/60 border border-zinc-800/80 text-center text-xs text-zinc-400 space-y-1">
              <div className="flex items-center justify-center gap-1.5 text-zinc-300 font-mono text-[11px]">
                <ShieldCheck className="h-3.5 w-3.5 text-amber-400" aria-hidden="true" />
                <span>Enkripsi Node Terisolasi AES-256</span>
              </div>
              <p className="text-[11px] text-zinc-500">
                Hanya sesi administrator yang memiliki akses dekripsi berkas fisik.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DriveLogin;
