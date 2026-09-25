import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { authApi } from '../../services/api';
import { Card, CardContent, Input, Button } from '../../components/ui';
import { Lock, AlertCircle } from 'lucide-react';
import { useAuthStore } from '../../store/auth';
import { useToast } from '../../hooks';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
    <div className="w-full max-w-md">
      <Card className="p-8">
        <div className="text-center mb-8">
          <div className="mx-auto mb-4 w-16 h-16 bg-primary-500/20 rounded-xl flex items-center justify-center">
            <Lock className="h-8 w-8 text-primary-500" />
          </div>
          <h1 className="text-2xl font-bold">Admin Login</h1>
          <p className="text-dark-400 mt-1">Enter your credentials to access the admin panel</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-2 text-red-400 text-sm">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Username / Email"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Masukkan username atau email..."
            required
            autoComplete="username"
          />
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            autoComplete="current-password"
          />
          <Button type="submit" className="w-full" loading={loginMutation.isPending} leftIcon={<Lock className="h-4 w-4" />}>
            Sign In
          </Button>
        </form>

        <div className="mt-6 pt-6 border-t border-dark-700 text-center text-sm text-dark-500">
          <p className="flex items-center justify-center gap-1.5 font-mono text-xs text-dark-400">
            <Lock className="h-3 w-3 text-emerald-500" />
            <span>Authorized Administrator Access</span>
          </p>
        </div>
      </Card>
    </div>
  );
}