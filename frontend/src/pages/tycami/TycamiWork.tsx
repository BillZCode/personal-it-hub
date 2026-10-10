import React, { useRef, useState, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight } from 'lucide-react';
import { TycamiNextBanner } from '../../components/tycami/TycamiNextBanner';

gsap.registerPlugin(ScrollTrigger);

export const TycamiWork: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);
  const [activeProjectIdx, setActiveProjectIdx] = useState<number | null>(null);

  const projects = [
    {
      title: 'Personal IT Hub',
      category: 'Full-Stack / React 18 & Vite',
      year: '2026',
      img: '/images/gallery/dashboard_dark_theme.png',
      url: '/portal',
      external: false,
    },
    {
      title: 'DevKit CLI Suite',
      category: 'Python / Bash Automation',
      year: '2026',
      img: '/images/gallery/dashboard_dark_theme.png',
      url: '/devkit',
      external: false,
    },
    {
      title: 'CyberLab Arena',
      category: 'React / Security Playground',
      year: '2026',
      img: '/images/gallery/cyberlab_lks_preview.jpg',
      url: '/cyberlab',
      external: false,
    },
    {
      title: 'Media Downloader',
      category: 'Frontend / Python REST API',
      year: '2026',
      img: '/images/gallery/universal_downloader_tool.png',
      url: '/tools',
      external: false,
    },
    {
      title: 'Enterprise OSPF Routing',
      category: 'Cisco Packet Tracer / Net',
      year: '2026',
      img: '/images/gallery/cisco_ospf_topology.png',
      url: 'https://github.com/BillZCode',
      external: true,
    },
    {
      title: 'AWS Multi-AZ Cloud VPC',
      category: 'Cloud Infrastructure / AWS',
      year: '2026',
      img: '/images/gallery/aws_vpc_cloudkita_architecture.jpg',
      url: 'https://github.com/BillZCode',
      external: true,
    },
  ];

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.reveal-text', {
        y: 100,
        opacity: 0,
        stagger: 0.1,
        duration: 1.2,
        ease: 'power4.out',
      });

      gsap.utils.toArray<HTMLElement>('.project-row').forEach((row) => {
        gsap.from(row, {
          scrollTrigger: {
            trigger: row,
            start: 'top 90%',
          },
          y: 40,
          opacity: 0,
          duration: 1,
          ease: 'power3.out',
        });
      });

      const quickX = gsap.quickTo(followerRef.current, 'x', { duration: 0.4, ease: 'power3' });
      const quickY = gsap.quickTo(followerRef.current, 'y', { duration: 0.4, ease: 'power3' });

      const handleMouseMove = (e: MouseEvent) => {
        quickX(e.clientX - 200);
        quickY(e.clientY - 125);
      };

      window.addEventListener('mousemove', handleMouseMove);
      return () => window.removeEventListener('mousemove', handleMouseMove);
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="pt-16 pb-16">
      {/* Floating Image Preview Following Cursor (Desktop Only) */}
      <div
        ref={followerRef}
        className={`fixed top-0 left-0 w-[400px] h-[250px] pointer-events-none z-40 overflow-hidden transition-opacity duration-300 hidden md:block ${
          activeProjectIdx !== null ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="w-full h-full relative border border-[var(--color-border)] bg-[var(--color-surface)] rounded-2xl overflow-hidden shadow-2xl">
          {projects.map((proj, idx) => (
            <img
              key={idx}
              src={proj.img}
              alt={proj.title}
              className={`absolute inset-0 w-full h-full object-cover grayscale transition-opacity duration-500 will-change-[opacity] ${
                activeProjectIdx === idx ? 'opacity-100' : 'opacity-0'
              }`}
            />
          ))}
          <div className="absolute inset-0 bg-black/30 mix-blend-overlay" />
          <div className="absolute bottom-4 left-4 right-4 p-3 rounded-lg bg-black/70 backdrop-blur-md border border-white/10 flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-accent)]">
              {activeProjectIdx !== null ? projects[activeProjectIdx].category : ''}
            </span>
            <span className="font-mono text-[10px] text-white/60">
              {activeProjectIdx !== null ? projects[activeProjectIdx].year : ''}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto">
        {/* Page Header */}
        <header className="mb-24">
          <h1 className="text-[8vw] md:text-[5vw] font-black leading-[0.9] tracking-tighter uppercase mb-12">
            <div className="overflow-hidden">
              <div className="reveal-text text-white">Selected</div>
            </div>
            <div className="overflow-hidden">
              <div className="reveal-text text-[var(--color-secondary)]">Works.</div>
            </div>
          </h1>
          <div className="overflow-hidden mt-12 max-w-xl">
            <p className="reveal-text font-mono text-xs md:text-sm leading-relaxed text-[var(--color-secondary)] uppercase tracking-[0.15em]">
              A curated collection of my most impactful projects, bridging robust infrastructure with modern digital interfaces.
            </p>
          </div>
        </header>

        {/* Project Rows Table */}
        <div className="border-t border-[var(--color-border)] font-mono">
          {projects.map((project, idx) => (
            <a
              key={idx}
              href={project.url}
              target={project.external ? '_blank' : undefined}
              rel={project.external ? 'noopener noreferrer' : undefined}
              onMouseEnter={() => setActiveProjectIdx(idx)}
              onMouseLeave={() => setActiveProjectIdx(null)}
              className="project-row group border-b border-[var(--color-border)] py-8 md:py-12 flex flex-col md:flex-row md:items-center justify-between transition-colors hover:bg-[var(--color-100)] px-4 md:px-8 -mx-4 md:-mx-8 relative z-10 rounded-xl block"
            >
              {/* Left: Number & Big Title */}
              <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-12 w-full md:w-auto">
                <span className="text-xs text-[var(--color-secondary)] opacity-50 block w-8">
                  {(idx + 1).toString().padStart(2, '0')}
                </span>
                <h2 className="text-3xl md:text-5xl font-sans font-bold tracking-tighter uppercase group-hover:text-[var(--color-accent)] transition-colors duration-300 text-white">
                  {project.title}
                </h2>
              </div>

              {/* Right: Category, Year & Circular Arrow Button */}
              <div className="flex justify-between md:justify-end items-center gap-8 mt-6 md:mt-0 w-full md:w-auto">
                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-8 text-xs uppercase tracking-widest text-[var(--color-secondary)]">
                  <span>{project.category}</span>
                  <span className="hidden md:inline-block">—</span>
                  <span>{project.year}</span>
                </div>

                <div className="w-10 h-10 rounded-full border border-[var(--color-border)] flex items-center justify-center transition-all duration-300 group-hover:border-[var(--color-accent)] group-hover:bg-[var(--color-accent)] group-hover:text-black shrink-0 text-white">
                  <ArrowUpRight
                    className="w-4 h-4 transition-transform duration-500 group-hover:rotate-45"
                    strokeWidth={1.5}
                  />
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Next Page Banner */}
      <TycamiNextBanner
        to="/services"
        text="EXPLORE SERVICES"
        label="Next — Specialized Expertise"
        description="Designing robust network infrastructure, rock-solid Linux servers, and modern web solutions."
      />
    </div>
  );
};
