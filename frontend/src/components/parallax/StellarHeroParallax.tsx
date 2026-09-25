import { useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useTypewriter, gsap, useGSAP, useGsapMagnetic } from '../../hooks';
import { ChevronRight, Sparkles, Compass } from 'lucide-react';

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
      className="relative text-center py-16 sm:py-24 md:py-28 px-6 sm:px-10 rounded-3xl bg-gradient-to-b from-[#060b17] via-[#091124] to-[#040814] dark:from-dark-950 dark:via-[#070d1d] dark:to-dark-950/80 border border-dark-700/80 dark:border-dark-750/70 shadow-2xl overflow-hidden min-h-[460px] sm:min-h-[520px] flex flex-col items-center justify-center select-none cursor-default group"
      aria-label="Interactive Stellar Parallax Hero with GSAP"
    >
      {/* 1. Deep Cosmic Nebula Glows (Far Layer) */}
      <div 
        ref={farLayerRef}
        className="absolute inset-0 pointer-events-none will-change-transform"
      >
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[36rem] h-[36rem] bg-emerald-500/12 rounded-full blur-[140px]" />
        <div className="absolute top-1/3 right-10 w-72 h-72 bg-cyan-500/10 rounded-full blur-[110px]" />
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-indigo-500/10 rounded-full blur-[120px]" />

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
            className="stellar-stardust absolute rounded-full bg-white animate-pulse"
          />
        ))}
      </div>

      {/* 2. Anamorphic Lens Flare Beam (Mid Layer) */}
      <div
        ref={flareRef}
        className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-[1.5px] pointer-events-none overflow-hidden opacity-70 will-change-transform"
      >
        <div className="w-full h-full bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent blur-[1px]" />
        <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-48 h-8 bg-cyan-400/25 rounded-full blur-xl" />
      </div>

      {/* 3. Top-Right Giant Low-Poly Planet (StellarX Reference - Mid Layer) */}
      <div
        ref={midPlanetRef}
        className="absolute -top-12 -right-12 sm:-top-8 sm:-right-8 w-44 h-44 sm:w-64 sm:h-64 md:w-80 md:h-80 pointer-events-none will-change-transform"
      >
        <svg viewBox="0 0 200 200" className="w-full h-full filter drop-shadow-[0_0_40px_rgba(56,189,248,0.25)]">
          <defs>
            <radialGradient id="planetAtmosphere" cx="40%" cy="40%" r="60%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.3" />
              <stop offset="70%" stopColor="#0f172a" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#020617" stopOpacity="0.95" />
            </radialGradient>
          </defs>

          {/* Planet Sphere Silhouette */}
          <circle cx="100" cy="100" r="88" fill="url(#planetAtmosphere)" />

          {/* Low-Poly Facets with Emerald & Cyan Shading */}
          <polygon points="100,15 135,45 85,60" fill="#0284c7" fillOpacity="0.85" />
          <polygon points="135,45 175,70 140,95" fill="#0369a1" fillOpacity="0.9" />
          <polygon points="85,60 140,95 95,115" fill="#0ea5e9" fillOpacity="0.8" />
          <polygon points="100,15 85,60 45,45" fill="#38bdf8" fillOpacity="0.75" />
          <polygon points="45,45 85,60 55,95" fill="#0284c7" fillOpacity="0.8" />
          
          {/* Emerald / Teal Bio-Terrains */}
          <polygon points="85,60 115,100 70,120" fill="#10b981" fillOpacity="0.85" />
          <polygon points="115,100 155,115 125,145" fill="#059669" fillOpacity="0.9" />
          <polygon points="140,95 175,70 185,115" fill="#047857" fillOpacity="0.85" />
          <polygon points="140,95 185,115 155,115" fill="#10b981" fillOpacity="0.8" />
          <polygon points="55,95 85,120 40,135" fill="#34d399" fillOpacity="0.85" />

          {/* Deep Shadow Facets */}
          <polygon points="70,120 125,145 90,175" fill="#1e293b" fillOpacity="0.9" />
          <polygon points="125,145 165,160 140,185" fill="#0f172a" fillOpacity="0.95" />
          <polygon points="40,135 90,175 50,180" fill="#0f172a" fillOpacity="0.9" />

          {/* Glowing Atmosphere Rim Ring */}
          <circle cx="100" cy="100" r="88" fill="none" stroke="#38bdf8" strokeWidth="1.5" strokeOpacity="0.4" />
        </svg>
      </div>

      {/* 4. Top-Left Floating Distant Moon / Crystal Asteroid (Near Layer) */}
      <div
        ref={nearMoonRef}
        className="absolute top-10 left-6 sm:top-14 sm:left-14 w-16 h-16 sm:w-24 sm:h-24 pointer-events-none will-change-transform"
      >
        <svg viewBox="0 0 100 100" className="w-full h-full filter drop-shadow-[0_0_20px_rgba(52,211,153,0.3)]">
          <circle cx="50" cy="50" r="38" fill="#0f172a" fillOpacity="0.8" />
          <polygon points="50,15 72,32 45,45" fill="#10b981" fillOpacity="0.9" />
          <polygon points="72,32 85,55 60,65" fill="#059669" fillOpacity="0.85" />
          <polygon points="45,45 60,65 35,75" fill="#34d399" fillOpacity="0.8" />
          <polygon points="50,15 45,45 22,35" fill="#047857" fillOpacity="0.75" />
          <polygon points="22,35 45,45 25,60" fill="#065f46" fillOpacity="0.85" />
          <circle cx="50" cy="50" r="38" fill="none" stroke="#34d399" strokeWidth="1" strokeOpacity="0.4" />
        </svg>
      </div>

      {/* 5. Bottom-Left Low-Poly Planet Horizon Arc (Near Layer) */}
      <div
        ref={horizonRef}
        className="absolute -bottom-24 -left-20 sm:-bottom-28 sm:-left-16 w-64 h-64 sm:w-88 sm:h-88 pointer-events-none will-change-transform"
      >
        <svg viewBox="0 0 300 300" className="w-full h-full filter drop-shadow-[0_0_50px_rgba(16,185,129,0.2)]">
          <circle cx="100" cy="220" r="140" fill="#070d1d" fillOpacity="0.9" />
          {/* Low Poly Terrain Peaks on Rim */}
          <polygon points="60,110 110,80 140,115" fill="#10b981" fillOpacity="0.75" />
          <polygon points="110,80 170,70 190,105" fill="#34d399" fillOpacity="0.85" />
          <polygon points="170,70 230,85 240,125" fill="#059669" fillOpacity="0.7" />
          <polygon points="30,140 70,115 80,160" fill="#047857" fillOpacity="0.8" />
          
          {/* Planetary Glow Horizon */}
          <path
            d="M 0 160 Q 120 70 260 120"
            fill="none"
            stroke="#34d399"
            strokeWidth="2.5"
            strokeOpacity="0.6"
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
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0a1020]/90 border border-emerald-500/40 text-xs sm:text-sm font-mono text-emerald-400 mb-6 backdrop-blur-xl shadow-[0_0_15px_rgba(52,211,153,0.15)]">
          <span className="flex h-2.5 w-2.5 relative">
            <span className="nav-radar-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
          </span>
          <span className="font-semibold tracking-wide text-emerald-300">SYSTEM READY & ONLINE</span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-300">NODE ID: IT-HUB-01</span>
        </div>

        {/* Hero Title with Typewriter Animation and Blinking Cyber Cursor */}
        <h1
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black tracking-tight mb-5 leading-[1.1] text-balance max-w-5xl mx-auto min-h-[1.15em] flex items-center justify-center text-center cursor-default select-none"
          onMouseEnter={pause}
          onMouseLeave={resume}
          title="Sabbil Abdillah Ferdyansyah"
        >
          <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent drop-shadow-[0_4px_16px_rgba(0,0,0,0.5)] font-sans inline-block">
            {typedName}
          </span>
          <span
            className="inline-block w-[3px] sm:w-[5px] md:w-[6px] h-[0.85em] align-middle ml-1.5 sm:ml-2.5 bg-emerald-400 rounded-sm animate-blink shadow-[0_0_12px_rgba(52,211,153,0.95)]"
            aria-hidden="true"
          />
        </h1>

        {/* Specialization Roles */}
        <p className="text-sm sm:text-base md:text-lg lg:text-xl text-slate-200 mb-5 font-mono tracking-widest font-semibold flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
          <span>IT / NETWORKING</span>
          <span className="text-emerald-400 font-bold">•</span>
          <span>LINUX SYSADMIN</span>
          <span className="text-emerald-400 font-bold">•</span>
          <span>FULLSTACK DEV</span>
        </p>

        {/* Hero Description & Quote */}
        <p className="text-sm sm:text-base md:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed font-sans font-normal text-center text-balance mb-8">
          "Building, experimenting, and mastering scalable network infrastructures, Linux kernels, and dynamic web architectures."
        </p>

        {/* Action Button Group with GSAP Magnetic Attraction on primary CTA */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <Link
            ref={ctaButtonRef}
            to="/projects"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border-2 border-emerald-400/50 hover:border-emerald-300 text-sm font-mono font-bold text-emerald-300 hover:text-white transition-colors duration-200 shadow-[0_0_20px_rgba(16,185,129,0.25)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] active:scale-95 group/btn"
          >
            <Compass className="h-4 w-4 text-emerald-400 group-hover/btn:rotate-45 transition-transform duration-300" />
            <span className="tracking-wider uppercase text-xs sm:text-sm">EXPERIENCE PORTFOLIO</span>
            <ChevronRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
          </Link>

          <Link
            to="/notes"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700 hover:border-slate-600 text-xs sm:text-sm font-mono text-slate-200 hover:text-white transition-all active:scale-95 shadow-sm"
          >
            <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
            <span>Technical Notes</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default StellarHeroParallax;
