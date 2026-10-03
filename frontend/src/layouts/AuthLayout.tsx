import { Outlet, Link } from 'react-router-dom';
import { ArrowLeft, Shield } from 'lucide-react';

export function AuthLayout() {
  return (
    <div className="min-h-screen relative flex items-center justify-center px-4 py-8 overflow-hidden bg-black selection:bg-amber-500/30 selection:text-amber-200">
      {/* Immersive Fluid Metallic Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-60 scale-105 pointer-events-none transform transition-transform duration-1000"
        style={{ backgroundImage: "url('/images/backgrounds/metallic_wave_v7.jpg')" }}
      />
      {/* Vignette & Ambient Radial Glows */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/80 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-black pointer-events-none" />

      {/* Top Floating Return Navigation */}
      <div className="absolute top-6 left-6 z-20">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/40 border border-white/10 text-xs font-mono text-zinc-300 hover:text-white hover:border-amber-500/40 hover:bg-black/60 backdrop-blur-md transition-all shadow-lg group"
        >
          <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5 text-amber-400" />
          <span>Kembali ke IT Hub</span>
        </Link>
      </div>

      <div className="relative z-10 w-full max-w-md">
        <Outlet />
      </div>
    </div>
  );
}