import React, { useState, useRef, useLayoutEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Terminal, ExternalLink, X, BookOpen, Wrench, Shield, Cpu, HardDrive } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export const TycamiNavbar: React.FC = () => {
  const location = useLocation();
  const navRef = useRef<HTMLElement>(null);
  const linksRef = useRef<HTMLDivElement>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hubDrawerOpen, setHubDrawerOpen] = useState(false);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(navRef.current, {
        y: -50,
        opacity: 0,
        duration: 1.5,
        ease: 'power4.out',
        delay: 0.2,
      });

      ScrollTrigger.create({
        start: 'top -50',
        end: 99999,
        toggleClass: { className: 'glass-panel', targets: navRef.current },
        onUpdate: (self) => {
          if (self.direction === 1 && self.scroll() > 100) {
            gsap.to(navRef.current, { yPercent: -100, duration: 0.4, ease: 'power2.inOut' });
          } else {
            gsap.to(navRef.current, { yPercent: 0, duration: 0.4, ease: 'power2.out' });
          }
        },
      });
    }, navRef);

    return () => ctx.revert();
  }, []);

  const navItems = [
    { name: 'About', path: '/about' },
    { name: 'Project', path: '/work' },
    { name: 'Services', path: '/services' },
    { name: 'Award', path: '/achievements' },
    { name: 'Lab', path: '/playground' },
    { name: 'Contact', path: '/contact' },
  ];

  const hubItems = [
    { title: 'Navigation Portal', desc: 'Main hub directory', path: '/portal', icon: ExternalLink },
    { title: 'Technical Notes', desc: 'Sysadmin & Linux guides', path: '/notes', icon: BookOpen },
    { title: 'DevKit CLI Suite', desc: 'Sysadmin CLI & utilities', path: '/devkit', icon: Terminal },
    { title: 'CyberLab Arena', desc: 'Interactive security playground', path: '/cyberlab', icon: Shield },
    { title: 'System Telemetry', desc: 'Live server metrics & status', path: '/system', icon: Cpu },
    { title: 'Unified Tools', desc: 'Networking & downloader suite', path: '/tools', icon: Wrench },
    { title: 'Cloud Vault Drive', desc: 'Personal encrypted storage', path: '/drive', icon: HardDrive },
  ];

  const isCurrent = (path: string) => {
    if (path === '/work') {
      return location.pathname === '/work' || location.pathname === '/projects';
    }
    if (path === '/achievements') {
      return location.pathname === '/achievements' || location.pathname === '/certificates';
    }
    if (path === '/playground') {
      return location.pathname === '/playground';
    }
    return location.pathname === path;
  };

  return (
    <>
      <nav
        ref={navRef}
        className="fixed top-0 left-0 right-0 z-50 transition-colors duration-500 py-4 px-6 md:px-12 flex items-center justify-between border-b border-transparent"
      >
        {/* Brand / Logo */}
        <Link to="/dashboard" className="text-xl font-sans tracking-tighter shrink-0 relative group">
          <span className="font-black uppercase tracking-widest text-white">Portfolio</span>
          <span className="text-[var(--color-accent)]">.</span>
          <div className="absolute -bottom-1 left-0 w-0 h-px bg-white transition-all duration-300 group-hover:w-full" />
        </Link>

        {/* Desktop Centered Links */}
        <div
          ref={linksRef}
          className="hidden md:flex items-center gap-8 justify-center absolute left-1/2 -translate-x-1/2"
        >
          {navItems.map((item) => {
            const active = isCurrent(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`font-mono text-xs uppercase tracking-[0.2em] transition-opacity duration-300 relative group overflow-hidden ${
                  active ? 'opacity-100 text-[var(--color-accent)]' : 'opacity-60 hover:opacity-100 text-white'
                }`}
              >
                <span className="relative z-10 inline-block transition-transform duration-300 group-hover:-translate-y-full">
                  {item.name}
                </span>
                <span className="absolute inset-0 z-10 inline-block transition-transform duration-300 translate-y-full group-hover:translate-y-0 text-[var(--color-accent)]">
                  {item.name}
                </span>
              </Link>
            );
          })}
        </div>

        {/* Right Action: Return to Portal + Ecosystem Hub Drawer Trigger + Mobile Toggle */}
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-full border border-[var(--color-border)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] text-white/70 font-mono text-[10px] uppercase tracking-widest transition-all duration-300 bg-black/40 hover:bg-black/80"
            title="Kembali ke Navigation Portal"
          >
            <span>← Portal</span>
          </Link>

          <button
            onClick={() => setHubDrawerOpen(true)}
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--color-border)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] text-white/70 font-mono text-[10px] uppercase tracking-widest transition-all duration-300 bg-black/40 hover:bg-black/80"
            title="Open Ecosystem Terminal"
          >
            <Terminal className="w-3.5 h-3.5 text-[var(--color-accent)]" />
            <span>IT-Hub</span>
          </button>

          {/* Mobile hamburger button */}
          <button
            className="md:hidden relative w-8 h-8 flex flex-col justify-center items-end outline-none z-[60]"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation"
          >
            <div
              className={`h-px bg-white transition-all duration-300 absolute right-0 ${
                mobileMenuOpen ? 'w-6 rotate-45' : 'w-6 -translate-y-1'
              }`}
            />
            <div
              className={`h-px bg-white transition-all duration-300 absolute right-0 ${
                mobileMenuOpen ? 'w-6 -rotate-45' : 'w-4 translate-y-1'
              }`}
            />
          </button>
        </div>
      </nav>

      {/* Mobile Fullscreen Navigation Overlay */}
      <div
        className={`fixed inset-0 bg-[#0a0a0a] z-40 flex flex-col items-center justify-center transition-all duration-500 ease-in-out md:hidden ${
          mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex flex-col gap-8 items-center text-center">
          {navItems.map((item) => {
            const active = isCurrent(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`font-mono text-2xl uppercase tracking-[0.2em] transition-colors duration-300 ${
                  active ? 'text-[var(--color-accent)]' : 'text-white hover:text-[var(--color-accent)]'
                }`}
              >
                {item.name}
              </Link>
            );
          })}

          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="mt-4 font-mono text-xs uppercase tracking-widest text-white/70 hover:text-white flex items-center gap-2 border border-white/20 px-5 py-2.5 rounded-full"
          >
            <span>← Kembali ke Portal</span>
          </Link>

          <button
            onClick={() => {
              setMobileMenuOpen(false);
              setHubDrawerOpen(true);
            }}
            className="mt-2 font-mono text-xs uppercase tracking-widest text-[var(--color-accent)] flex items-center gap-2 border border-[var(--color-accent)]/30 px-5 py-2.5 rounded-full bg-[var(--color-accent)]/10"
          >
            <Terminal className="w-4 h-4" />
            <span>Launch IT-Hub Directory</span>
          </button>
        </div>
      </div>

      {/* Slide-out Ecosystem Hub Drawer */}
      {hubDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div
            className="w-full max-w-md bg-[#0c0f17] border-l border-[var(--color-border)] p-6 md:p-8 flex flex-col h-full overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-6 border-b border-[var(--color-border)]">
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-[var(--color-accent)] animate-pulse" />
                <span className="font-mono text-xs uppercase tracking-[0.2em] text-white">
                  Personal IT Ecosystem
                </span>
              </div>
              <button
                onClick={() => setHubDrawerOpen(false)}
                className="w-8 h-8 rounded-full border border-[var(--color-border)] flex items-center justify-center hover:border-white text-white/70 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="mt-4 font-mono text-xs text-[var(--color-secondary)] leading-relaxed">
              Quick access to all technical workstations, system monitoring, and documentation modules.
            </p>

            <div className="mt-6 flex flex-col gap-3">
              {hubItems.map((hub) => {
                const Icon = hub.icon;
                return (
                  <Link
                    key={hub.path}
                    to={hub.path}
                    onClick={() => setHubDrawerOpen(false)}
                    className="p-4 rounded-xl border border-[var(--color-border)] bg-black/40 hover:bg-white/[0.04] hover:border-[var(--color-accent)] transition-all group flex items-start gap-4"
                  >
                    <div className="w-9 h-9 rounded-lg border border-[var(--color-border)] bg-black/60 flex items-center justify-center text-white/80 group-hover:text-[var(--color-accent)] group-hover:border-[var(--color-accent)] shrink-0 transition-colors">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="font-sans text-sm font-semibold text-white group-hover:text-[var(--color-accent)] transition-colors">
                          {hub.title}
                        </h4>
                        <span className="font-mono text-[10px] text-white/30 group-hover:text-white/60">
                          {hub.path}
                        </span>
                      </div>
                      <p className="font-mono text-[11px] text-[var(--color-secondary)] mt-0.5 truncate">
                        {hub.desc}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>

            <div className="mt-auto pt-8 border-t border-[var(--color-border)] flex items-center justify-between font-mono text-[10px] text-white/40">
              <span>HOST: SABBIL-ARCH-NODE</span>
              <span>SMKN 1 DENPASAR • TKJ</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
