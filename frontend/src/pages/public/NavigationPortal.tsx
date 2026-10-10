import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Sparkles, 
  Compass, 
  ExternalLink,
  Layers,
  ArrowRight,
  ArrowLeft,
  ArrowUpRight,
  Sun,
  Moon,
  Shield,
  Bot,
  Activity,
  BookOpen,
  ChevronRight,
  ChevronLeft,
  X
} from 'lucide-react';
import { 
  PORTAL_CATEGORIES, 
  PORTAL_NAVIGATION_ITEMS, 
  PortalItem 
} from '../../data/portalNavigation';
import { PortalHeroBanner } from '../../components/portal/PortalHeroBanner';
import { PortalCard } from '../../components/portal/PortalCard';
import { PortalTelemetryStrip } from '../../components/portal/PortalTelemetryStrip';
import { useDocumentTitle, useGSAP, gsap } from '../../hooks';
import { useUIStore } from '../../store/ui';
import { cn } from '../../utils';

export const SLIDES = [
  {
    id: 'overview',
    num: '01',
    label: 'Overview',
    fullTitle: 'Overview & Profil Identitas',
    description: 'Profil engineering, live telemetri server Debian 12, dan tech stack',
    icon: Compass,
    badge: 'Identitas & Vitals'
  },
  {
    id: 'workstations',
    num: '02',
    label: 'Workstations',
    fullTitle: 'Featured Workstations & Flagships',
    description: 'Pusat kontrol telemetri, Omni AI studio, CyberLab, dan technical notes',
    icon: Sparkles,
    badge: 'Flagship Hubs'
  },
  {
    id: 'directory',
    num: '03',
    label: 'Direktori Modul',
    fullTitle: 'Eksplorasi Seluruh Modul & Layanan',
    description: 'Pencarian interaktif, filter kategori, dan kartu modul aktif',
    icon: Layers,
    badge: 'Katalog Modul'
  },
] as const;

