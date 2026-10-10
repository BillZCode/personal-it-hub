import React, { useRef, useState, useEffect } from 'react';
import {
  Radio,
  Activity,
  CheckCircle2,
  Terminal,
  Shield,
  Layers,
  Sparkles,
  ArrowUp,
  Compass,
} from 'lucide-react';
import { useDocumentTitle, useGSAP, gsap } from '../../hooks';
import {
  ProfileHero,
  AboutVision,
  SkillsSection,
  FeaturedProjectsSection,
  LearningJourneySection,
  ToolsExperimentsSection,
  LatestNotesSection,
  ContactSection,
  PortfolioNavHub,
} from '../../components/portfolio';
import { cn } from '../../utils';

export function Dashboard() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeSection, setActiveSection] = useState<string>('hero');
  const [showScrollTop, setShowScrollTop] = useState<boolean>(false);

  useDocumentTitle('Dashboard & Portofolio — Sabbil Abdillah Ferdyansyah');

  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);

      // Simple spy for active section
      const sections = [
        'hero-section',
        'about-section',
        'skills-section',
        'projects-section',
        'credentials-section',
        'tools-section',
        'notes-section',
        'contact-section',
      ];

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 200 && rect.bottom >= 200) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Staggered smooth entrance for sections
  useGSAP(() => {
    gsap.fromTo(
      '.portfolio-telemetry-strip',
      { opacity: 0, y: -10 },
      { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
    );

    gsap.fromTo(
      '.portfolio-section-block',
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, stagger: 0.08, duration: 0.6, ease: 'power2.out' }
    );
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="space-y-12 sm:space-y-16 animate-in pb-20 relative">
      
      {/* 1. Sleek Cyber Telemetry Header Bar (Tycami / Tech Minimalist) */}
      <div 
        className="portfolio-telemetry-strip w-full p-3.5 sm:p-4 rounded-2xl bg-[#0c101b]/90 backdrop-blur-xl border border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs font-mono shadow-sm transition-colors"
        role="region"
        aria-label="System Telemetry Status"
      >
        <div className="flex items-center gap-3">
          <span className="relative flex h-2.5 w-2.5" aria-hidden="true">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
          </span>
          <span className="text-white font-bold uppercase tracking-wider">
            Node Status: Operational
          </span>
          <span className="hidden md:inline text-white/20" aria-hidden="true">|</span>
          <span className="hidden md:inline text-slate-400">
            Debian 12 + Arch Linux • Denpasar Node
          </span>
        </div>

        <div className="flex items-center gap-4 sm:gap-6 text-slate-400">
          <div className="flex items-center gap-1.5" title="Network ping latency">
            <Radio className="h-3.5 w-3.5 text-sky-400" aria-hidden="true" />
            <span className="text-white font-semibold">18ms</span>
            <span className="text-slate-500 text-2xs">Cloudflare Edge</span>
          </div>
          <div className="flex items-center gap-1.5" title="Cluster uptime guarantee">
            <Activity className="h-3.5 w-3.5 text-emerald-400" aria-hidden="true" />
            <span className="text-white font-semibold">99.98%</span>
            <span className="text-slate-500 text-2xs">Uptime</span>
          </div>
          <div className="hidden sm:flex items-center gap-1.5" title="TLS encryption protocol">
            <CheckCircle2 className="h-3.5 w-3.5 text-amber-400" aria-hidden="true" />
            <span className="text-white font-semibold">TLS 1.3 Strict</span>
          </div>
        </div>
      </div>

      {/* 2. In-Page Smooth Jump Nav Strip (Tycami-style minimal anchor bar) */}
      <nav 
        className="sticky top-20 z-20 w-full py-2 px-3 rounded-2xl bg-[#0c101b]/80 backdrop-blur-xl border border-white/[0.08] shadow-lg flex items-center gap-1.5 overflow-x-auto scrollbar-hide text-xs font-mono"
        aria-label="Section Quick Jump"
      >
        <span className="text-slate-500 text-[11px] px-2 uppercase tracking-wider hidden lg:inline">
          Jump to:
        </span>

        {[
          { id: 'hero-section', label: 'Overview' },
          { id: 'about-section', label: 'About' },
          { id: 'skills-section', label: 'Skills' },
          { id: 'projects-section', label: 'Projects' },
          { id: 'credentials-section', label: 'Credentials' },
          { id: 'tools-section', label: 'Tools' },
          { id: 'notes-section', label: 'Notes' },
          { id: 'contact-section', label: 'Contact' },
        ].map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => scrollToSection(item.id)}
            className={cn(
              "px-3 py-1.5 rounded-xl whitespace-nowrap transition-all cursor-pointer",
              activeSection === item.id
                ? "bg-white text-slate-950 font-bold shadow-sm"
                : "text-slate-400 hover:text-white hover:bg-white/[0.05]"
            )}
          >
            {item.label}
          </button>
        ))}
      </nav>

      {/* 3. Profile Hero Banner Section */}
      <section id="hero-section" className="portfolio-section-block">
        <ProfileHero onScrollToSection={scrollToSection} />
      </section>

      {/* 4. About Me & Vision Section */}
      <section className="portfolio-section-block">
        <AboutVision />
      </section>

      {/* 5. Technical Skills Section (5 Pillars) */}
      <section className="portfolio-section-block">
        <SkillsSection />
      </section>

      {/* 6. Featured Projects Section */}
      <section className="portfolio-section-block">
        <FeaturedProjectsSection />
      </section>

      {/* 7. Learning Journey & Certifications */}
      <section className="portfolio-section-block">
        <LearningJourneySection />
      </section>

      {/* 8. Tools & Experiments Section */}
      <section className="portfolio-section-block">
        <ToolsExperimentsSection />
      </section>

      {/* 9. Technical Knowledge Notes Section */}
      <section className="portfolio-section-block">
        <LatestNotesSection />
      </section>

      {/* 10. Contact & Social Channels Section */}
      <section className="portfolio-section-block">
        <ContactSection />
      </section>

      {/* 11. Integrated Ecosystem Directory */}
      <section className="portfolio-section-block">
        <PortfolioNavHub />
      </section>

      {/* Back to Top Floating Button */}
      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 z-40 p-3 rounded-2xl bg-white text-slate-950 shadow-2xl hover:bg-slate-200 transition-all active:scale-95 cursor-pointer flex items-center justify-center border border-slate-300"
          title="Kembali ke atas"
          aria-label="Back to top"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}

    </div>
  );
}

export default Dashboard;