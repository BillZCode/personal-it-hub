import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowDown, 
  ArrowUpRight, 
  Terminal, 
  MapPin, 
  ExternalLink 
} from 'lucide-react';
import { PROFILE_INFO } from '../../data/portalNavigation';
import { cn } from '../../utils';

interface PortalHeroBannerProps {
  onExploreClick?: () => void;
}

export const PortalHeroBanner: React.FC<PortalHeroBannerProps> = ({ onExploreClick }) => {
  const [bannerLoaded, setBannerLoaded] = useState(false);
  const [avatarLoaded, setAvatarLoaded] = useState(false);

  return (
    <section 
      aria-label="Portal Identity & Hero Showcase"
      className="relative w-full rounded-3xl overflow-hidden border border-slate-200/90 dark:border-white/10 bg-white/70 dark:bg-[#090c19]/90 backdrop-blur-xl shadow-xl dark:shadow-[0_20px_50px_rgba(0,0,0,0.45)] transition-all duration-300"
    >
      {/* 1. Subtle Engineering Grid Background */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-40 dark:opacity-20 bg-[radial-gradient(#64748b_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_30%,#000_70%,transparent_100%)]" 
        aria-hidden="true" 
      />

      {/* Decorative Technical Corner Crosshairs */}
      <div className="absolute top-3 left-3 font-mono text-[10px] text-slate-300 dark:text-slate-700 select-none pointer-events-none" aria-hidden="true">+ 08°39'S</div>
      <div className="absolute top-3 right-3 font-mono text-[10px] text-slate-300 dark:text-slate-700 select-none pointer-events-none" aria-hidden="true">115°13'E +</div>

      {/* 2. Top System Status Ribbon */}
      <div className="relative z-10 w-full px-5 sm:px-8 py-3 border-b border-slate-200/80 dark:border-white/[0.08] flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center gap-3">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 font-semibold text-[11px]">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>NODE OPERATIONAL</span>
          </div>
          <span className="hidden sm:inline text-slate-400 dark:text-slate-600">•</span>
          <span className="text-slate-600 dark:text-slate-300 hidden sm:inline flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-violet-500" />
            <span>Denpasar, Bali [WITA]</span>
          </span>
          <span className="hidden md:inline text-slate-400 dark:text-slate-600">•</span>
          <span className="text-slate-500 dark:text-slate-400 hidden md:inline">
            Host: <strong className="text-slate-700 dark:text-slate-200 font-semibold">Debian 12 • Arch Hyprland</strong>
          </span>
        </div>

        {/* Quick Identity Links */}
        <div className="flex items-center gap-2 ml-auto">
          {PROFILE_INFO.links.slice(0, 4).map((link) => (
            link.isExternal ? (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="px-2.5 py-1 rounded-lg text-[11px] font-mono text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100/70 dark:bg-white/[0.04] hover:bg-slate-200/70 dark:hover:bg-white/[0.08] border border-slate-200/70 dark:border-white/5 transition-all inline-flex items-center gap-1"
              >
                <span>{link.label}</span>
                <ExternalLink className="w-2.5 h-2.5 opacity-60" />
              </a>
            ) : (
              <Link
                key={link.label}
                to={link.href}
                className="px-2.5 py-1 rounded-lg text-[11px] font-mono text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100/70 dark:bg-white/[0.04] hover:bg-slate-200/70 dark:hover:bg-white/[0.08] border border-slate-200/70 dark:border-white/5 transition-all"
              >
                {link.label}
              </Link>
            )
          ))}
        </div>
      </div>

      {/* 3. Main Hero Body (Asymmetric Editorial Split with Optimal Height) */}
      <div className="relative z-10 p-6 sm:p-8 lg:p-10 xl:p-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 xl:gap-14 items-center">
          
          {/* Left Column: Editorial Headline & Identity (7 cols) */}
          <div className="lg:col-span-7 space-y-5">
            
            {/* Institution & Domain Eyebrow */}
            <div className="flex flex-wrap items-center gap-2 gsap-hero-badge">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-violet-500/10 dark:bg-violet-500/15 text-violet-700 dark:text-violet-300 border border-violet-500/25">
                <Terminal className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400" />
                <span>{PROFILE_INFO.institution}</span>
              </span>
              <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-slate-100 dark:bg-white/[0.05] text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-white/10">
                PORTFOLIO &amp; CENTRAL HUB
              </span>
            </div>

            {/* Main Headline */}
            <div className="space-y-2.5 gsap-hero-title">
              <h1 className="font-display text-3xl xs:text-4xl sm:text-5xl lg:text-[3.25rem] xl:text-[3.65rem] font-bold tracking-tight text-slate-900 dark:text-white leading-[1.08]">
                Architecting Resilient Networks &amp; Linux Infrastructure.
              </h1>
              
              <div className="flex flex-wrap items-center gap-2 pt-0.5">
                <span className="font-display font-semibold text-base sm:text-lg text-slate-800 dark:text-slate-200">
                  {PROFILE_INFO.name}
                </span>
                <span className="text-slate-400 dark:text-slate-600">—</span>
                <span className="font-mono text-xs sm:text-sm text-violet-600 dark:text-violet-400 font-medium">
                  {PROFILE_INFO.role}
                </span>
              </div>
            </div>

            {/* Description */}
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed font-sans max-w-2xl gsap-hero-desc">
              {PROFILE_INFO.bio}
            </p>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 gsap-hero-actions">
              <button
                type="button"
                onClick={onExploreClick}
                className="px-6 py-3.5 rounded-xl bg-violet-600 hover:bg-violet-500 active:scale-[0.98] text-white font-mono font-semibold text-xs sm:text-sm shadow-md hover:shadow-violet-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer border border-violet-400/30 group"
              >
                <span>Jelajahi Direktori Portal</span>
                <ArrowDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
              </button>

              <Link
                to="/dashboard"
                className="px-6 py-3.5 rounded-xl bg-slate-900 dark:bg-white/10 hover:bg-slate-800 dark:hover:bg-white/15 active:scale-[0.98] text-white font-mono font-semibold text-xs sm:text-sm border border-slate-700 dark:border-white/20 transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                <span>Telemetri &amp; Portofolio</span>
                <ArrowUpRight className="w-4 h-4 text-violet-400" />
              </Link>

              <Link
                to="/notes"
                className="px-4 py-3.5 rounded-xl text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.05] font-mono text-xs sm:text-sm transition-all flex items-center justify-center gap-1.5"
              >
                <span>Tech Notes</span>
                <ArrowUpRight className="w-3.5 h-3.5 opacity-60" />
              </Link>
            </div>

          </div>

          {/* Right Column: Visual Frame (Banner Artwork + Inset Profile) (5 cols) */}
          <div className="lg:col-span-5 relative gsap-hero-visual">
            <div className="relative rounded-2xl overflow-hidden border border-slate-200/90 dark:border-white/10 bg-slate-950 shadow-2xl group">
              
              {/* Banner Artwork Container with Expanded Height to Balance Larger Avatar */}
              <div className="relative w-full h-[460px] sm:h-[500px] lg:h-[540px] xl:h-[560px] overflow-hidden bg-slate-950">
                <img
                  src={PROFILE_INFO.bannerAsset}
                  alt="Sabbil Abdillah Ferdyansyah Visual Banner"
                  onLoad={() => setBannerLoaded(true)}
                  className={cn(
                    "w-full h-full object-cover object-[68%_18%] sm:object-[64%_20%] lg:object-[62%_22%] transition-all duration-700 group-hover:scale-[1.03]",
                    bannerLoaded ? "opacity-100 blur-0" : "opacity-0 blur-sm"
                  )}
                />

                {/* Subtle Cinematic Vignette */}
                <div 
                  className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent pointer-events-none" 
                  aria-hidden="true" 
                />

                {/* Corner Tech Marker */}
                <div className="absolute top-3 right-3 px-2 py-0.5 rounded bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-mono text-white/80">
                  SYS_ART // V2.4
                </div>

                {/* Inset Profile Card with Prominent Enlarged Avatar */}
                <div className="absolute bottom-4 inset-x-4 p-4 sm:p-5 lg:p-6 rounded-2xl bg-slate-900/95 dark:bg-[#0b0e1b]/95 backdrop-blur-xl border border-white/20 shadow-2xl flex items-center justify-between gap-4 sm:gap-6 text-white">
                  <div className="flex items-center gap-4 sm:gap-5 lg:gap-6 min-w-0">
                    <div className="relative shrink-0 group/avatar">
                      <div className="w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48 xl:w-52 xl:h-52 rounded-2xl overflow-hidden border-[3px] sm:border-4 border-white/95 shadow-2xl bg-slate-800 ring-2 ring-violet-500/30">
                        <img
                          src={PROFILE_INFO.avatarAsset}
                          alt={PROFILE_INFO.name}
                          onLoad={() => setAvatarLoaded(true)}
                          className={cn(
                            "w-full h-full object-cover object-[50%_35%] group-hover/avatar:scale-105 transition-all duration-500",
                            avatarLoaded ? "opacity-100" : "opacity-0"
                          )}
                        />
                      </div>
                      <span 
                        className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-slate-900 shadow-md ring-2 ring-emerald-400/40" 
                        title="Operational Status"
                      />
                    </div>

                    <div className="space-y-1.5 sm:space-y-2 min-w-0">
                      <p className="font-display font-bold text-base sm:text-lg lg:text-xl xl:text-2xl text-white leading-tight truncate">
                        {PROFILE_INFO.name}
                      </p>
                      <p className="text-xs sm:text-sm lg:text-base font-mono text-cyan-300 font-semibold truncate">
                        {PROFILE_INFO.handle}
                      </p>
                      <p className="text-xs sm:text-sm font-mono text-slate-300/90 leading-tight truncate">
                        {PROFILE_INFO.institution}
                      </p>
                      <div className="flex items-center gap-2 pt-0.5">
                        <span className="text-[10px] sm:text-xs font-mono px-2.5 py-0.5 rounded bg-violet-500/20 text-violet-300 border border-violet-500/30 font-semibold">
                          TKJ ARCHITECT
                        </span>
                        <span className="text-[10px] sm:text-xs font-mono px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold hidden sm:inline-block">
                          VERIFIED
                        </span>
                      </div>
                    </div>
                  </div>

                  <Link
                    to="/about"
                    className="p-3 sm:p-4 rounded-xl bg-white/10 hover:bg-violet-600 hover:text-white border border-white/20 transition-all text-white shrink-0 shadow-sm"
                    title="Buka profil lengkap"
                    aria-label="Buka profil lengkap"
                  >
                    <ArrowUpRight className="w-5 h-5 sm:w-6 sm:h-6" />
                  </Link>
                </div>

              </div>

              {/* Quick Indicator Strip Over Image Base */}
              <div className="p-3 bg-slate-950 border-t border-white/10 grid grid-cols-3 gap-2 text-center text-xs font-mono">
                <div className="p-2 rounded-lg bg-white/[0.04]">
                  <div className="text-[10px] text-slate-400">SERVICES</div>
                  <div className="font-bold text-white text-xs sm:text-sm">7+ Active</div>
                </div>
                <div className="p-2 rounded-lg bg-white/[0.04]">
                  <div className="text-[10px] text-slate-400">CERTS</div>
                  <div className="font-bold text-emerald-400 text-xs sm:text-sm">7 Verified</div>
                </div>
                <div className="p-2 rounded-lg bg-white/[0.04]">
                  <div className="text-[10px] text-slate-400">LATENCY</div>
                  <div className="font-bold text-cyan-400 text-xs sm:text-sm">~18ms Edge</div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>

    </section>
  );
};

export default PortalHeroBanner;