export function NavigationPortal() {
  useDocumentTitle('Sabbil Abdillah Ferdyansyah — Modern IT Hub & Portfolio Portal');

  const { theme, toggleTheme } = useUIStore();
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isScrolled, setIsScrolled] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const mainContentRef = useRef<HTMLDivElement>(null);

  // Sync hash with slides on initial load
  useEffect(() => {
    const hash = window.location.hash.replace('#', '').toLowerCase();
    const slideIdx = SLIDES.findIndex(s => s.id === hash);
    if (slideIdx !== -1) {
      setCurrentSlide(slideIdx);
    }
  }, []);

  // Update URL hash when slide changes
  const goToSlide = (index: number) => {
    const clamped = Math.max(0, Math.min(SLIDES.length - 1, index));
    setCurrentSlide(clamped);
    window.history.replaceState(null, '', `#${SLIDES[clamped].id}`);
    
    // Smooth scroll to top of slide canvas
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const nextSlide = () => {
    if (currentSlide < SLIDES.length - 1) {
      goToSlide(currentSlide + 1);
    } else {
      goToSlide(0); // loop back
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      goToSlide(currentSlide - 1);
    } else {
      goToSlide(SLIDES.length - 1); // loop back
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Keyboard Navigation:
  // - ArrowLeft / ArrowRight to switch slides
  // - 1, 2, 3 to jump directly to slides
  // - / to jump to slide 3 (directory) and focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isInputFocused = ['INPUT', 'TEXTAREA'].includes((document.activeElement as HTMLElement)?.tagName);

      if (e.key === '/' && !isInputFocused) {
        e.preventDefault();
        goToSlide(2); // Jump to Directory slide
        setTimeout(() => {
          searchInputRef.current?.focus();
        }, 150);
        return;
      }

      if (isInputFocused) {
        if (e.key === 'Escape') {
          searchInputRef.current?.blur();
        }
        return;
      }

      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        e.preventDefault();
        nextSlide();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        prevSlide();
      } else if (['1', '2', '3'].includes(e.key)) {
        const target = parseInt(e.key, 10) - 1;
        if (target >= 0 && target < SLIDES.length) {
          e.preventDefault();
          goToSlide(target);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlide]);

  // GSAP: Animate slide transitions and intra-slide elements
  useGSAP(() => {
    if (!mainContentRef.current) return;

    // 1. Overall slide transition entrance
    gsap.fromTo(
      mainContentRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out' }
    );

    // 2. Specific per-slide choreographed entrance
    if (currentSlide === 0) {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.fromTo('.gsap-hero-badge', 
        { opacity: 0, y: -15 }, 
        { opacity: 1, y: 0, duration: 0.45 }
      )
      .fromTo('.gsap-hero-title', 
        { opacity: 0, y: 25 }, 
        { opacity: 1, y: 0, duration: 0.65 }, 
        '-=0.25'
      )
      .fromTo('.gsap-hero-desc', 
        { opacity: 0, y: 18 }, 
        { opacity: 1, y: 0, duration: 0.5 }, 
        '-=0.4'
      )
      .fromTo('.gsap-hero-actions', 
        { opacity: 0, y: 16 }, 
        { opacity: 1, y: 0, duration: 0.45 }, 
        '-=0.35'
      )
      .fromTo('.gsap-hero-visual', 
        { opacity: 0, scale: 0.95, y: 20 }, 
        { opacity: 1, scale: 1, y: 0, duration: 0.65 }, 
        '-=0.55'
      )
      .fromTo('.gsap-telemetry-item', 
        { opacity: 0, y: 20 }, 
        { opacity: 1, y: 0, stagger: 0.08, duration: 0.45 }, 
        '-=0.3'
      )
      .fromTo('.gsap-tech-stack', 
        { opacity: 0, y: 14 }, 
        { opacity: 1, y: 0, duration: 0.4 }, 
        '-=0.2'
      );
    } else if (currentSlide === 1) {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.fromTo('.gsap-bento-header', 
        { opacity: 0, y: -18 }, 
        { opacity: 1, y: 0, duration: 0.45 }
      )
      .fromTo('.gsap-bento-card', 
        { opacity: 0, y: 35, scale: 0.97 }, 
        { opacity: 1, y: 0, scale: 1, stagger: 0.1, duration: 0.65 }, 
        '-=0.25'
      );
    } else if (currentSlide === 2) {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.fromTo('.gsap-directory-header', 
        { opacity: 0, y: -18 }, 
        { opacity: 1, y: 0, duration: 0.45 }
      )
      .fromTo('.gsap-category-pill', 
        { opacity: 0, x: -10 }, 
        { opacity: 1, x: 0, stagger: 0.03, duration: 0.35 }, 
        '-=0.3'
      )
      .fromTo('.gsap-portal-card', 
        { opacity: 0, y: 22, scale: 0.98 }, 
        { opacity: 1, y: 0, scale: 1, stagger: 0.04, duration: 0.45 }, 
        '-=0.2'
      );
    }
  }, { dependencies: [currentSlide], scope: mainContentRef });

  // GSAP: Micro-stagger on card filter change in Slide 3
  useGSAP(() => {
    if (currentSlide !== 2 || !mainContentRef.current) return;
    gsap.fromTo(
      '.gsap-portal-card',
      { opacity: 0, y: 14 },
      { opacity: 1, y: 0, stagger: 0.03, duration: 0.35, ease: 'power2.out' }
    );
  }, { dependencies: [selectedCategory, searchQuery], scope: mainContentRef });

  // Filter items based on category and search query
  const filteredItems = useMemo(() => {
    return PORTAL_NAVIGATION_ITEMS.filter((item: PortalItem) => {
      if (selectedCategory === 'all' && !searchQuery.trim() && item.hideFromAllPortals) {
        return false;
      }

      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = 
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        (item.badge && item.badge.toLowerCase().includes(q)) ||
        (item.stats && item.stats.toLowerCase().includes(q)) ||
        (item.tags && item.tags.some(t => t.toLowerCase().includes(q)));

      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  const activeSlideData = SLIDES[currentSlide];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#070913] text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-300 selection:bg-violet-500/25 selection:text-violet-900 dark:selection:text-violet-200 relative overflow-x-hidden">
      
      {/* Skip to Main Content (Accessibility Landmark) */}
      <a 
        href="#main-portal-content" 
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-violet-600 focus:text-white focus:rounded-xl focus:shadow-2xl focus:font-mono focus:text-xs"
      >
        Lewati ke konten utama
      </a>

      {/* 1. Subtle Engineering Grid Background */}
      <div 
        className="fixed inset-0 pointer-events-none bg-[linear-gradient(to_right,rgba(15,23,42,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.03)_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:36px_36px] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_0%,#000_70%,transparent_100%)] opacity-70" 
        aria-hidden="true"
      />
      {/* Gentle Ambient Radiance */}
      <div 
        className="fixed -top-32 left-1/2 -translate-x-1/2 w-[720px] h-[400px] bg-violet-600/[0.06] dark:bg-violet-500/[0.09] rounded-full blur-[140px] pointer-events-none" 
        aria-hidden="true"
      />

      {/* 2. Top Header Navigation (Editorial Minimalist, < 72px) */}
      <header className={cn(
        "sticky top-0 z-50 transition-all duration-200 w-full",
        isScrolled 
          ? "bg-white/85 dark:bg-[#070913]/90 backdrop-blur-xl border-b border-slate-200/80 dark:border-white/10 shadow-sm" 
          : "bg-transparent border-b border-transparent"
      )}>
        <div className="w-full max-w-[1540px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 h-16 sm:h-[70px] flex items-center justify-between gap-4">
          
          {/* Logo / Domain Identity */}
          <a 
            href="/"
            onClick={(e) => {
              e.preventDefault();
              goToSlide(0);
            }}
            className="flex items-center gap-3 group outline-none focus-visible:ring-2 focus-visible:ring-violet-500 rounded-xl"
            aria-label="Kembali ke Slide 01 Portal"
          >
            <div className="w-9 h-9 rounded-xl bg-slate-900 dark:bg-white/10 border border-slate-700 dark:border-white/15 flex items-center justify-center font-mono font-bold text-xs text-white group-hover:border-violet-500 transition-colors shadow-sm">
              SF
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-bold text-sm sm:text-base text-slate-900 dark:text-white tracking-tight">
                  sabbilferdyansyah.my.id
                </span>
                <span className="hidden xs:inline-block text-[10px] font-mono px-2 py-0.5 rounded bg-violet-500/10 text-violet-700 dark:text-violet-300 border border-violet-500/20 font-semibold">
                  TKJ HUB
                </span>
              </div>
              <p className="text-[11px] font-mono text-slate-500 dark:text-slate-400 leading-none hidden sm:block">
                Personal Engineering Hub &amp; Workstations
              </p>
            </div>
          </a>

          {/* Clean Header Slide Switcher Tabs (3 Slides) */}
          <nav className="hidden sm:flex items-center gap-1 sm:gap-1.5 p-1 rounded-2xl bg-slate-100/90 dark:bg-white/[0.05] border border-slate-200/80 dark:border-white/10">
            {SLIDES.map((slide, idx) => {
              const isActive = currentSlide === idx;
              return (
                <button
                  key={slide.id}
                  type="button"
                  onClick={() => goToSlide(idx)}
                  className={cn(
                    "flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-mono font-semibold transition-all duration-200 cursor-pointer",
                    isActive
                      ? "bg-violet-600 text-white shadow-sm"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-white/10"
                  )}
                  title={`${slide.fullTitle} (Tekan ${idx + 1})`}
                >
                  <span className={cn(
                    "w-4 h-4 rounded text-[10px] flex items-center justify-center font-bold",
                    isActive ? "bg-white/20 text-white" : "text-violet-500"
                  )}>
                    {slide.num}
                  </span>
                  <span>{slide.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Header Navigation & Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => goToSlide(2)}
              className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100/80 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 hover:border-violet-400/50 transition-all cursor-pointer"
            >
              <Compass className="w-3.5 h-3.5 text-violet-500" />
              <span>Direktori</span>
              <kbd className="text-[10px] px-1 py-0.2 rounded bg-slate-200 dark:bg-white/10 font-mono">/</kbd>
            </button>

            <Link
              to="/dashboard"
              className="inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-xs font-mono font-semibold bg-violet-600 text-white hover:bg-violet-500 transition-all shadow-sm"
            >
              <span className="hidden xs:inline">Dashboard</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>

            {/* Dark / Light Mode Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Ganti mode tampilan tema"
              className="p-2 sm:p-2.5 rounded-xl bg-white/80 dark:bg-white/[0.05] border border-slate-200 dark:border-white/10 hover:border-violet-500/40 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all shadow-sm cursor-pointer"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-violet-600" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* 3. Main Slide Content Presentation Area */}
      <main 
        ref={mainContentRef}
        id="main-portal-content" 
        className="flex-1 w-full max-w-[1540px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 pt-4 sm:pt-6 pb-28 relative z-10 focus:outline-none"
        tabIndex={-1}
        role="region"
        aria-live="polite"
      >

        {/* ============================================================== */}
        {/* SLIDE 01: OVERVIEW & PROFIL IDENTITAS                           */}
        {/* ============================================================== */}
        {currentSlide === 0 && (
          <div className="space-y-8">
            {/* HERO / BANNER & PROFILE IDENTITY SECTION */}
            <PortalHeroBanner onExploreClick={() => goToSlide(2)} />

            {/* SYSTEM TELEMETRY & ENGINEERING STACK */}
            <PortalTelemetryStrip />
          </div>
        )}

        {/* ============================================================== */}
        {/* SLIDE 02: FEATURED WORKSTATIONS & FLAGSHIPS                     */}
        {/* ============================================================== */}
        {currentSlide === 1 && (
          <div className="space-y-8">
            
            {/* Section Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200/80 dark:border-white/10 gsap-bento-header">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-600 dark:text-violet-400">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold uppercase text-violet-600 dark:text-violet-400 tracking-wider">
                      STAGE 02 // WORKSTATIONS
                    </span>
                    <span className="text-slate-400">•</span>
                    <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                      4 Flagships Aktif
                    </span>
                  </div>
                  <h2 className="font-display text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                    Featured Workstations &amp; Flagship Hubs
                  </h2>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => goToSlide(0)}
                  className="px-3 py-1.5 rounded-xl text-xs font-mono text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-white/[0.05] border border-slate-200 dark:border-white/10 flex items-center gap-1 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Overview (01)</span>
                </button>
                <button
                  type="button"
                  onClick={() => goToSlide(2)}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-mono text-white bg-violet-600 hover:bg-violet-500 flex items-center gap-1 cursor-pointer shadow-sm"
                >
                  <span>Direktori (03)</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Asymmetric Bento Composition */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5 sm:gap-6">
              
              {/* Tile 1: Primary Dashboard & Telemetry Flagship (Span 7 cols) */}
              <div className="lg:col-span-7 rounded-3xl border border-slate-200/90 dark:border-white/10 bg-white/80 dark:bg-[#0c0f1e]/85 p-6 sm:p-8 flex flex-col justify-between hover:border-violet-500/40 transition-all duration-300 shadow-sm group gsap-bento-card">
                <div>
                  <div className="flex items-center justify-between gap-3 mb-5">
                    <div className="flex items-center gap-2.5">
                      <span className="p-3 rounded-2xl bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-500/20">
                        <Activity className="w-6 h-6" />
                      </span>
                      <span className="text-[10px] font-mono font-bold px-3 py-1 rounded-full bg-violet-500/10 text-violet-700 dark:text-violet-300 border border-violet-500/20">
                        FLAGSHIP DASHBOARD
                      </span>
                    </div>
                    <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-semibold">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      Telemetri Online
                    </span>
                  </div>

                  <h3 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-300 transition-colors">
                    Dashboard Telemetri &amp; Portofolio Sistem
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2.5 leading-relaxed max-w-xl">
                    Pusat kontrol dan telemetri komprehensif: pemantauan beban hardware Debian 12, arsitektur jaringan Cisco, portofolio karya implementasi, dan modul interaktif.
                  </p>

                  {/* Micro Preview Specs */}
                  <div className="grid grid-cols-3 gap-3 mt-6 p-3.5 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/60 dark:border-white/5 font-mono text-xs">
                    <div>
                      <div className="text-[10px] text-slate-400">HARDWARE</div>
                      <div className="font-semibold text-slate-700 dark:text-slate-200 text-xs sm:text-sm">CPU / RAM / Disk</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400">NETWORK</div>
                      <div className="font-semibold text-cyan-600 dark:text-cyan-400 text-xs sm:text-sm">Edge ~18ms</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400">SHOWCASE</div>
                      <div className="font-semibold text-violet-600 dark:text-violet-400 text-xs sm:text-sm">7+ Works</div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-5 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
                  <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                    Route: <code className="text-slate-700 dark:text-slate-300 font-bold">/dashboard</code>
                  </span>
                  <Link
                    to="/dashboard"
                    className="px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-mono text-xs font-semibold flex items-center gap-2 shadow-sm transition-all"
                  >
                    <span>Buka Dashboard</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              {/* Tile 2: Omni AI Multimodal Studio (Span 5 cols) */}
              <div className="lg:col-span-5 rounded-3xl border border-slate-200/90 dark:border-white/10 bg-white/80 dark:bg-[#0c0f1e]/85 p-6 sm:p-8 flex flex-col justify-between hover:border-cyan-500/40 transition-all duration-300 shadow-sm group gsap-bento-card">
                <div>
                  <div className="flex items-center justify-between gap-3 mb-5">
                    <div className="flex items-center gap-2.5">
                      <span className="p-3 rounded-2xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
                        <Bot className="w-6 h-6" />
                      </span>
                      <span className="text-[10px] font-mono font-bold px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border border-cyan-500/20">
                        SUBDOMAIN AI
                      </span>
                    </div>
                    <span className="text-[10px] font-mono px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-white/[0.05] text-slate-600 dark:text-slate-400 font-semibold">
                      Gemma 4
                    </span>
                  </div>

                  <h3 className="font-display text-2xl font-bold text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-300 transition-colors">
                    Omni AI Multimodal Studio
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2.5 leading-relaxed">
                    Asisten neural AI berkecepatan tinggi dengan kemampuan penalaran mendalam dan analisis citra visual berbasis Google Gemma &amp; Flash 3.
                  </p>

                  <div className="flex flex-wrap gap-2 mt-5">
                    {['Neural Vision', 'Code Generation', 'Realtime Stream', 'Private Subdomain'].map((tag) => (
                      <span key={tag} className="px-2.5 py-1 rounded-lg text-[10px] font-mono bg-slate-100 dark:bg-white/[0.04] text-slate-600 dark:text-slate-400 border border-slate-200/50 dark:border-white/5">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-8 pt-5 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
                  <span className="text-xs font-mono text-slate-500 dark:text-slate-400 truncate max-w-[170px]">
                    ai.sabbilferdyansyah.my.id
                  </span>
                  <a
                    href="https://ai.sabbilferdyansyah.my.id"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2.5 rounded-xl bg-slate-900 dark:bg-white/10 hover:bg-slate-800 dark:hover:bg-white/15 text-white font-mono text-xs font-semibold flex items-center gap-2 transition-all border border-slate-700 dark:border-white/20"
                  >
                    <span>Launch Studio</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>

              {/* Tile 3: CyberLab SecOps Station (Span 6 cols) */}
              <div className="lg:col-span-6 rounded-3xl border border-slate-200/90 dark:border-white/10 bg-white/80 dark:bg-[#0c0f1e]/85 p-6 sm:p-8 flex flex-col justify-between hover:border-violet-500/40 transition-all duration-300 shadow-sm group gsap-bento-card">
                <div>
                  <div className="flex items-center justify-between gap-3 mb-5">
                    <div className="flex items-center gap-2.5">
                      <span className="p-3 rounded-2xl bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-500/20">
                        <Shield className="w-6 h-6" />
                      </span>
                      <span className="text-[10px] font-mono font-bold px-3 py-1 rounded-full bg-violet-500/10 text-violet-700 dark:text-violet-300 border border-violet-500/20">
                        SECOPS &amp; CTF LAB
                      </span>
                    </div>
                    <span className="text-[10px] font-mono px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-semibold">
                      Live Station
                    </span>
                  </div>

                  <h3 className="font-display text-xl sm:text-2xl font-bold text-slate-900 dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-300 transition-colors">
                    CyberLab Security Operations
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2.5 leading-relaxed">
                    Laboratorium keamanan jaringan interaktif: pemindai port, kalkulator kriptografi, toolkit audit penetration testing, dan simulasi CTF.
                  </p>

                  <div className="flex flex-wrap gap-2 mt-5">
                    {['Port Recon', 'Hash Tools', 'Network Scanner', 'CTF Labs'].map((tag) => (
                      <span key={tag} className="px-2.5 py-1 rounded-lg text-[10px] font-mono bg-slate-100 dark:bg-white/[0.04] text-slate-600 dark:text-slate-400 border border-slate-200/50 dark:border-white/5">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-8 pt-5 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
                  <span className="text-xs font-mono text-slate-500 dark:text-slate-400 truncate max-w-[170px]">
                    cybertool.sabbilferdyansyah.my.id
                  </span>
                  <a
                    href="https://cybertool.sabbilferdyansyah.my.id"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-white/[0.05] hover:bg-violet-600 hover:text-white text-slate-800 dark:text-slate-200 font-mono text-xs font-semibold flex items-center gap-2 transition-all border border-slate-200 dark:border-white/10"
                  >
                    <span>Buka CyberLab</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>

              {/* Tile 4: Knowledgebase & Technical Notes (Span 6 cols) */}
              <div className="lg:col-span-6 rounded-3xl border border-slate-200/90 dark:border-white/10 bg-white/80 dark:bg-[#0c0f1e]/85 p-6 sm:p-8 flex flex-col justify-between hover:border-emerald-500/40 transition-all duration-300 shadow-sm group gsap-bento-card">
                <div>
                  <div className="flex items-center justify-between gap-3 mb-5">
                    <div className="flex items-center gap-2.5">
                      <span className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                        <BookOpen className="w-6 h-6" />
                      </span>
                      <span className="text-[10px] font-mono font-bold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
                        KNOWLEDGEBASE
                      </span>
                    </div>
                    <span className="text-[10px] font-mono px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-white/[0.05] text-slate-600 dark:text-slate-400 font-semibold">
                      Dokumentasi Lengkap
                    </span>
                  </div>

                  <h3 className="font-display text-xl sm:text-2xl font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-300 transition-colors">
                    Technical Notes &amp; Server Guides
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2.5 leading-relaxed">
                    Dokumentasi praktis konfigurasi sistem Linux: Debian 12 Bookworm, Nginx reverse proxy, firewall UFW, manajemen database, dan hardening SSH.
                  </p>

                  <div className="flex flex-wrap gap-2 mt-5">
                    {['Debian 12', 'Arch Hyprland', 'Nginx Config', 'Firewall UFW'].map((tag) => (
                      <span key={tag} className="px-2.5 py-1 rounded-lg text-[10px] font-mono bg-slate-100 dark:bg-white/[0.04] text-slate-600 dark:text-slate-400 border border-slate-200/50 dark:border-white/5">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-8 pt-5 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
                  <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                    Route: <code className="text-slate-700 dark:text-slate-300 font-bold">/notes</code>
                  </span>
                  <Link
                    to="/notes"
                    className="px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-white/[0.05] hover:bg-emerald-600 hover:text-white text-slate-800 dark:text-slate-200 font-mono text-xs font-semibold flex items-center gap-2 transition-all border border-slate-200 dark:border-white/10"
                  >
                    <span>Baca Dokumentasi</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* ============================================================== */}
        {/* SLIDE 03: DIREKTORI MODUL & ARSIP LAYANAN                       */}
        {/* ============================================================== */}
        {currentSlide === 2 && (
          <div className="space-y-6">
            
            {/* Section Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-white/10 gsap-directory-header">
              <div>
                <div className="flex items-center gap-2 text-violet-600 dark:text-violet-400 text-xs font-mono font-bold uppercase tracking-wider mb-1">
                  <Compass className="w-4 h-4" />
                  <span>STAGE 03 // FULL DIRECTORY ARCHIVE</span>
                </div>
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                  Eksplorasi Seluruh Modul &amp; Layanan
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl font-sans">
                  Pusat navigasi menyeluruh ke seluruh modul website, portofolio karya, dokumentasi teknis, dan utilitas sysadmin.
                </p>
              </div>

              {/* Search Input Box with Keyboard Shortcut */}
              <div className="relative w-full md:w-80 shrink-0">
                <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari modul, tools, notes... (/)"
                  aria-label="Cari modul di direktori"
                  className="w-full pl-10 pr-14 py-2.5 rounded-xl bg-white dark:bg-[#0c0f1e] border border-slate-200 dark:border-white/10 focus:border-violet-500 dark:focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20 text-xs font-mono text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 shadow-sm transition-all"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                  {searchQuery ? (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                      aria-label="Hapus kata kunci pencarian"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-slate-100 dark:bg-white/[0.06] border border-slate-200 dark:border-white/10 rounded">
                      /
                    </kbd>
                  )}
                </div>
              </div>
            </div>

            {/* Category Filter Tabs & Result Count */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none" role="tablist" aria-label="Portal Categories">
                {PORTAL_CATEGORIES.map((cat) => {
                  const isSelected = selectedCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      role="tab"
                      aria-selected={isSelected}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={cn(
                        'px-3.5 py-2 rounded-xl text-xs font-mono font-medium transition-all duration-200 shrink-0 flex items-center gap-2 cursor-pointer border gsap-category-pill',
                        isSelected
                          ? 'bg-violet-600 text-white border-violet-600 shadow-sm'
                          : 'bg-white/80 dark:bg-[#0c0f1e]/80 text-slate-600 dark:text-slate-400 border-slate-200/90 dark:border-white/10 hover:border-violet-400/50 hover:text-slate-900 dark:hover:text-white'
                      )}
                    >
                      <span>{cat.label}</span>
                    </button>
                  );
                })}
              </div>

              <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 shrink-0">
                Menampilkan <span className="text-slate-900 dark:text-white font-semibold">{filteredItems.length}</span> modul
              </div>
            </div>

            {/* Dynamic Cards Grid */}
            {filteredItems.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
                {filteredItems.map((item) => (
                  <div key={item.id} className="gsap-portal-card h-full">
                    <PortalCard item={item} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-16 text-center rounded-3xl bg-white/50 dark:bg-[#0c0f1e]/50 border border-dashed border-slate-200 dark:border-white/10 p-8">
                <Compass className="w-10 h-10 text-slate-400 dark:text-slate-600 mx-auto mb-3" />
                <h3 className="font-display text-base font-bold text-slate-800 dark:text-slate-200">
                  Tidak ada modul yang sesuai
                </h3>
                <p className="text-xs font-mono text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
                  Tidak ditemukan hasil untuk "{searchQuery}". Coba kata kunci lain atau reset filter kategori.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                  }}
                  className="mt-4 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-mono font-semibold transition-colors cursor-pointer"
                >
                  Reset Filter
                </button>
              </div>
            )}

          </div>
        )}

      </main>

      {/* 4. Persistent Floating Slide Dock (Bottom Center - 3 Slides) */}
      <aside 
        aria-label="Floating Slide Dock Controller"
        className="fixed bottom-5 inset-x-0 mx-auto w-fit z-40 max-w-[92vw]"
      >
        <div className="px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-full bg-slate-900/90 dark:bg-[#090c19]/95 backdrop-blur-xl border border-white/20 shadow-2xl flex items-center gap-2 sm:gap-3 text-white">
          
          {/* Previous Arrow */}
          <button
            type="button"
            onClick={prevSlide}
            className="p-1.5 rounded-full hover:bg-white/10 text-slate-300 hover:text-white transition-all cursor-pointer"
            title="Slide sebelumnya (← / PageUp)"
            aria-label="Slide sebelumnya"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Slide Indicator Pills (3 Slides) */}
          <div className="flex items-center gap-1.5 px-1 sm:px-2">
            {SLIDES.map((slide, idx) => {
              const isActive = currentSlide === idx;
              return (
                <button
                  key={slide.id}
                  type="button"
                  onClick={() => goToSlide(idx)}
                  className={cn(
                    "transition-all duration-300 cursor-pointer rounded-full",
                    isActive 
                      ? "w-7 sm:w-8 h-2.5 sm:h-3 bg-violet-400 ring-2 ring-violet-500/40" 
                      : "w-2.5 sm:w-3 h-2.5 sm:h-3 bg-white/30 hover:bg-white/60"
                  )}
                  title={`Buka ${slide.num}: ${slide.label}`}
                  aria-label={`Buka slide ${slide.num}: ${slide.label}`}
                />
              );
            })}
          </div>

          {/* Current Slide Number / Total (01 / 03) */}
          <span className="font-mono text-[11px] sm:text-xs font-bold text-slate-300 select-none px-1">
            {activeSlideData.num} <span className="opacity-40">/</span> {SLIDES[SLIDES.length - 1].num}
          </span>

          {/* Next Arrow */}
          <button
            type="button"
            onClick={nextSlide}
            className="p-1.5 rounded-full hover:bg-white/10 text-slate-300 hover:text-white transition-all cursor-pointer"
            title="Slide selanjutnya (→ / PageDown)"
            aria-label="Slide selanjutnya"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* Subtle Keyboard Shortcuts Hint on Desktop */}
          <div className="hidden lg:flex items-center gap-1 pl-2 border-l border-white/15 text-[10px] font-mono text-slate-400 select-none">
            <span>Shortcut:</span>
            <kbd className="px-1 py-0.5 rounded bg-white/10 text-slate-200">←</kbd>
            <kbd className="px-1 py-0.5 rounded bg-white/10 text-slate-200">→</kbd>
            <kbd className="px-1 py-0.5 rounded bg-white/10 text-slate-200">1-3</kbd>
          </div>

        </div>
      </aside>

      {/* 5. Elegant Minimalist Portal Footer */}
      <footer className="w-full border-t border-slate-200/80 dark:border-white/10 py-8 bg-white/50 dark:bg-[#070913]/80 backdrop-blur-md">
        <div className="w-full max-w-[1540px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-500 dark:text-slate-400">
          <div className="flex flex-wrap items-center gap-2">
            <span>© {new Date().getFullYear()} Sabbil Abdillah Ferdyansyah.</span>
            <span>•</span>
            <span className="text-violet-600 dark:text-violet-400 font-semibold">SMKN 1 Denpasar TKJ</span>
            <span>•</span>
            <span>Bali, Indonesia</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="https://github.com/BillZCode" target="_blank" rel="noopener noreferrer" className="hover:text-violet-500 transition-colors">
              GitHub
            </a>
            <Link to="/contact" className="hover:text-violet-500 transition-colors">
              Contact
            </Link>
            <Link to="/dashboard" className="hover:text-violet-500 transition-colors">
              Dashboard
            </Link>
            <Link to="/admin" className="hover:text-violet-500 transition-colors">
              Admin
            </Link>
          </div>
        </div>
      </footer>

    </div>
  );
}

export default NavigationPortal;
