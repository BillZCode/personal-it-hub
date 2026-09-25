import { Outlet } from 'react-router-dom';
import { cn } from '../utils';

export function AuthLayout() {
  return (
    <div className="min-h-screen bg-dark-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-mono text-2xl font-bold text-primary-500">IT-HUB</h1>
          <p className="text-dark-400 mt-1">Admin Authentication</p>
        </div>
        <div className="card p-8">
          <Outlet />
        </div>
        <p className="text-center text-sm text-dark-500 mt-6">
          <a href="/" className="text-primary-400 hover:text-primary-300 underline">
            ← Back to Dashboard
          </a>
        </p>
      </div>
    </div>
  );
}