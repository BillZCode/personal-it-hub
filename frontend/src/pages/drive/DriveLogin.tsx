import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { authApi } from '../../services/api';
import { Card, Input, Button } from '../../components/ui';
import { Shield, Lock, AlertCircle, HardDrive, ArrowLeft } from 'lucide-react';
import { useAuthStore } from '../../store/auth';
import { useToast } from '../../hooks';
import { Link } from 'react-router-dom';

export function DriveLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { setUser } = useAuthStore();
  const { showToast } = useToast();

  const loginMutation = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      authApi.login(email, password),
    onSuccess: (data) => {
      setUser(data.user);
      showToast('Akses Private Cloud Drive Diberikan', 'success');
      navigate('/drive');
    },
    onError: (err: any) => {
      setError(err.message || 'Invalid username or password');
      showToast('Autentikasi gagal', 'error');
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
    <div className="min-h-screen bg-dark-950 flex flex-col justify-center items-center px-4 relative overflow-hidden">
      {/* Subtle Background Glow */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Return to Public Website */}
        <div className="mb-6 flex justify-between items-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-dark-400 hover:text-primary-400 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali ke Public Website
          </Link>
          <span className="text-xs font-mono uppercase tracking-wider text-dark-500 flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            Secure Node
          </span>
        </div>

        <Card className="p-8 border-dark-700/80 shadow-2xl bg-dark-900/90 backdrop-blur-xl">
          <div className="text-center mb-8">
            <div className="mx-auto mb-4 w-16 h-16 bg-primary-500/15 border border-primary-500/30 rounded-2xl flex items-center justify-center shadow-glow-sm">
              <HardDrive className="h-8 w-8 text-primary-400" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-dark-100">
              PRIVATE CLOUD
            </h1>
            <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 bg-dark-800 border border-dark-700 rounded-full text-xs font-medium text-amber-400/90">
              <Lock className="h-3 w-3" />
              <span>Authorized Access Only</span>
            </div>
          </div>

          {error && (
            <div className="mb-5 p-3.5 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-3 text-red-400 text-sm animate-in">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-dark-300 uppercase tracking-wider mb-1.5">
                Username / Email
              </label>
              <Input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Masukkan username atau email..."
                required
                autoComplete="username"
                className="bg-dark-950/70"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-dark-300 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                autoComplete="current-password"
                className="bg-dark-950/70"
              />
            </div>

            <Button
              type="submit"
              className="w-full mt-2 font-medium tracking-wide"
              loading={loginMutation.isPending}
              leftIcon={<Shield className="h-4 w-4" />}
            >
              SIGN IN
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-dark-800/80 text-center text-xs text-dark-500">
            <p className="flex items-center justify-center gap-1.5">
              <Lock className="h-3.5 w-3.5 text-dark-400" />
              <span>Unauthorized access prohibited</span>
            </p>
            <p className="mt-1 text-[11px] text-dark-600">
              All interactions & session events are securely logged.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
export default DriveLogin;
