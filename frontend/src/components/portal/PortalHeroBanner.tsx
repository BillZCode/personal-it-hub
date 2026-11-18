import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowDown,
  ArrowUpRight,
  MapPin,
  ExternalLink,
  CheckCircle2,
} from 'lucide-react';
import { PROFILE_INFO } from '../../data/portalNavigation';
import { cn } from '../../utils';

interface PortalHeroBannerProps {
  onExploreClick?: () => void;
}

export const PortalHeroBanner: React.FC<PortalHeroBannerProps> = ({ onExploreClick }) => {
  const [avatarLoaded, setAvatarLoaded] = useState(false);

  return (
    <section
      aria-label="Portal Identity & Hero Showcase"
      className="relative w-full rounded-3xl overflow-hidden border border-white/[0.08] bg-[#0D101A]/90 backdrop-blur-xl shadow-nocturneCard transition-all duration-300"
    >
      {/* Mega Project Ambient Radial Spotlight & Star Accents */}
      <div
        className="pointer-events-none absolute -top-36 left-1/2 -translate-x-1/2 w-[900px] h-[420px] rounded-full blur-[130px] opacity-40"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(135, 160, 220, 0.28) 0%, rgba(91, 141, 239, 0.12) 45%, transparent 75%)',
        }}
        aria-hidden="true"
      />
      <span className="pointer-events-none select-none absolute top-14 left-[7%] text-white/20 text-xs animate-pulse" aria-hidden="true">
        ✦
      </span>
      <span className="pointer-events-none select-none absolute top-24 right-[9%] text-white/25 text-sm animate-pulse" aria-hidden="true">
        ✦
      </span>
      <span className="pointer-events-none select-none absolute bottom-16 left-[18%] text-white/15 text-xs" aria-hidden="true">
        ✦
      </span>

      {/* Top Nocturne Window Chrome Ribbon (Mega Project BaliInteractiveMap style) */}
      <div className="relative z-10 w-full bg-[#080A10]/90 px-5 sm:px-8 py-3.5 border-b border-white/[0.06] flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 mr-1">
            <div className="w-2.5 h-2.5 rounded-full bg-[#F26676]/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#F7C95C]/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#4ED69E]/80" />
          </div>

          <span className="text-[#A3ADC4] hidden sm:inline-flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-[#5B8DEF]" />
            <span>Denpasar, Bali [WITA]</span>
          </span>
        </div>

        {/* Quick Identity Links */}
        <div className="flex items-center gap-2 ml-auto">
          {PROFILE_INFO.links.slice(0, 4).map((link) =>
            link.isExternal ? (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1 rounded-full text-[11px] font-mono text-[#A3ADC4] hover:text-[#F4F3F8] bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 transition-all inline-flex items-center gap-1"
              >
                <span>{link.label}</span>
                <ExternalLink className="w-2.5 h-2.5 opacity-60" />
              </a>
            ) : (
              <Link
                key={link.label}
                to={link.href}
                className="px-3 py-1 rounded-full text-[11px] font-mono text-[#A3ADC4] hover:text-[#F4F3F8] bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 transition-all"
              >
                {link.label}
              </Link>
            )
          )}
        </div>
      </div>

      {/* Main Hero Body (Mega Project Nocturne Editorial Typography + Window Showcase) */}
      <div className="relative z-10 p-6 sm:p-8 lg:p-10 xl:p-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 xl:gap-14 items-center">
          {/* Left Column: Mega Project Editorial Headline & Identity (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Main Headline with Mega Project Italic Lavender-Silver Highlight */}
            <div className="space-y-3 gsap-hero-title">
              <h1 className="font-display text-3xl xs:text-4xl sm:text-5xl lg:text-[3.25rem] xl:text-[3.6rem] font-medium tracking-tight text-[#F4F3F8] leading-[1.08]">
                Architecting Resilient Networks &amp;{' '}
                <span className="italic font-normal text-[#D2D8F0]">
                  Linux Infrastructure.
                </span>
              </h1>

              <div className="flex flex-wrap items-center gap-2.5 pt-1">
                <span className="font-display font-medium text-base sm:text-lg text-[#F4F3F8]">
                  {PROFILE_INFO.name}
                </span>
                <span className="text-[#5E687E]">—</span>
                <span className="font-mono text-xs sm:text-sm text-[#5B8DEF] font-medium">
                  {PROFILE_INFO.role}
                </span>
              </div>
            </div>

            {/* Description */}
            <p className="text-sm sm:text-base text-[#8E9AB5] leading-relaxed font-sans max-w-2xl gsap-hero-desc">
              {PROFILE_INFO.bio}
            </p>

            {/* Mega Project Action Buttons (Luminous White Pill + Translucent Pill) */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 gsap-hero-actions">
              <button
                type="button"
                onClick={onExploreClick}
                className="h-12 sm:h-13 px-7 rounded-full bg-[#F4F3F8] hover:bg-white active:scale-[0.98] text-[#080A10] font-sans font-semibold text-xs sm:text-sm shadow-glowPill transition-all flex items-center justify-center gap-2.5 cursor-pointer group"
              >
                <span>Jelajahi Direktori Portal</span>
                <ArrowDown className="w-4 h-4 text-[#080A10] group-hover:translate-y-0.5 transition-transform" />
              </button>

              <Link
                to="/dashboard"
                className="h-12 sm:h-13 px-7 rounded-full bg-white/[0.06] hover:bg-white/[0.1] active:scale-[0.98] text-[#F4F3F8] font-sans font-medium text-xs sm:text-sm border border-white/15 transition-all flex items-center justify-center gap-2"
              >
                <span>Telemetri &amp; Portofolio</span>
                <ArrowUpRight className="w-4 h-4 text-[#D2D8F0]" />
              </Link>

              <Link
                to="/notes"
                className="h-12 sm:h-13 px-5 rounded-full bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 text-[#A3ADC4] hover:text-[#F4F3F8] font-sans font-medium text-xs sm:text-sm transition-all flex items-center justify-center gap-1.5"
              >
                <span>Tech Notes</span>
                <ArrowUpRight className="w-3.5 h-3.5 opacity-70" />
              </Link>
            </div>

            {/* Mega Project Micro-Trust Strip */}
            <div className="pt-4 border-t border-white/[0.06] flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-mono text-[#8E9AB5]">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#4ED69E]" />
                {PROFILE_INFO.status}
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#5B8DEF]" />
                {PROFILE_INFO.location}
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#F7C95C]" />
                {PROFILE_INFO.badge}
              </span>
            </div>
          </div>

          {/* Right Column: Enlarged Profile Showcase in Nocturne Window (5 cols) */}
          <div className="lg:col-span-5 relative gsap-hero-visual">
            <div className="relative rounded-2xl overflow-hidden border border-white/[0.08] bg-[#080A10] shadow-2xl group">
              {/* Featured Profile Portrait */}
              <div className="relative w-full h-[290px] sm:h-[330px] lg:h-[320px] xl:h-[340px] overflow-hidden bg-[#0D101A]">
                <img
                  src={PROFILE_INFO.avatarAsset}
                  alt={PROFILE_INFO.name}
                  onLoad={() => setAvatarLoaded(true)}
                  className={cn(
                    'w-full h-full object-cover object-[50%_22%] transition-all duration-700 group-hover:scale-[1.03]',
                    avatarLoaded ? 'opacity-100 blur-0' : 'opacity-0 blur-sm'
                  )}
                />

                {/* Subtle Nocturne Vignette */}
                <div
                  className="absolute inset-0 bg-gradient-to-t from-[#0D101A] via-[#0D101A]/20 to-transparent pointer-events-none"
                  aria-hidden="true"
                />

                <span
                  className="absolute bottom-3 right-3 w-3.5 h-3.5 rounded-full bg-[#4ED69E] border-2 border-[#0D101A] shadow-md"
                  title="Operational Status"
                />
              </div>

              {/* Expanded Profile Details */}
              <div className="p-5 sm:p-6 bg-[#0D101A] border-t border-white/[0.06] flex items-center justify-between gap-4 text-[#F4F3F8]">
                <div className="space-y-1.5 min-w-0">
                  <p className="font-display font-medium text-lg sm:text-xl lg:text-[1.35rem] text-[#F4F3F8] leading-tight">
                    {PROFILE_INFO.name}
                  </p>
                  <p className="text-xs sm:text-sm font-mono text-[#5B8DEF] font-semibold">
                    {PROFILE_INFO.handle}
                  </p>
                  <p className="text-xs font-mono text-[#8E9AB5] leading-snug">
                    {PROFILE_INFO.institution}
                  </p>
                </div>

                <Link
                  to="/about"
                  className="p-3.5 sm:p-4 rounded-full bg-[#F4F3F8] hover:bg-white text-[#080A10] transition-all shrink-0 shadow-glowPill"
                  title="Buka profil lengkap"
                  aria-label="Buka profil lengkap"
                >
                  <ArrowUpRight className="w-5 h-5" />
                </Link>
              </div>

              {/* Quick Semantic Indicator Strip */}
              <div className="p-3.5 bg-[#080A10] border-t border-white/[0.06] grid grid-cols-2 gap-2.5 text-center text-xs font-mono">
                <div className="p-2.5 rounded-xl bg-[#0D101A] border border-white/[0.06]">
                  <div className="text-[10px] text-[#8E9AB5]">SERVICES</div>
                  <div className="font-display font-semibold text-[#F4F3F8] text-xs sm:text-sm">
                    7+ Active
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-[#0D101A] border border-white/[0.06]">
                  <div className="text-[10px] text-[#8E9AB5]">CERTS</div>
                  <div className="font-display font-semibold text-[#4ED69E] text-xs sm:text-sm">
                    7 Verified
                  </div>
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
