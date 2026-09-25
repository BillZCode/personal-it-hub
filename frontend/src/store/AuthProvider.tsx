import React from 'react';
import { useEffect } from 'react';
import { useAuthStore } from './auth';
import { authApi } from '../services/api';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setUser, setLoading, isAuthenticated } = useAuthStore();

  useEffect(() => {
    const initAuth = async () => {
      if (!isAuthenticated) {
        setLoading(false);
        return;
      }

      try {
        const res: any = await authApi.me();
        const userData = res?.user || (res?.id ? res : null);
        setUser(userData);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, [isAuthenticated, setUser, setLoading]);

  return <>{children}</>;
}