import React, { useState } from 'react';
import {
  Github,
  Mail,
  MapPin,
  ExternalLink,
  Terminal,
  Shield,
  Layers,
  Sparkles,
  ArrowDown,
  CheckCircle2,
  Copy,
  Check,
  Radio,
  FileCode,
  Globe,
  Compass,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { PROFILE_INFO } from '../../data/portalNavigation';
import { cn, copyToClipboard } from '../../utils';
import { useToast } from '../../hooks';

function DiscordIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
    </svg>
  );
}

interface ProfileHeroProps {
  onScrollToSection?: (sectionId: string) => void;
}

export const ProfileHero: React.FC<ProfileHeroProps> = ({ onScrollToSection }) => {
  const [bannerLoaded, setBannerLoaded] = useState(false);
  const [avatarLoaded, setAvatarLoaded] = useState(false);
  const [copiedItem, setCopiedItem] = useState<string | null>(null);
  const { showToast } = useToast();

  const handleCopy = (text: string, label: string) => {
    copyToClipboard(text);
    setCopiedItem(label);
    showToast(`${label} disalin ke clipboard!`, 'success');
    setTimeout(() => setCopiedItem(null), 2000);
  };

  const scrollTo = (id: string) => {
    if (onScrollToSection) {
      onScrollToSection(id);
    } else {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  return (
    <div className="relative w-full rounded-3xl overflow-hidden bg-[#0c101b] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.6)] transition-all duration-300">
      
      {/* 1. Panoramic Banner Header Container */}
      <div className="relative w-full h-56 sm:h-72 md:h-84 lg:h-96 overflow-hidden bg-gradient-to-b from-[#131b2e] to-[#0c101b]">
        {/* Real Banner Image */}
        <img
          src={PROFILE_INFO.bannerAsset}
          alt="Sabbil Abdillah Ferdyansyah Artwork Banner"
          onLoad={() => setBannerLoaded(true)}
          className={cn(
            "w-full h-full object-cover object-[70%_20%] sm:object-[65%_22%] md:object-[60%_25%] transition-all duration-700",
            bannerLoaded ? "opacity-100 scale-100 blur-0" : "opacity-0 scale-105 blur-sm"
          )}
        />

        {/* Ambient Gradient Masks harmonized with Banner colors (Dark Charcoal, Deep Indigo, Violet & Sky Glow) */}
        <div 
          className="absolute inset-0 bg-gradient-to-t from-[#0c101b] via-[#0c101b]/60 to-transparent pointer-events-none" 
          aria-hidden="true" 
        />
        <div 
          className="absolute inset-0 bg-gradient-to-r from-[#0c101b]/80 via-transparent to-[#0c101b]/40 pointer-events-none" 
          aria-hidden="true" 
        />

        {/* Top Badges Floating Over Banner */}
        <div className="absolute top-4 sm:top-6 left-4 sm:left-6 right-4 sm:right-6 flex items-center justify-between gap-3 z-10">
          {/* Status Indicator */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-xs font-mono text-white/90 shadow-lg">
            <span className="relative flex h-2 w-2" aria-hidden="true">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
            </span>
            <span className="font-semibold text-emerald-300 tracking-wide">ONLINE</span>
            <span className="text-white/30">|</span>
            <span className="hidden xs:inline text-white/70">TKJ Hub Node</span>
          </div>

          {/* Quick Subdomain Links on Banner */}
          <div className="flex items-center gap-2">
            <Link
              to="/portal"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/10 hover:border-violet-400/40 text-xs font-mono text-white/80 hover:text-white transition-all"
            >
              <Compass className="w-3.5 h-3.5 text-violet-400" />
              <span>Portal Index</span>
            </Link>

            <a
              href="https://github.com/BillZCode"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/10 hover:border-violet-400/40 text-xs font-mono text-white/80 hover:text-white transition-all"
              aria-label="GitHub Profile BillZCode"
            >
              <Github className="w-3.5 h-3.5 text-white/90" />
              <span className="hidden xs:inline">@BillZCode</span>
            </a>
          </div>
        </div>
      </div>

      {/* 2. Profile Identity & Bio Section Below Banner */}
      <div className="relative px-5 sm:px-8 md:px-10 pb-8 sm:pb-10 pt-0">
        {/* Floating Avatar row */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 -mt-16 sm:-mt-20 md:-mt-24 mb-6">
          
          {/* Avatar + Main Names */}
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 sm:gap-6 text-center sm:text-left">
            {/* Real Avatar */}
            <div className="relative group shrink-0">
              <div 
                className="absolute -inset-1 rounded-3xl bg-gradient-to-tr from-violet-600 via-sky-500 to-indigo-600 opacity-70 blur-[6px] group-hover:opacity-100 transition-opacity duration-300" 
                aria-hidden="true" 
              />
              <div className="relative w-32 h-32 sm:w-36 sm:h-36 md:w-40 md:h-40 rounded-3xl overflow-hidden bg-[#111624] border-2 border-white/90 shadow-2xl">
                <img
                  src={PROFILE_INFO.avatarAsset}
                  alt="Foto Profil Sabbil Abdillah Ferdyansyah"
                  onLoad={() => setAvatarLoaded(true)}
                  className={cn(
                    "w-full h-full object-cover object-center transition-all duration-500 group-hover:scale-105",
                    avatarLoaded ? "opacity-100" : "opacity-0"
                  )}
                />
              </div>

              {/* Status Dot */}
              <div 
                className="absolute -bottom-1 -right-1 p-1 bg-[#0c101b] rounded-full"
                title="Operational Status: Active"
              >
                <div className="w-4 h-4 rounded-full bg-emerald-500 border-2 border-[#0c101b] flex items-center justify-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-white" />
                </div>
              </div>
            </div>

            {/* Name, Handle, Role */}
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight font-sans">
                  {PROFILE_INFO.name}
                </h1>
                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-mono font-semibold bg-violet-500/15 text-violet-300 border border-violet-500/30">
                  TKJ Class
                </span>
              </div>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs font-mono text-slate-300">
                <span className="font-semibold text-sky-400">Network Engineer & Linux Sysadmin</span>
                <span className="text-slate-600">•</span>
                <span className="text-slate-400">SMKN 1 Denpasar</span>
              </div>

              <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs text-slate-400 font-mono pt-0.5">
                <MapPin className="w-3.5 h-3.5 text-rose-400" />
                <span>Denpasar, Bali, Indonesia</span>
              </div>
            </div>
          </div>

          {/* Action CTAs & Quick Connect */}
          <div className="flex flex-wrap items-center justify-center sm:justify-start md:justify-end gap-2.5">
            <button
              onClick={() => scrollTo('projects-section')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono font-semibold bg-white text-slate-950 hover:bg-slate-200 transition-all shadow-md active:scale-95 cursor-pointer"
            >
              <span>Featured Projects</span>
              <ArrowDown className="w-3.5 h-3.5 text-slate-900" />
            </button>

            <button
              onClick={() => scrollTo('contact-section')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono font-semibold bg-white/[0.06] hover:bg-white/[0.12] text-white border border-white/10 hover:border-violet-400/40 transition-all shadow-sm active:scale-95 cursor-pointer"
            >
              <Mail className="w-3.5 h-3.5 text-violet-400" />
              <span>Contact Me</span>
            </button>
          </div>
        </div>

        {/* 3. Bio Description Block (Clear, concise, authentic) */}
        <div className="mt-4 pt-5 border-t border-white/[0.08] max-w-4xl space-y-4">
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-sans">
            Siswa SMK jurusan <span className="text-white font-semibold">Teknik Komputer dan Jaringan (TKJ)</span> berdedikasi tinggi dengan fokus eksplorasi pada arsitektur jaringan <span className="text-sky-300 font-medium">Cisco & Mikrotik</span>, administrasi sistem <span className="text-violet-300 font-medium">Debian & Arch Linux</span>, investigasi keamanan siber (<span className="text-amber-300 font-medium">CyberLab CTF</span>), perancangan cloud <span className="text-emerald-300 font-medium">AWS VPC</span>, serta pengembangan tools dan dashboard web modern.
          </p>

          {/* Social Links & Copyable Handles Strip */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            {/* GitHub */}
            <a
              href="https://github.com/BillZCode"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] hover:border-white/20 text-xs font-mono text-slate-300 hover:text-white transition-all"
            >
              <Github className="w-3.5 h-3.5 text-white/90" />
              <span>GitHub</span>
              <ExternalLink className="w-3 h-3 text-slate-500" />
            </a>

            {/* Discord Copy */}
            <button
              onClick={() => handleCopy('enzbern_', 'Discord Handle')}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] hover:border-white/20 text-xs font-mono text-slate-300 hover:text-white transition-all cursor-pointer"
              title="Salin username Discord: enzbern_"
            >
              <DiscordIcon className="w-3.5 h-3.5 text-indigo-400" />
              <span>enzbern_</span>
              {copiedItem === 'Discord Handle' ? (
                <Check className="w-3 h-3 text-emerald-400" />
              ) : (
                <Copy className="w-3 h-3 text-slate-500" />
              )}
            </button>

            {/* Email Copy */}
            <button
              onClick={() => handleCopy('skyroomtl@gmail.com', 'Alamat Email')}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] hover:border-white/20 text-xs font-mono text-slate-300 hover:text-white transition-all cursor-pointer"
              title="Salin email: skyroomtl@gmail.com"
            >
              <Mail className="w-3.5 h-3.5 text-sky-400" />
              <span>skyroomtl@gmail.com</span>
              {copiedItem === 'Alamat Email' ? (
                <Check className="w-3 h-3 text-emerald-400" />
              ) : (
                <Copy className="w-3 h-3 text-slate-500" />
              )}
            </button>

            {/* Instagram */}
            <a
              href="https://instagram.com/sabbilferdyans"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] hover:border-white/20 text-xs font-mono text-slate-300 hover:text-white transition-all"
            >
              <InstagramIcon className="w-3.5 h-3.5 text-rose-400" />
              <span>@sabbilferdyans</span>
              <ExternalLink className="w-3 h-3 text-slate-500" />
            </a>
          </div>
        </div>

        {/* 4. Quick Architecture & System Badges (Monospace Tycami-like minimal grid) */}
        <div className="mt-6 pt-5 border-t border-white/[0.06] grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-1">
            <span className="text-[10px] uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Terminal className="w-3 h-3 text-emerald-400" />
              Primary OS
            </span>
            <p className="font-semibold text-white truncate">Debian 12 + Arch</p>
          </div>

          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-1">
            <span className="text-[10px] uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Globe className="w-3 h-3 text-sky-400" />
              Networking
            </span>
            <p className="font-semibold text-white truncate">Cisco CCNA & VLAN</p>
          </div>

          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-1">
            <span className="text-[10px] uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Shield className="w-3 h-3 text-violet-400" />
              Security
            </span>
            <p className="font-semibold text-white truncate">Endpoint & CTF Lab</p>
          </div>

          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-1">
            <span className="text-[10px] uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Radio className="w-3 h-3 text-amber-400" />
              Node Uptime
            </span>
            <p className="font-semibold text-emerald-400 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              99.98% Stable
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
