import React, { useState, useMemo, useEffect, useRef } from 'react';
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
  X,
  Languages,
} from 'lucide-react';
import {
  PORTAL_CATEGORIES,
  PORTAL_NAVIGATION_ITEMS,
  PortalItem,
} from '../../data/portalNavigation';
import { PortalHeroBanner } from '../../components/portal/PortalHeroBanner';
import { PortalCard } from '../../components/portal/PortalCard';
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
  },
  {
    id: 'workstations',
    num: '02',
    label: 'Workstations',
    fullTitle: 'Featured Workstations & Flagships',
    description: 'Pusat kontrol telemetri, Omni AI studio, CyberLab, dan technical notes',
    icon: Sparkles,
  },
  {
    id: 'directory',
    num: '03',
    label: 'Direktori Modul',
    fullTitle: 'Eksplorasi Seluruh Modul & Layanan',
    description: 'Pencarian interaktif, filter kategori, dan kartu modul aktif',
    icon: Layers,
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

  useEffect(() => {
    const hash = window.location.hash.replace('#', '').toLowerCase();
    const slideIdx = SLIDES.findIndex((s) => s.id === hash);
    if (slideIdx !== -1) {
      setCurrentSlide(slideIdx);
    }
  }, []);

  const goToSlide = (index: number) => {
    const clamped = Math.max(0, Math.min(SLIDES.length - 1, index));
    setCurrentSlide(clamped);
    window.history.replaceState(null, '', `#${SLIDES[clamped].id}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const nextSlide = () => {
    if (currentSlide < SLIDES.length - 1) {
      goToSlide(currentSlide + 1);
    } else {
      goToSlide(0);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      goToSlide(currentSlide - 1);
    } else {
      goToSlide(SLIDES.length - 1);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isInputFocused = ['INPUT', 'TEXTAREA'].includes(
        (document.activeElement as HTMLElement)?.tagName
      );

      if (e.key === '/' && !isInputFocused) {
        e.preventDefault();
        goToSlide(2);
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

  useGSAP(
    () => {
      if (!mainContentRef.current) return;

      gsap.fromTo(
        mainContentRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out' }
      );

      if (currentSlide === 0) {
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

        tl.fromTo(
          '.gsap-hero-title',
          { opacity: 0, y: 25 },
          { opacity: 1, y: 0, duration: 0.65 }
        )
          .fromTo(
            '.gsap-hero-desc',
            { opacity: 0, y: 18 },
            { opacity: 1, y: 0, duration: 0.5 },
            '-=0.4'
          )
          .fromTo(
            '.gsap-hero-actions',
            { opacity: 0, y: 16 },
            { opacity: 1, y: 0, duration: 0.45 },
            '-=0.35'
          )
          .fromTo(
            '.gsap-hero-visual',
            { opacity: 0, scale: 0.95, y: 20 },
            { opacity: 1, scale: 1, y: 0, duration: 0.65 },
            '-=0.55'
          );
      } else if (currentSlide === 1) {
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

        tl.fromTo(
          '.gsap-bento-header',
          { opacity: 0, y: -18 },
          { opacity: 1, y: 0, duration: 0.45 }
        ).fromTo(
          '.gsap-bento-card',
          { opacity: 0, y: 35, scale: 0.97 },
          { opacity: 1, y: 0, scale: 1, stagger: 0.1, duration: 0.65 },
          '-=0.25'
        );
      } else if (currentSlide === 2) {
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

        tl.fromTo(
          '.gsap-directory-header',
          { opacity: 0, y: -18 },
          { opacity: 1, y: 0, duration: 0.45 }
        )
          .fromTo(
            '.gsap-category-pill',
            { opacity: 0, x: -10 },
            { opacity: 1, x: 0, stagger: 0.03, duration: 0.35 },
            '-=0.3'
          )
          .fromTo(
            '.gsap-portal-card',
            { opacity: 0, y: 22, scale: 0.98 },
            { opacity: 1, y: 0, scale: 1, stagger: 0.04, duration: 0.45 },
            '-=0.2'
          );
      }
    },
    { dependencies: [currentSlide], scope: mainContentRef }
  );

  useGSAP(
    () => {
      if (currentSlide !== 2 || !mainContentRef.current) return;
      gsap.fromTo(
        '.gsap-portal-card',
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, stagger: 0.03, duration: 0.35, ease: 'power2.out' }
      );
    },
    { dependencies: [selectedCategory, searchQuery], scope: mainContentRef }
  );

  const visibleItemsCount = useMemo(() => {
    return PORTAL_NAVIGATION_ITEMS.filter((item: PortalItem) => !item.hideFromAllPortals).length;
  }, []);

  const activeCategories = useMemo(() => {
    const visible = PORTAL_NAVIGATION_ITEMS.filter((item: PortalItem) => !item.hideFromAllPortals);
    return PORTAL_CATEGORIES.filter(
      (cat) => cat.id === 'all' || visible.some((item) => item.category === cat.id)
    );
  }, []);

  const filteredItems = useMemo(() => {
    return PORTAL_NAVIGATION_ITEMS.filter((item: PortalItem) => {
      if (item.hideFromAllPortals) {
        return false;
      }

      const matchesCategory =
        selectedCategory === 'all' || item.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.tags?.some((t) => t.toLowerCase().includes(q));

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const activeSlideData = SLIDES[currentSlide];

  return (
    <div className="min-h-screen bg-[#080A10] text-[#F4F3F8] nocturne-ambient flex flex-col font-sans relative overflow-x-hidden selection:bg-[#A3ADC4]/30 selection:text-white">
      {/* Skip to Main Content */}
      <a
        href="#main-portal-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#F4F3F8] focus:text-[#080A10] focus:font-bold focus:rounded-full focus:shadow-2xl font-mono text-xs"
      >
        Skip to portal directory
      </a>

      {/* Mega Project Ambient Star Accents */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden z-0" aria-hidden="true">
        <span className="select-none absolute top-28 left-[10%] text-white/20 text-xs animate-pulse">
          ✦
        </span>
        <span className="select-none absolute top-44 right-[14%] text-white/25 text-sm animate-pulse">
          ✦
        </span>
        <span className="select-none absolute bottom-36 left-[16%] text-white/15 text-xs">
          ✦
        </span>
        <span className="select-none absolute bottom-48 right-[12%] text-white/20 text-xs animate-pulse">
          ✦
        </span>
      </div>

      {/* Mega Project Sticky Top Navigation Bar */}
      <header
        className={cn(
          'sticky top-0 z-40 w-full transition-all duration-300',
          isScrolled
            ? 'bg-[#080A10]/90 backdrop-blur-xl border-b border-white/[0.08] shadow-crisp'
            : 'bg-[#080A10]/80 backdrop-blur-md border-b border-white/[0.06]'
        )}
      >
        <div className="w-full max-w-[1540px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 h-18 sm:h-20 flex items-center justify-between gap-4">
          {/* Left: Mega Project Crescent Emblem + Domain Identity */}
          <button
            type="button"
            onClick={() => goToSlide(0)}
            className="flex items-center gap-3 text-left cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-full bg-white/[0.06] border border-white/15 flex items-center justify-center shadow-inner group-hover:border-white/30 transition-colors">
              <svg
                className="w-4 h-4 text-[#D2D8F0]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.75}
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-semibold text-sm sm:text-base tracking-tight text-[#F4F3F8]">
                  sabbilferdyansyah.my.id
                </span>
              </div>
              <p className="text-[11px] text-[#8E9AB5] font-mono hidden md:block">
                Personal IT Hub &amp; Portfolio Gateway
              </p>
            </div>
          </button>

          {/* Center: 3-Slide Switcher Tabs (Mega Project Pill Switcher) */}
          <nav
            aria-label="Portal Slide Switcher"
            className="hidden md:flex items-center gap-1.5 p-1.5 rounded-full bg-[#0D101A] border border-white/[0.08]"
          >
            {SLIDES.map((slide, idx) => {
              const Icon = slide.icon;
              const isActive = currentSlide === idx;
              return (
                <button
                  key={slide.id}
                  type="button"
                  onClick={() => goToSlide(idx)}
                  className={cn(
                    'px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-200 flex items-center gap-2 cursor-pointer',
                    isActive
                      ? 'bg-[#F4F3F8] text-[#080A10] font-semibold shadow-glowPill'
                      : 'text-[#8E9AB5] hover:text-[#F4F3F8] hover:bg-white/[0.04]'
                  )}
                >
                  <span className={cn('font-mono text-[10px]', isActive ? 'text-[#080A10]/70' : 'text-[#5E687E]')}>
                    {slide.num}
                  </span>
                  <Icon className="w-3.5 h-3.5" />
                  <span>{slide.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right: Quick Search Trigger + Luminous White Dashboard Pill + Theme Toggle */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            <button
              type="button"
              onClick={() => {
                goToSlide(2);
                setTimeout(() => searchInputRef.current?.focus(), 150);
              }}
              className="hidden lg:inline-flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-mono text-[#A3ADC4] hover:text-[#F4F3F8] bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 transition-all cursor-pointer"
              title="Cari modul (Tekan /)"
            >
              <Compass className="w-3.5 h-3.5 text-[#5B8DEF]" />
              <span>Direktori</span>
              <kbd className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#080A10] border border-white/10 font-mono text-[#8E9AB5]">
                /
              </kbd>
            </button>

            <Link
              to="/dashboard"
              className="h-9 sm:h-10 px-4 sm:px-5 rounded-full text-xs sm:text-sm font-sans font-semibold bg-[#F4F3F8] text-[#080A10] hover:bg-white transition-all shadow-glowPill inline-flex items-center gap-1.5"
            >
              <span className="hidden xs:inline">Dashboard</span>
              <span>→</span>
            </Link>

            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Ganti mode tampilan tema"
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/[0.06] border border-white/15 hover:bg-white/[0.12] text-[#D2D8F0] hover:text-white transition-all flex items-center justify-center cursor-pointer"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-[#F7C95C]" />
              ) : (
                <Moon className="w-4 h-4 text-[#5B8DEF]" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Slide Content Presentation Area */}
      <main
        ref={mainContentRef}
        id="main-portal-content"
        className="flex-1 w-full max-w-[1540px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 pt-6 sm:pt-8 pb-28 relative z-10 focus:outline-none"
        tabIndex={-1}
        role="region"
        aria-live="polite"
      >
        {/* ============================================================== */}
        {/* SLIDE 01: OVERVIEW & PROFIL IDENTITAS                           */}
        {/* ============================================================== */}
        {currentSlide === 0 && (
          <PortalHeroBanner onExploreClick={() => goToSlide(2)} />
        )}

        {/* ============================================================== */}
        {/* SLIDE 02: FEATURED WORKSTATIONS & FLAGSHIPS                     */}
        {/* ============================================================== */}
        {currentSlide === 1 && (
          <div className="space-y-8">
            {/* Section Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-white/[0.06] gsap-bento-header">
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-[#5B8DEF]/15 border border-[#5B8DEF]/40 text-[#5B8DEF] flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-mono font-semibold uppercase text-[#A3ADC4] tracking-widest">
                      ✦ STAGE 02 // WORKSTATIONS
                    </span>
                    <span className="text-white/20">•</span>
                    <span className="text-xs font-mono text-[#4ED69E] font-semibold">
                      5 Flagships Aktif
                    </span>
                  </div>
                  <h2 className="font-display text-2xl sm:text-3xl font-medium text-[#F4F3F8] tracking-tight">
                    Featured Workstations &amp;{' '}
                    <span className="italic font-normal text-[#D2D8F0]">Flagship Hubs</span>
                  </h2>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => goToSlide(0)}
                  className="h-10 px-4 rounded-full text-xs font-mono text-[#D2D8F0] hover:text-white bg-white/[0.06] hover:bg-white/[0.1] border border-white/15 flex items-center gap-1.5 cursor-pointer transition-all"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Overview (01)</span>
                </button>
                <button
                  type="button"
                  onClick={() => goToSlide(2)}
                  className="h-10 px-5 rounded-full text-xs font-sans font-semibold text-[#080A10] bg-[#F4F3F8] hover:bg-white flex items-center gap-1.5 cursor-pointer shadow-glowPill transition-all"
                >
                  <span>Direktori (03)</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Asymmetric Bento Composition in Mega Project Nocturne Window Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5 sm:gap-6">
              {/* Tile 1: Primary Dashboard & Telemetry Flagship (Span 7 cols) */}
              <div className="lg:col-span-7 rounded-2xl border border-white/[0.08] bg-[#0D101A] overflow-hidden flex flex-col justify-between hover:border-[#4ED69E]/50 transition-all duration-300 shadow-nocturneCard group gsap-bento-card">
                <div>
                  <div className="bg-[#080A10] px-5 py-3 border-b border-white/[0.06] flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
                        <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
                        <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
                      </div>
                      <span className="text-[11px] font-mono text-[#8E9AB5] ml-2">
                        WORKSTATION // 01
                      </span>
                    </div>
                  </div>

                  <div className="p-6 sm:p-8">
                    <div className="flex items-center gap-3 mb-5">
                      <span className="w-11 h-11 rounded-xl bg-[#4ED69E]/15 text-[#4ED69E] border border-[#4ED69E]/40 flex items-center justify-center">
                        <Activity className="w-5 h-5" />
                      </span>
                    </div>

                    <h3 className="font-display text-2xl sm:text-3xl font-medium text-[#F4F3F8] group-hover:text-white transition-colors">
                      Dashboard Telemetri &amp; Portofolio Sistem
                    </h3>
                    <p className="text-xs sm:text-sm text-[#8E9AB5] mt-2.5 leading-relaxed max-w-xl">
                      Pusat kontrol dan telemetri komprehensif: pemantauan beban hardware Debian 12,
                      arsitektur jaringan Cisco, portofolio karya implementasi, dan modul interaktif.
                    </p>

                    <div className="grid grid-cols-3 gap-3 mt-6 p-4 rounded-xl bg-[#080A10] border border-white/[0.06] font-mono text-xs">
                      <div>
                        <div className="text-[10px] text-[#5E687E]">HARDWARE</div>
                        <div className="font-semibold text-[#F4F3F8] text-xs sm:text-sm">
                          CPU / RAM / Disk
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] text-[#5E687E]">NETWORK</div>
                        <div className="font-semibold text-[#5B8DEF] text-xs sm:text-sm">
                          Edge ~18ms
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] text-[#5E687E]">SHOWCASE</div>
                        <div className="font-semibold text-[#4ED69E] text-xs sm:text-sm">
                          7+ Works
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="px-6 sm:px-8 pb-6 pt-4 border-t border-white/[0.06] flex items-center justify-between">
                  <span className="text-xs font-mono text-[#8E9AB5]">
                    Route: <code className="text-[#D2D8F0] font-semibold">/dashboard</code>
                  </span>
                  <Link
                    to="/dashboard"
                    className="h-10 px-5 rounded-full bg-[#F4F3F8] hover:bg-white text-[#080A10] font-sans text-xs font-semibold flex items-center gap-2 shadow-glowPill transition-all"
                  >
                    <span>Buka Dashboard</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              {/* Tile 2: Omni AI Multimodal Studio (Span 5 cols) */}
              <div className="lg:col-span-5 rounded-2xl border border-white/[0.08] bg-[#0D101A] overflow-hidden flex flex-col justify-between hover:border-[#5B8DEF]/50 transition-all duration-300 shadow-nocturneCard group gsap-bento-card">
                <div>
                  <div className="bg-[#080A10] px-5 py-3 border-b border-white/[0.06] flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
                        <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
                        <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
                      </div>
                      <span className="text-[11px] font-mono text-[#8E9AB5] ml-2">
                        WORKSTATION // 02
                      </span>
                    </div>
                  </div>

                  <div className="p-6 sm:p-8">
                    <div className="flex items-center gap-3 mb-5">
                      <span className="w-11 h-11 rounded-xl bg-[#5B8DEF]/15 text-[#5B8DEF] border border-[#5B8DEF]/40 flex items-center justify-center">
                        <Bot className="w-5 h-5" />
                      </span>
                    </div>

                    <h3 className="font-display text-2xl font-medium text-[#F4F3F8] group-hover:text-white transition-colors">
                      Omni AI Multimodal Studio
                    </h3>
                    <p className="text-xs sm:text-sm text-[#8E9AB5] mt-2.5 leading-relaxed">
                      Asisten neural AI berkecepatan tinggi dengan kemampuan penalaran mendalam dan
                      analisis citra visual berbasis Google Gemma &amp; Flash 3.
                    </p>

                    <div className="flex flex-wrap gap-2 mt-5">
                      {['Neural Vision', 'Code Generation', 'Realtime Stream', 'Private Subdomain'].map(
                        (tag) => (
                          <span
                            key={tag}
                            className="px-2.5 py-1 rounded-full text-[10px] font-mono bg-[#080A10] text-[#A3ADC4] border border-white/[0.08]"
                          >
                            {tag}
                          </span>
                        )
                      )}
                    </div>
                  </div>
                </div>

                <div className="px-6 sm:px-8 pb-6 pt-4 border-t border-white/[0.06] flex items-center justify-between">
                  <span className="text-xs font-mono text-[#8E9AB5] truncate max-w-[170px]">
                    ai.sabbilferdyansyah.my.id
                  </span>
                  <a
                    href="https://ai.sabbilferdyansyah.my.id"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-10 px-5 rounded-full bg-white/[0.06] hover:bg-white/[0.12] text-[#F4F3F8] font-sans text-xs font-medium flex items-center gap-2 transition-all border border-white/15"
                  >
                    <span>Launch Studio</span>
                    <ExternalLink className="w-3.5 h-3.5 text-[#D2D8F0]" />
                  </a>
                </div>
              </div>

              {/* Tile 3: CyberLab SecOps Station (Span 6 cols) */}
              <div className="lg:col-span-6 rounded-2xl border border-white/[0.08] bg-[#0D101A] overflow-hidden flex flex-col justify-between hover:border-[#F26676]/50 transition-all duration-300 shadow-nocturneCard group gsap-bento-card">
                <div>
                  <div className="bg-[#080A10] px-5 py-3 border-b border-white/[0.06] flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
                        <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
                        <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
                      </div>
                      <span className="text-[11px] font-mono text-[#8E9AB5] ml-2">
                        WORKSTATION // 03
                      </span>
                    </div>
                  </div>

                  <div className="p-6 sm:p-8">
                    <div className="flex items-center gap-3 mb-5">
                      <span className="w-11 h-11 rounded-xl bg-[#F26676]/15 text-[#F26676] border border-[#F26676]/40 flex items-center justify-center">
                        <Shield className="w-5 h-5" />
                      </span>
                    </div>

                    <h3 className="font-display text-xl sm:text-2xl font-medium text-[#F4F3F8] group-hover:text-white transition-colors">
                      CyberLab Security Operations
                    </h3>
                    <p className="text-xs sm:text-sm text-[#8E9AB5] mt-2.5 leading-relaxed">
                      Laboratorium keamanan jaringan interaktif: pemindai port, kalkulator
                      kriptografi, toolkit audit penetration testing, dan simulasi CTF.
                    </p>

                    <div className="flex flex-wrap gap-2 mt-5">
                      {['Port Recon', 'Hash Tools', 'Network Scanner', 'CTF Labs'].map((tag) => (
                        <span
                          key={tag}
                          className="px-2.5 py-1 rounded-full text-[10px] font-mono bg-[#080A10] text-[#A3ADC4] border border-white/[0.08]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="px-6 sm:px-8 pb-6 pt-4 border-t border-white/[0.06] flex items-center justify-between">
                  <span className="text-xs font-mono text-[#8E9AB5] truncate max-w-[170px]">
                    cybertool.sabbilferdyansyah.my.id
                  </span>
                  <a
                    href="https://cybertool.sabbilferdyansyah.my.id"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-10 px-5 rounded-full bg-white/[0.06] hover:bg-white/[0.12] text-[#F4F3F8] font-sans text-xs font-medium flex items-center gap-2 transition-all border border-white/15"
                  >
                    <span>Buka CyberLab</span>
                    <ExternalLink className="w-3.5 h-3.5 text-[#D2D8F0]" />
                  </a>
                </div>
              </div>

              {/* Tile 4: Technical Notes & Knowledgebase (Span 6 cols) */}
              <div className="lg:col-span-6 rounded-2xl border border-white/[0.08] bg-[#0D101A] overflow-hidden flex flex-col justify-between hover:border-[#F7C95C]/50 transition-all duration-300 shadow-nocturneCard group gsap-bento-card">
                <div>
                  <div className="bg-[#080A10] px-5 py-3 border-b border-white/[0.06] flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
                        <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
                        <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
                      </div>
                      <span className="text-[11px] font-mono text-[#8E9AB5] ml-2">
                        WORKSTATION // 04
                      </span>
                    </div>
                  </div>

                  <div className="p-6 sm:p-8">
                    <div className="flex items-center gap-3 mb-5">
                      <span className="w-11 h-11 rounded-xl bg-[#F7C95C]/15 text-[#F7C95C] border border-[#F7C95C]/40 flex items-center justify-center">
                        <BookOpen className="w-5 h-5" />
                      </span>
                    </div>

                    <h3 className="font-display text-xl sm:text-2xl font-medium text-[#F4F3F8] group-hover:text-white transition-colors">
                      Technical Notes &amp; Engineering Guides
                    </h3>
                    <p className="text-xs sm:text-sm text-[#8E9AB5] mt-2.5 leading-relaxed">
                      Dokumentasi lengkap panduan administrasi server Debian 12, konfigurasi Nginx
                      reverse proxy, manajemen jaringan Cisco, dan catatan teknis.
                    </p>

                    <div className="flex flex-wrap gap-2 mt-5">
                      {['Debian 12', 'Nginx SSL', 'Cisco Routing', 'Firewall UFW'].map((tag) => (
                        <span
                          key={tag}
                          className="px-2.5 py-1 rounded-full text-[10px] font-mono bg-[#080A10] text-[#A3ADC4] border border-white/[0.08]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="px-6 sm:px-8 pb-6 pt-4 border-t border-white/[0.06] flex items-center justify-between">
                  <span className="text-xs font-mono text-[#8E9AB5]">
                    Route: <code className="text-[#D2D8F0] font-semibold">/notes</code>
                  </span>
                  <Link
                    to="/notes"
                    className="h-10 px-5 rounded-full bg-white/[0.06] hover:bg-white/[0.12] text-[#F4F3F8] font-sans text-xs font-medium flex items-center gap-2 transition-all border border-white/15"
                  >
                    <span>Baca Dokumentasi</span>
                    <ArrowUpRight className="w-4 h-4 text-[#D2D8F0]" />
                  </Link>
                </div>
              </div>

              {/* Tile 5: Transkrip & Terjemahan AI (Span 12 cols) */}
              <div className="lg:col-span-12 rounded-2xl border border-white/[0.08] bg-[#0D101A] overflow-hidden flex flex-col justify-between hover:border-[#4ED69E]/50 transition-all duration-300 shadow-nocturneCard group gsap-bento-card">
                <div className="bg-[#080A10] px-5 py-3 border-b border-white/[0.06] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
                      <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
                      <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
                    </div>
                    <span className="text-[11px] font-mono text-[#8E9AB5] ml-2">
                      WORKSTATION // 05
                    </span>
                  </div>
                </div>

                <div className="p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="space-y-3 max-w-3xl">
                    <div className="flex items-center gap-3">
                      <span className="w-11 h-11 rounded-xl bg-[#4ED69E]/15 text-[#4ED69E] border border-[#4ED69E]/40 flex items-center justify-center">
                        <Languages className="w-5 h-5" />
                      </span>
                    </div>
                    <h3 className="font-display text-xl sm:text-2xl font-medium text-[#F4F3F8] group-hover:text-white transition-colors">
                      Transkrip &amp; Terjemahan Video AI
                    </h3>
                    <p className="text-xs sm:text-sm text-[#8E9AB5] leading-relaxed">
                      Buat transkrip dan terjemahkan video YouTube, TikTok, Instagram, atau rekaman audio/video lokal ke bahasa apa saja dengan ekspor SRT, VTT, TXT, dan Markdown.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 shrink-0">
                    <Link
                      to="/transkrip"
                      className="h-10 px-5 rounded-full bg-[#F4F3F8] hover:bg-white text-[#080A10] font-sans text-xs font-semibold flex items-center gap-2 shadow-glowPill transition-all"
                    >
                      <span>Buka Transkrip AI</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </Link>
                    <a
                      href="https://transkrip.sabbilferdyansyah.my.id"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="h-10 px-5 rounded-full bg-white/[0.06] hover:bg-white/[0.12] text-[#F4F3F8] font-sans text-xs font-medium flex items-center gap-2 transition-all border border-white/15"
                    >
                      <span>transkrip.sabbilferdyansyah.my.id</span>
                      <ExternalLink className="w-3.5 h-3.5 text-[#D2D8F0]" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* SLIDE 03: DIREKTORI LENGKAP MODUL & PENCARIAN                   */}
        {/* ============================================================== */}
        {currentSlide === 2 && (
          <div className="space-y-6">
            {/* Header & Search Controls */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 pb-5 border-b border-white/[0.06] gsap-directory-header">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-semibold uppercase text-[#A3ADC4] tracking-widest">
                    ✦ STAGE 03 // DIRECTORY
                  </span>
                  <span className="text-white/20">•</span>
                  <span className="text-xs font-mono text-[#8E9AB5]">
                    {visibleItemsCount} Total Layanan Terdaftar
                  </span>
                </div>
                <h2 className="font-display text-2xl sm:text-3xl font-medium text-[#F4F3F8] tracking-tight">
                  Direktori Lengkap Modul &amp;{' '}
                  <span className="italic font-normal text-[#D2D8F0]">Layanan</span>
                </h2>
              </div>

              {/* Search Input Box */}
              <div className="relative w-full lg:w-96">
                <Search
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8E9AB5] pointer-events-none"
                  aria-hidden="true"
                />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari modul, tools, atau kata kunci..."
                  aria-label="Cari modul di portal"
                  className="w-full pl-11 pr-14 py-2.5 rounded-full bg-[#0D101A] border border-white/10 text-xs sm:text-sm text-[#F4F3F8] placeholder:text-[#5E687E] focus:outline-none focus:border-[#5B8DEF] font-mono transition-all"
                />
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
                  {searchQuery ? (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      aria-label="Bersihkan pencarian"
                      className="p-1 rounded-full hover:bg-white/10 text-[#8E9AB5] hover:text-white transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono text-[#8E9AB5] bg-[#080A10] rounded-full border border-white/10">
                      /
                    </kbd>
                  )}
                </div>
              </div>
            </div>

            {/* Category Filter Tabs & Result Count */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div
                className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide"
                role="tablist"
                aria-label="Portal Categories"
              >
                {activeCategories.map((cat) => {
                  const isSelected = selectedCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      role="tab"
                      aria-selected={isSelected}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={cn(
                        'px-4 py-2 rounded-full text-xs font-medium transition-all duration-200 shrink-0 flex items-center gap-2 cursor-pointer border gsap-category-pill',
                        isSelected
                          ? 'bg-[#F4F3F8] text-[#080A10] border-white font-semibold shadow-glowPill'
                          : 'bg-[#0D101A] text-[#8E9AB5] border-white/[0.08] hover:border-white/20 hover:text-[#F4F3F8]'
                      )}
                    >
                      <span>{cat.label}</span>
                    </button>
                  );
                })}
              </div>

              <div className="text-[11px] font-mono text-[#8E9AB5] shrink-0">
                Menampilkan{' '}
                <span className="text-[#F4F3F8] font-semibold">{filteredItems.length}</span> modul
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
              <div className="py-16 text-center rounded-2xl bg-[#0D101A] border border-white/[0.08] p-8">
                <Compass className="w-10 h-10 text-[#5E687E] mx-auto mb-3" />
                <h3 className="font-display text-lg font-medium text-[#F4F3F8]">
                  Tidak ada modul yang sesuai
                </h3>
                <p className="text-xs font-mono text-[#8E9AB5] mt-1 max-w-sm mx-auto">
                  Tidak ditemukan hasil untuk &ldquo;{searchQuery}&rdquo;. Coba kata kunci lain atau
                  reset filter kategori.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                  }}
                  className="mt-5 h-10 px-6 rounded-full bg-[#F4F3F8] hover:bg-white text-[#080A10] text-xs font-sans font-semibold transition-colors cursor-pointer shadow-glowPill"
                >
                  Reset Filter
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Mega Project Persistent Floating Slide Dock (Bottom Center) */}
      <aside
        aria-label="Floating Slide Dock Controller"
        className="fixed bottom-5 inset-x-0 mx-auto w-fit z-40 max-w-[92vw]"
      >
        <div className="px-4 py-2.5 rounded-full bg-[#0D101A]/90 backdrop-blur-xl border border-white/15 shadow-2xl flex items-center gap-3 text-[#F4F3F8]">
          <button
            type="button"
            onClick={prevSlide}
            className="p-1.5 rounded-full hover:bg-white/10 text-[#A3ADC4] hover:text-white transition-all cursor-pointer"
            title="Slide sebelumnya (← / PageUp)"
            aria-label="Slide sebelumnya"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-1.5 px-1 sm:px-2">
            {SLIDES.map((slide, idx) => {
              const isActive = currentSlide === idx;
              return (
                <button
                  key={slide.id}
                  type="button"
                  onClick={() => goToSlide(idx)}
                  className={cn(
                    'transition-all duration-300 cursor-pointer rounded-full',
                    isActive
                      ? 'w-7 sm:w-8 h-2.5 sm:h-3 bg-[#F4F3F8] shadow-glowPill'
                      : 'w-2.5 sm:w-3 h-2.5 sm:h-3 bg-white/25 hover:bg-white/50'
                  )}
                  title={`Buka ${slide.num}: ${slide.label}`}
                  aria-label={`Buka slide ${slide.num}: ${slide.label}`}
                />
              );
            })}
          </div>

          <span className="font-mono text-[11px] sm:text-xs font-semibold text-[#D2D8F0] select-none px-1">
            {activeSlideData.num} <span className="opacity-40">/</span>{' '}
            {SLIDES[SLIDES.length - 1].num}
          </span>

          <button
            type="button"
            onClick={nextSlide}
            className="p-1.5 rounded-full hover:bg-white/10 text-[#A3ADC4] hover:text-white transition-all cursor-pointer"
            title="Slide selanjutnya (→ / PageDown)"
            aria-label="Slide selanjutnya"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <div className="hidden lg:flex items-center gap-1.5 pl-2.5 border-l border-white/10 text-[10px] font-mono text-[#8E9AB5] select-none">
            <span>Shortcut:</span>
            <kbd className="px-1.5 py-0.5 rounded bg-[#080A10] border border-white/10 text-[#D2D8F0]">
              ←
            </kbd>
            <kbd className="px-1.5 py-0.5 rounded bg-[#080A10] border border-white/10 text-[#D2D8F0]">
              →
            </kbd>
            <kbd className="px-1.5 py-0.5 rounded bg-[#080A10] border border-white/10 text-[#D2D8F0]">
              1-3
            </kbd>
          </div>
        </div>
      </aside>

      {/* Mega Project Minimalist Nocturne Footer */}
      <footer className="w-full border-t border-white/[0.06] py-8 bg-[#080A10]">
        <div className="w-full max-w-[1540px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[#5E687E]">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[#D2D8F0]">✦</span>
            <span className="text-[#F4F3F8] font-sans font-medium">
              © {new Date().getFullYear()} Sabbil Abdillah Ferdyansyah.
            </span>
            <span>•</span>
            <span className="text-[#5B8DEF] font-semibold">SMKN 1 Denpasar TKJ</span>
            <span>•</span>
            <span className="text-[#8E9AB5]">Bali, Indonesia</span>
          </div>
          <div className="flex items-center gap-4 text-[#8E9AB5]">
            <a
              href="https://github.com/BillZCode"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#F4F3F8] transition-colors"
            >
              GitHub
            </a>
            <Link to="/contact" className="hover:text-[#F4F3F8] transition-colors">
              Contact
            </Link>
            <Link to="/dashboard" className="hover:text-[#F4F3F8] transition-colors">
              Dashboard
            </Link>
            <Link to="/admin" className="hover:text-[#F4F3F8] transition-colors">
              Admin
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default NavigationPortal;
