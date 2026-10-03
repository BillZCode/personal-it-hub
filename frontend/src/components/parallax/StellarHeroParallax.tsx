import { useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useTypewriter, gsap, useGSAP, useGsapMagnetic } from '../../hooks';
import { ChevronRight, Sparkles, Compass, Radio, ShieldCheck, Terminal, Globe, Activity } from 'lucide-react';

export function StellarHeroParallax() {
  const containerRef = useRef<HTMLDivElement>(null);
  const farLayerRef = useRef<HTMLDivElement>(null);
  const flareRef = useRef<HTMLDivElement>(null);
  const midPlanetRef = useRef<HTMLDivElement>(null);
  const nearMoonRef = useRef<HTMLDivElement>(null);
  const horizonRef = useRef<HTMLDivElement>(null);
  const shipRef = useRef<HTMLDivElement>(null);
  const heroContentRef = useRef<HTMLDivElement>(null);

  // Magnetic hover on the primary CTA button
  const ctaButtonRef = useGsapMagnetic<HTMLAnchorElement>(0.28);

  // Typewriter effect on Sabbil's authentic name
  const { text: typedName, pause, resume } = useTypewriter({
    words: ['Sabbil Abdillah Ferdyansyah'],
    typeSpeed: 80,
    deleteSpeed: 40,
    delaySpeed: 4800,
    loop: true,
  });

  // Store quickTo setters in a ref so they persist without triggering re-renders
  const quickSetters = useRef<{
    farX?: (v: number) => void;
    farY?: (v: number) => void;
    planetX?: (v: number) => void;
    planetY?: (v: number) => void;
    moonX?: (v: number) => void;
    moonY?: (v: number) => void;
    horizonX?: (v: number) => void;
    horizonY?: (v: number) => void;
    shipX?: (v: number) => void;
    shipY?: (v: number) => void;
    contentX?: (v: number) => void;
    contentY?: (v: number) => void;
  }>({});

  // GSAP initialization with useGSAP
  useGSAP(() => {
    // 1. Initialize 60/120 FPS hardware-accelerated quickTo setters
    if (farLayerRef.current) {
      quickSetters.current.farX = gsap.quickTo(farLayerRef.current, 'x', { duration: 0.9, ease: 'power2.out' });
      quickSetters.current.farY = gsap.quickTo(farLayerRef.current, 'y', { duration: 0.9, ease: 'power2.out' });
    }
    if (midPlanetRef.current) {
      quickSetters.current.planetX = gsap.quickTo(midPlanetRef.current, 'x', { duration: 0.7, ease: 'power2.out' });
      quickSetters.current.planetY = gsap.quickTo(midPlanetRef.current, 'y', { duration: 0.7, ease: 'power2.out' });
    }
    if (nearMoonRef.current) {
      quickSetters.current.moonX = gsap.quickTo(nearMoonRef.current, 'x', { duration: 0.55, ease: 'power2.out' });
      quickSetters.current.moonY = gsap.quickTo(nearMoonRef.current, 'y', { duration: 0.55, ease: 'power2.out' });
    }
    if (horizonRef.current) {
      quickSetters.current.horizonX = gsap.quickTo(horizonRef.current, 'x', { duration: 0.6, ease: 'power2.out' });
      quickSetters.current.horizonY = gsap.quickTo(horizonRef.current, 'y', { duration: 0.6, ease: 'power2.out' });
    }
    if (shipRef.current) {
      quickSetters.current.shipX = gsap.quickTo(shipRef.current, 'x', { duration: 0.45, ease: 'power3.out' });
      quickSetters.current.shipY = gsap.quickTo(shipRef.current, 'y', { duration: 0.45, ease: 'power3.out' });
    }
    if (heroContentRef.current) {
      quickSetters.current.contentX = gsap.quickTo(heroContentRef.current, 'x', { duration: 0.55, ease: 'power2.out' });
      quickSetters.current.contentY = gsap.quickTo(heroContentRef.current, 'y', { duration: 0.55, ease: 'power2.out' });
    }

    // 2. Master Cinematic Intro Timeline
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    if (flareRef.current) {
      tl.fromTo(
        flareRef.current,
        { scaleX: 0, opacity: 0 },
        { scaleX: 1, opacity: 0.7, duration: 1.1, ease: 'expo.out' },
        0
      );
    }

    if (midPlanetRef.current) {
      tl.fromTo(
        midPlanetRef.current,
        { scale: 0.82, rotation: -12, opacity: 0 },
        { scale: 1, rotation: 0, opacity: 1, duration: 1.2, ease: 'power2.out' },
        0.1
      );
    }

    if (nearMoonRef.current) {
      tl.fromTo(
        nearMoonRef.current,
        { scale: 0.7, y: -25, opacity: 0 },
        { scale: 1, y: 0, opacity: 1, duration: 1.0, ease: 'power2.out' },
        0.2
      );
    }

    if (horizonRef.current) {
      tl.fromTo(
        horizonRef.current,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.0, ease: 'power2.out' },
        0.25
      );
    }

    if (shipRef.current) {
      tl.fromTo(
        shipRef.current,
        { x: 80, y: 50, opacity: 0 },
        { x: 0, y: 0, opacity: 1, duration: 1.2, ease: 'power2.out' },
        0.3
      );
    }

    // Stardust twinkle entry
    tl.fromTo(
      '.stellar-stardust',
      { scale: 0, opacity: 0 },
      { scale: 1, opacity: 0.8, stagger: 0.05, duration: 0.6, ease: 'power2.out' },
      0.3
    );

    if (heroContentRef.current) {
      tl.fromTo(
        heroContentRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out' },
        0.2
      );
    }

    // 3. Perpetual micro-drifting space physics
    if (shipRef.current) {
      gsap.to(shipRef.current, {
        y: '+=12',
        rotation: '+=2.5',
        duration: 3.6,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
    }

    if (midPlanetRef.current) {
      gsap.to(midPlanetRef.current, {
        y: '+=10',
        rotation: '+=2',
        duration: 6.8,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
    }

    if (nearMoonRef.current) {
      gsap.to(nearMoonRef.current, {
        y: '-=8',
        rotation: '-=3',
        duration: 5.2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
    }
  }, { scope: containerRef });

  // Pure GSAP mouse movement parallax (Zero React state updates / zero re-renders)
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    const clientY = e.clientY - rect.top;

    // Normalized coordinates (-1 to 1)
    const normX = (clientX / rect.width - 0.5) * 2;
    const normY = (clientY / rect.height - 0.5) * 2;

    // Apply GSAP physics directly to layers
    quickSetters.current.farX?.(normX * -15);
    quickSetters.current.farY?.(normY * -15);

    quickSetters.current.planetX?.(normX * -35);
    quickSetters.current.planetY?.(normY * -35);

    quickSetters.current.moonX?.(normX * 24);
    quickSetters.current.moonY?.(normY * 24);

    quickSetters.current.horizonX?.(normX * 18);
    quickSetters.current.horizonY?.(normY * 18);

    quickSetters.current.shipX?.(normX * 52);
    quickSetters.current.shipY?.(normY * 42);

    quickSetters.current.contentX?.(normX * 12);
    quickSetters.current.contentY?.(normY * 10);
  }, []);

  // Smooth GSAP spring return to equilibrium on mouse leave
  const handleMouseLeave = useCallback(() => {
    quickSetters.current.farX?.(0);
    quickSetters.current.farY?.(0);
    quickSetters.current.planetX?.(0);
    quickSetters.current.planetY?.(0);
    quickSetters.current.moonX?.(0);
    quickSetters.current.moonY?.(0);
    quickSetters.current.horizonX?.(0);
    quickSetters.current.horizonY?.(0);
    quickSetters.current.shipX?.(0);
    quickSetters.current.shipY?.(0);
    quickSetters.current.contentX?.(0);
    quickSetters.current.contentY?.(0);
  }, []);

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative text-center py-16 sm:py-24 md:py-28 px-6 sm:px-10 rounded-3xl bg-gradient-to-b from-white/95 via-slate-50/90 to-amber-50/30 dark:from-[#060b17] dark:via-[#091124] dark:to-[#040814] border border-slate-200/90 dark:border-white/10 shadow-xl shadow-slate-200/60 dark:shadow-2xl overflow-hidden min-h-[460px] sm:min-h-[520px] flex flex-col items-center justify-center select-none cursor-default group transition-colors duration-300"
      aria-label="Interactive Stellar Parallax Hero with GSAP"
    >
      {/* Outer ambient glow spreading towards edges */}
      <div 
        className="absolute -inset-x-8 -inset-y-4 bg-gradient-to-r from-amber-500/15 via-cyan-500/10 to-amber-500/15 rounded-[36px] blur-3xl -z-10 opacity-70 pointer-events-none" 
        aria-hidden="true"
      />

      {/* Technical Coordinate Stamps */}
      <div className="hidden sm:flex items-center justify-between absolute top-3.5 left-6 right-6 pointer-events-none text-[10px] font-mono tracking-widest text-slate-400/80 dark:text-slate-500/80 uppercase z-10">
        <span>+ [ SECTOR 01: IT INFRASTRUCTURE ]</span>
        <span>[ ORBITAL HUD: LIVE ] +</span>
      </div>
      <div className="hidden sm:flex items-center justify-between absolute bottom-3.5 left-6 right-6 pointer-events-none text-[10px] font-mono tracking-widest text-slate-400/80 dark:text-slate-500/80 uppercase z-10">
        <span>+ [ RUNTIME: V2.6.2 STABLE ]</span>
        <span>[ DEPLOYMENT: CLOUD-EDGE ] +</span>
      </div>

      {/* 1. Deep Cosmic Nebula Glows (Far Layer) */}
      <div 
        ref={farLayerRef}
        className="absolute inset-0 pointer-events-none will-change-transform"
      >
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[36rem] h-[36rem] bg-amber-400/10 dark:bg-amber-500/15 rounded-full blur-[140px]" />
        <div className="absolute top-1/3 right-10 w-72 h-72 bg-cyan-400/10 dark:bg-amber-400/10 rounded-full blur-[110px]" />
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-amber-300/10 dark:bg-yellow-600/10 rounded-full blur-[120px]" />

        {/* Scattered Stardust Particles */}
        {[
          { top: '15%', left: '20%', size: 2, delay: '0s' },
          { top: '25%', left: '80%', size: 3, delay: '1.2s' },
          { top: '35%', left: '12%', size: 1.5, delay: '2.4s' },
          { top: '65%', left: '88%', size: 2.5, delay: '0.8s' },
          { top: '75%', left: '28%', size: 2, delay: '1.8s' },
          { top: '18%', left: '60%', size: 1.5, delay: '3.1s' },
          { top: '82%', left: '70%', size: 2, delay: '2.2s' },
          { top: '48%', left: '92%', size: 3, delay: '0.5s' },
          { top: '10%', left: '42%', size: 2, delay: '1.5s' },
        ].map((star, idx) => (
          <div
            key={idx}
            style={{
              top: star.top,
              left: star.left,
              width: `${star.size}px`,
              height: `${star.size}px`,
              animationDelay: star.delay,
            }}
            className="stellar-stardust absolute rounded-full bg-slate-400/50 dark:bg-white animate-pulse"
          />
        ))}
      </div>

      {/* 2. Anamorphic Lens Flare Beam (Mid Layer) */}
      <div
        ref={flareRef}
        className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-[1.5px] pointer-events-none overflow-hidden opacity-70 will-change-transform"
      >
        <div className="w-full h-full bg-gradient-to-r from-transparent via-cyan-500/35 dark:via-cyan-400/60 to-transparent blur-[1px]" />
        <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-48 h-8 bg-cyan-500/15 dark:bg-cyan-400/25 rounded-full blur-xl" />
      </div>

      {/* 3. Top-Right Giant Low-Poly Planet (StellarX Reference - Mid Layer) */}
      <div
        ref={midPlanetRef}
        className="absolute -top-12 -right-12 sm:-top-8 sm:-right-8 w-44 h-44 sm:w-64 sm:h-64 md:w-80 md:h-80 pointer-events-none will-change-transform"
      >
        <svg viewBox="0 0 200 200" className="w-full h-full filter drop-shadow-[0_0_40px_rgba(56,189,248,0.25)]">
          <defs>
            <radialGradient id="planetAtmosphereDark" cx="40%" cy="40%" r="60%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.3" />
              <stop offset="70%" stopColor="#0f172a" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#020617" stopOpacity="0.95" />
            </radialGradient>
            <radialGradient id="planetAtmosphereLight" cx="40%" cy="40%" r="60%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.4" />
              <stop offset="70%" stopColor="#cbd5e1" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#94a3b8" stopOpacity="0.85" />
            </radialGradient>
          </defs>

          {/* Planet Sphere Silhouette */}
          <circle cx="100" cy="100" r="88" fill="url(#planetAtmosphereLight)" className="dark:hidden" />
          <circle cx="100" cy="100" r="88" fill="url(#planetAtmosphereDark)" className="hidden dark:block" />

          {/* Low-Poly Facets with Metallic Gold & Bronze Shading */}
          <polygon points="100,15 135,45 85,60" fill="#f59e0b" fillOpacity="0.85" />
          <polygon points="135,45 175,70 140,95" fill="#d97706" fillOpacity="0.9" />
          <polygon points="85,60 140,95 95,115" fill="#fbbf24" fillOpacity="0.85" />
          <polygon points="100,15 85,60 45,45" fill="#fde68a" fillOpacity="0.75" />
          <polygon points="45,45 85,60 55,95" fill="#b45309" fillOpacity="0.8" />
          
          {/* Amber / Bronze Terrains */}
          <polygon points="85,60 115,100 70,120" fill="#f59e0b" fillOpacity="0.85" />
          <polygon points="115,100 155,115 125,145" fill="#92400e" fillOpacity="0.9" />
          <polygon points="140,95 175,70 185,115" fill="#78350f" fillOpacity="0.85" />
          <polygon points="140,95 185,115 155,115" fill="#d97706" fillOpacity="0.8" />
          <polygon points="55,95 85,120 40,135" fill="#fbbf24" fillOpacity="0.85" />

          {/* Deep Shadow Facets */}
          <polygon points="70,120 125,145 90,175" fill="#94a3b8" className="dark:fill-[#1e293b]" fillOpacity="0.85" />
          <polygon points="125,145 165,160 140,185" fill="#64748b" className="dark:fill-[#0f172a]" fillOpacity="0.9" />
          <polygon points="40,135 90,175 50,180" fill="#64748b" className="dark:fill-[#0f172a]" fillOpacity="0.85" />

          {/* Glowing Atmosphere Rim Ring */}
          <circle cx="100" cy="100" r="88" fill="none" stroke="#f59e0b" strokeWidth="1.5" strokeOpacity="0.5" />
        </svg>
      </div>

      {/* 4. Top-Left Floating Distant Moon / Crystal Asteroid (Near Layer) */}
      <div
        ref={nearMoonRef}
        className="absolute top-10 left-6 sm:top-14 sm:left-14 w-16 h-16 sm:w-24 sm:h-24 pointer-events-none will-change-transform"
      >
        <svg viewBox="0 0 100 100" className="w-full h-full filter drop-shadow-[0_0_25px_rgba(245,158,11,0.35)]">
          <circle cx="50" cy="50" r="38" fill="#cbd5e1" className="dark:fill-[#0f172a]" fillOpacity="0.85" />
          <polygon points="50,15 72,32 45,45" fill="#f59e0b" fillOpacity="0.9" />
          <polygon points="72,32 85,55 60,65" fill="#d97706" fillOpacity="0.85" />
          <polygon points="45,45 60,65 35,75" fill="#fbbf24" fillOpacity="0.8" />
          <polygon points="50,15 45,45 22,35" fill="#b45309" fillOpacity="0.75" />
          <polygon points="22,35 45,45 25,60" fill="#78350f" fillOpacity="0.85" />
          <circle cx="50" cy="50" r="38" fill="none" stroke="#fbbf24" strokeWidth="1" strokeOpacity="0.5" />
        </svg>
      </div>

      {/* 5. Bottom-Left Low-Poly Planet Horizon Arc (Near Layer) */}
      <div
        ref={horizonRef}
        className="absolute -bottom-24 -left-20 sm:-bottom-28 sm:-left-16 w-64 h-64 sm:w-88 sm:h-88 pointer-events-none will-change-transform"
      >
        <svg viewBox="0 0 300 300" className="w-full h-full filter drop-shadow-[0_0_50px_rgba(245,158,11,0.25)]">
          <circle cx="100" cy="220" r="140" fill="#e2e8f0" className="dark:fill-[#070d1d]" fillOpacity="0.9" />
          {/* Low Poly Terrain Peaks on Rim */}
          <polygon points="60,110 110,80 140,115" fill="#d97706" fillOpacity="0.85" />
          <polygon points="110,80 170,70 190,105" fill="#f59e0b" fillOpacity="0.9" />
          <polygon points="170,70 230,85 240,125" fill="#b45309" fillOpacity="0.75" />
          <polygon points="30,140 70,115 80,160" fill="#78350f" fillOpacity="0.85" />
          
          {/* Planetary Glow Horizon */}
          <path
            d="M 0 160 Q 120 70 260 120"
            fill="none"
            stroke="#f59e0b"
            strokeWidth="2.5"
            strokeOpacity="0.7"
          />
        </svg>
      </div>

      {/* 6. Sci-Fi Spaceship Shuttle with Thruster Particle Exhaust (StellarX Reference - Ship Layer) */}
      <div
        ref={shipRef}
        className="absolute bottom-10 right-8 sm:bottom-16 sm:right-16 md:bottom-20 md:right-28 pointer-events-none will-change-transform"
      >
        <div className="relative flex items-center">
          {/* Spaceship Vector Graphic */}
          <svg viewBox="0 0 160 80" className="w-28 sm:w-36 md:w-44 h-auto filter drop-shadow-[0_0_25px_rgba(56,189,248,0.4)]">
            <defs>
              <linearGradient id="hullGradient" x1="0%" y1="0%" x2="100%" y2="50%">
                <stop offset="0%" stopColor="#e2e8f0" />
                <stop offset="50%" stopColor="#94a3b8" />
                <stop offset="100%" stopColor="#334155" />
              </linearGradient>
              <linearGradient id="thrusterFire" x1="100%" y1="50%" x2="0%" y2="50%">
                <stop offset="0%" stopColor="#38bdf8" />
                <stop offset="50%" stopColor="#ec4899" />
                <stop offset="100%" stopColor="transparent" />
              </linearGradient>
            </defs>

            {/* Shuttle Body Fuselage */}
            <polygon points="140,40 100,28 40,32 20,40 40,48 100,52" fill="url(#hullGradient)" />
            {/* Top Wing */}
            <polygon points="85,30 50,10 35,32" fill="#0ea5e9" fillOpacity="0.9" />
            <polygon points="50,10 30,12 35,32" fill="#0284c7" />
            {/* Bottom Wing */}
            <polygon points="85,50 50,70 35,48" fill="#0ea5e9" fillOpacity="0.9" />
            <polygon points="50,70 30,68 35,48" fill="#0284c7" />
            {/* Cockpit Glass Canopy */}
            <polygon points="120,40 100,34 85,40 100,46" fill="#38bdf8" fillOpacity="0.9" />
            
            {/* Thruster Engine Flame Burst */}
            <polygon points="20,36 0,40 20,44" fill="url(#thrusterFire)" className="animate-pulse" />
          </svg>

          {/* Animated Exhaust Particle Trail (Cloud puffs) */}
          <div className="absolute right-full mr-1 flex items-center gap-1.5 opacity-80">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400/40 blur-[1px] animate-ping" />
            <span className="w-3.5 h-3.5 rounded-full bg-pink-500/30 blur-[2px]" />
            <span className="w-4 h-4 rounded-full bg-indigo-500/20 blur-[3px]" />
          </div>
        </div>
      </div>

      {/* 7. Foreground Content (Interactive Hero Information) */}
      <div 
        ref={heroContentRef}
        className="relative z-10 max-w-4xl mx-auto flex flex-col items-center will-change-transform"
      >
        {/* Top Cyber Node Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 dark:bg-[#0a1020]/90 border border-amber-500/30 dark:border-amber-500/40 text-xs sm:text-sm font-mono text-amber-700 dark:text-amber-400 mb-6 backdrop-blur-xl shadow-sm dark:shadow-[0_0_20px_rgba(245,158,11,0.2)]">
          <span className="flex h-2.5 w-2.5 relative">
            <span className="nav-radar-ping absolute inline-flex h-full w-full rounded-full bg-amber-500 dark:bg-amber-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500 dark:bg-amber-400" />
          </span>
          <span className="font-semibold tracking-wide text-amber-700 dark:text-amber-300">SYSTEM READY & ONLINE</span>
          <span className="text-slate-300 dark:text-slate-600">|</span>
          <span className="text-slate-600 dark:text-slate-300">NODE ID: IT-HUB-01</span>
        </div>

        {/* Hero Title with Typewriter Animation and Blinking Cyber Cursor */}
        <h1
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black tracking-tight mb-5 leading-[1.1] text-balance max-w-5xl mx-auto min-h-[1.15em] flex items-center justify-center text-center cursor-default select-none"
          onMouseEnter={pause}
          onMouseLeave={resume}
          title="Sabbil Abdillah Ferdyansyah"
          aria-label="Sabbil Abdillah Ferdyansyah"
        >
          <span className="bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-600 dark:from-amber-200 dark:via-amber-400 dark:to-yellow-500 bg-clip-text text-transparent drop-shadow-sm dark:drop-shadow-[0_4px_24px_rgba(245,158,11,0.4)] font-sans inline-block">
            {typedName}
          </span>
          <span
            className="inline-block w-[3px] sm:w-[5px] md:w-[6px] h-[0.85em] align-middle ml-1.5 sm:ml-2.5 bg-amber-500 dark:bg-amber-400 rounded-sm animate-blink shadow-[0_0_10px_rgba(245,158,11,0.5)] dark:shadow-[0_0_14px_rgba(245,158,11,0.95)]"
            aria-hidden="true"
          />
        </h1>

        {/* Specialization Roles */}
        <p className="text-sm sm:text-base md:text-lg lg:text-xl text-slate-800 dark:text-slate-200 mb-5 font-mono tracking-widest font-semibold flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
          <span>IT / NETWORKING</span>
          <span className="text-amber-500 dark:text-amber-400 font-bold">•</span>
          <span>LINUX SYSADMIN</span>
          <span className="text-amber-500 dark:text-amber-400 font-bold">•</span>
          <span>FULLSTACK DEV</span>
        </p>

        {/* Hero Description & Quote */}
        <p className="text-sm sm:text-base md:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed font-sans font-normal text-center text-balance mb-8">
          "Building, experimenting, and mastering scalable network infrastructures, Linux kernels, and dynamic web architectures."
        </p>

        {/* Action Button Group with GSAP Magnetic Attraction on primary CTA */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <Link
            ref={ctaButtonRef}
            to="/projects"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl v7-btn-gold text-dark-950 font-mono font-bold text-xs sm:text-sm tracking-wider uppercase transition-all duration-200 active:scale-95 group/btn"
          >
            <Compass className="h-4 w-4 text-dark-950 group-hover/btn:rotate-45 transition-transform duration-300" />
            <span>EXPERIENCE PORTFOLIO</span>
            <ChevronRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
          </Link>

          <Link
            to="/notes"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white hover:bg-slate-50 border border-slate-200/90 text-xs sm:text-sm font-mono text-slate-800 hover:text-slate-950 dark:bg-slate-900/80 dark:hover:bg-slate-800 dark:border-slate-700 dark:text-slate-200 dark:hover:text-white transition-all active:scale-95 shadow-sm dark:shadow-none"
          >
            <Sparkles className="h-3.5 w-3.5 text-cyan-600 dark:text-cyan-400" />
            <span>Technical Notes</span>
          </Link>
        </div>
      </div>

      {/* 8. Left Lateral Aerospace HUD Wing (Fills widescreen margins elegantly) */}
      <div className="hidden xl:flex flex-col items-start gap-3 absolute left-6 2xl:left-10 top-1/2 -translate-y-1/2 z-20 pointer-events-none text-left select-none font-mono">
        <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-amber-500/10 dark:bg-amber-400/10 border border-amber-500/20 text-[10px] text-amber-700 dark:text-amber-400 tracking-wider">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-ping" />
          <span>RADAR // 01</span>
        </div>
        
        <div className="p-3.5 rounded-2xl bg-white/80 dark:bg-[#0c1222]/80 backdrop-blur-md border border-slate-200/80 dark:border-white/10 text-[11px] space-y-2 shadow-sm max-w-[190px]">
          <div className="text-slate-400 dark:text-slate-500 uppercase tracking-widest text-[9px]">Ground Station</div>
          <div className="text-slate-800 dark:text-slate-200 font-semibold flex items-center gap-1.5">
            <Globe className="h-3.5 w-3.5 text-cyan-600 dark:text-cyan-400 shrink-0" />
            <span>Surabaya, ID</span>
          </div>
          <div className="text-slate-500 dark:text-slate-400 text-[10px]">07°14'S, 112°45'E</div>
          <div className="pt-1.5 border-t border-slate-200/60 dark:border-white/5 flex items-center justify-between text-[10px]">
            <span className="text-slate-400 dark:text-slate-500">Kernel</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-bold">6.6 LTS</span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-[10px] text-slate-400 dark:text-slate-500 pl-1">
          <Terminal className="h-3.5 w-3.5 text-amber-500" />
          <span>Arch + Debian Serv</span>
        </div>
      </div>

      {/* 9. Right Lateral Aerospace HUD Wing (Fills widescreen margins elegantly) */}
      <div className="hidden xl:flex flex-col items-end gap-3 absolute right-6 2xl:right-10 top-1/2 -translate-y-1/2 z-20 pointer-events-none text-right select-none font-mono">
        <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-cyan-500/10 dark:bg-cyan-400/10 border border-cyan-500/20 text-[10px] text-cyan-700 dark:text-cyan-400 tracking-wider">
          <span>TELEMETRY // 02</span>
          <span className="h-1.5 w-1.5 rounded-full bg-cyan-500 animate-ping" />
        </div>

        <div className="p-3.5 rounded-2xl bg-white/80 dark:bg-[#0c1222]/80 backdrop-blur-md border border-slate-200/80 dark:border-white/10 text-[11px] space-y-2 shadow-sm max-w-[190px]">
          <div className="text-slate-400 dark:text-slate-500 uppercase tracking-widest text-[9px]">Edge Network</div>
          <div className="text-slate-800 dark:text-slate-200 font-semibold flex items-center justify-end gap-1.5">
            <span>Cloudflare Edge</span>
            <Activity className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
          </div>
          <div className="text-slate-500 dark:text-slate-400 text-[10px]">18ms Latency • RTT</div>
          <div className="pt-1.5 border-t border-slate-200/60 dark:border-white/5 flex items-center justify-between text-[10px] gap-2">
            <span className="text-slate-400 dark:text-slate-500">Security</span>
            <span className="text-amber-600 dark:text-amber-400 font-bold">TLS 1.3 PASS</span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-[10px] text-slate-400 dark:text-slate-500 pr-1">
          <span>HTTP/3 QUIC Live</span>
          <ShieldCheck className="h-3.5 w-3.5 text-cyan-500" />
        </div>
      </div>
    </section>
  );
}

export default StellarHeroParallax;
