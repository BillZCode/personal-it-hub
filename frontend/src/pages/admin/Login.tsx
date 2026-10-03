import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { authApi } from '../../services/api';
import { Lock, Mail, Eye, EyeOff, AlertCircle, ArrowRight } from 'lucide-react';
import { useAuthStore } from '../../store/auth';
import { useToast, useDocumentTitle } from '../../hooks';

export function Login() {
  useDocumentTitle('Admin Sign In');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { setUser } = useAuthStore();
  const { showToast } = useToast();

  const loginMutation = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) => authApi.login(email, password),
    onSuccess: (data) => {
      setUser(data.user);
      showToast('Welcome back!', 'success');
      navigate('/admin');
    },
    onError: (err: any) => {
      setError(err.message || 'Invalid credentials');
      showToast('Login failed', 'error');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (email.trim() && password) {
      loginMutation.mutate({ email: email.trim(), password });
    }
  };

  return (
    <div className="relative w-full max-w-[420px] mx-auto p-4 sm:p-0">
      {/* Decorative Outer Cyber/Glass Frames (V7 Visual Signature from video) */}
      <div className="absolute -top-3 -left-3 w-12 h-12 border-t-2 border-l-2 border-white/20 rounded-tl-2xl pointer-events-none z-10" />
      <div className="absolute -bottom-3 -right-3 w-12 h-12 border-b-2 border-r-2 border-white/20 rounded-br-2xl pointer-events-none z-10" />

      {/* Main Glassmorphic Card */}
      <div className="relative rounded-3xl bg-zinc-900/60 backdrop-blur-2xl border border-white/10 p-7 sm:p-9 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.85)] overflow-hidden">
        {/* Subtle Inner Card Sheen */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none" />

        {/* Header Text matching V7 Concept */}
        <div className="text-center mb-7">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center justify-center gap-2">
            <span>Welcome</span>
            <span className="text-amber-400 drop-shadow-[0_0_12px_rgba(251,191,36,0.35)]">Back</span>
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1.5 font-normal">
            Enter your credentials to access your secure account
          </p>
        </div>

        {error && (
          <div className="mb-5 p-3 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-2.5 text-red-400 text-xs font-mono animate-in">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email / Username Input */}
          <div className="space-y-1.5">
            <label htmlFor="admin-email" className="block text-xs font-medium text-zinc-300">
              Email Address
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400 group-focus-within:text-amber-400 transition-colors">
                <Mail className="h-4 w-4" />
              </div>
              <input
                id="admin-email"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@domain.com"
                required
                autoComplete="username"
                className="w-full pl-10 pr-4 py-2.5 bg-black/40 border border-zinc-700/80 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400/80 focus:ring-2 focus:ring-amber-400/20 transition-all font-sans"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-1.5">
            <label htmlFor="admin-password" className="block text-xs font-medium text-zinc-300">
              Password
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400 group-focus-within:text-amber-400 transition-colors">
                <Lock className="h-4 w-4" />
              </div>
              <input
                id="admin-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                autoComplete="current-password"
                className="w-full pl-10 pr-10 py-2.5 bg-black/40 border border-zinc-700/80 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400/80 focus:ring-2 focus:ring-amber-400/20 transition-all font-sans"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-zinc-400 hover:text-zinc-200 transition-colors focus:outline-none focus:text-amber-400"
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
                className="w-4 h-4 rounded border-zinc-700 bg-black/40 text-amber-400 focus:ring-amber-400/30 focus:ring-offset-0 transition-colors accent-amber-400"
              />
              <span>Remember me</span>
            </label>
            <a
              href="#forgot"
              onClick={(e) => { e.preventDefault(); showToast('Hubungi administrator server untuk reset kredensial.', 'info'); }}
              className="text-zinc-400 hover:text-amber-300 transition-colors"
            >
              Forgot password?
            </a>
          </div>

          {/* Primary Glow Golden/Yellow Button from Video */}
          <button
            type="submit"
            disabled={loginMutation.isPending}
            className="w-full mt-2 py-3 px-4 rounded-xl font-semibold text-sm text-black bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-300 hover:from-amber-300 hover:to-yellow-300 active:scale-[0.99] shadow-[0_4px_20px_rgba(245,158,11,0.35)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed group"
          >
            <span>{loginMutation.isPending ? 'Signing In...' : 'Sign In'}</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </button>
        </form>

        {/* Or Continue With Separator */}
        <div className="relative my-6 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-zinc-700/60" />
          </div>
          <span className="relative px-3 bg-zinc-900/90 text-[10px] font-mono tracking-wider uppercase text-zinc-500 rounded-full">
            OR CONTINUE WITH
          </span>
        </div>

        {/* Social Auth Pills (Google & Apple from Video) */}
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => showToast('SSO Google tersedia khusus jaringan enterprise internal.', 'info')}
            className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-black/40 border border-zinc-700/70 hover:border-zinc-500 hover:bg-black/60 text-xs font-medium text-zinc-300 hover:text-white transition-all shadow-sm"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z" />
              <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.7-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z" />
              <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.8s.2-2.1.4-2.8L1.9 6.3C.7 8.7 0 10.3 0 12s.7 3.3 1.9 5.7l3.7-2.9z" />
              <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2-6.4-4.8L1.9 16.4C3.7 20.1 7.5 23 12 23z" />
            </svg>
            <span>Google</span>
          </button>

          <button
            type="button"
            onClick={() => showToast('Apple Sign-In tersedia via Apple Business Manager.', 'info')}
            className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-black/40 border border-zinc-700/70 hover:border-zinc-500 hover:bg-black/60 text-xs font-medium text-zinc-300 hover:text-white transition-all shadow-sm"
          >
            <svg className="w-4 h-4 fill-current text-white" viewBox="0 0 24 24">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.89c.66-.8 1.11-1.92.99-3.04-1 .04-2.15.67-2.82 1.46-.59.68-1.11 1.79-.97 2.89 1.12.09 2.19-.57 2.8-1.31z"/>
            </svg>
            <span>Apple</span>
          </button>
        </div>

        {/* Footer Note */}
        <div className="mt-7 text-center text-xs text-zinc-400">
          <span>Don't have an account? </span>
          <a
            href="#contact"
            onClick={(e) => { e.preventDefault(); navigate('/contact'); }}
            className="font-medium text-amber-400 hover:text-amber-300 transition-colors"
          >
            Sign Up
          </a>
        </div>
      </div>
    </div>
  );
}

export default Login;