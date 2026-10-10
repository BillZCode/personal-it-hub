import React, { useRef, useLayoutEffect } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ArrowUpRight } from 'lucide-react';

export const TycamiHome: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const title1Ref = useRef<HTMLHeadingElement>(null);
  const title2Ref = useRef<HTMLHeadingElement>(null);
  const bottomBarRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power4.out', duration: 1.5 } });

      tl.fromTo(
        title1Ref.current,
        { y: 140, opacity: 0, skewY: 4 },
        { y: 0, opacity: 1, skewY: 0, duration: 1.8 }
      )
        .fromTo(
          title2Ref.current,
          { y: 140, opacity: 0, skewY: 4 },
          { y: 0, opacity: 1, skewY: 0, duration: 1.8 },
          '-=1.5'
        )
        .fromTo(
          bottomBarRef.current,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 1.2 },
          '-=1.2'
        );

      // Magnetic hover physics for headings
      const headings = containerRef.current?.querySelectorAll('h1');
      headings?.forEach((heading) => {
        const handleMouseMove = (e: MouseEvent) => {
          const rect = heading.getBoundingClientRect();
          const x = (e.clientX - rect.left - rect.width / 2) * 0.04;
          const y = (e.clientY - rect.top - rect.height / 2) * 0.04;
          gsap.to(heading, { x, y, duration: 0.5, ease: 'power2.out' });
        };

        const handleMouseLeave = () => {
          gsap.to(heading, { x: 0, y: 0, duration: 1, ease: 'elastic.out(1, 0.3)' });
        };

        heading.addEventListener('mousemove', handleMouseMove);
        heading.addEventListener('mouseleave', handleMouseLeave);
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="flex flex-col justify-center min-h-[calc(100vh-6rem)] relative pt-8 md:pb-16"
    >
      {/* Background Concentric Circles */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85vw] h-[85vw] max-w-[620px] max-h-[620px] border border-[var(--color-border)] rounded-full opacity-20 pointer-events-none mix-blend-overlay" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[65vw] h-[65vw] max-w-[460px] max-h-[460px] border border-[var(--color-border)] rounded-full opacity-30 pointer-events-none mix-blend-overlay" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[45vw] h-[45vw] max-w-[320px] max-h-[320px] border border-[var(--color-border)] rounded-full opacity-15 pointer-events-none mix-blend-overlay" />

      {/* Hero Typography */}
      <div className="flex flex-col z-10 w-full select-none">
        <div className="overflow-hidden px-6 -mx-6 md:px-12 md:-mx-12">
          <h1
            ref={title1Ref}
            className="text-[10vw] md:text-[8vw] font-black leading-[0.85] tracking-tight uppercase will-change-transform text-white"
          >
            Linux & Network
          </h1>
        </div>
        <div className="overflow-hidden px-6 -mx-6 md:px-12 md:-mx-12">
          <h1
            ref={title2Ref}
            className="text-[10vw] md:text-[8vw] font-black leading-[0.85] tracking-tighter uppercase pl-2 md:pl-28 lg:pl-36 text-[var(--color-secondary)] hover:text-white transition-colors duration-500 will-change-transform cursor-pointer"
          >
            & Web Developer
          </h1>
        </div>
      </div>

      {/* Bottom Status Bar */}
      <div
        ref={bottomBarRef}
        className="mt-16 md:mt-28 flex flex-col md:flex-row justify-between items-start md:items-end gap-10 border-t border-[var(--color-border)] pt-8"
      >
        <div className="max-w-md font-mono text-[10px] md:text-xs uppercase tracking-[0.15em] text-[var(--color-secondary)] leading-relaxed">
          <p>
            A dedicated TKJ Student at SMKN 1 Denpasar passionate about Linux server administration, enterprise network architecture (OSPF & VLAN), cybersecurity labs, and modern web development.
          </p>
          <div className="mt-5 flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-[var(--color-accent)] animate-pulse" />
            <span className="text-white">SMKN 1 Denpasar • Active Infrastructure Node</span>
          </div>
        </div>

        {/* Action Buttons with Rollup Hover Animation & Circular Arrow Button */}
        <div className="flex flex-col sm:flex-row gap-6 md:gap-8 w-full sm:w-auto">
          {/* Button 1: Learn More */}
          <Link
            to="/about"
            className="group flex items-center justify-between sm:justify-start gap-4 text-xs font-mono uppercase tracking-[0.2em]"
          >
            <span className="relative overflow-hidden">
              <span className="inline-block transition-transform duration-300 group-hover:-translate-y-full text-white">
                Learn More
              </span>
              <span className="absolute inset-0 inline-block transition-transform duration-300 translate-y-full group-hover:translate-y-0 text-[var(--color-accent)]">
                Learn More
              </span>
            </span>
            <div className="w-12 h-12 rounded-full border border-[var(--color-border)] flex items-center justify-center transition-all duration-300 group-hover:border-[var(--color-accent)] group-hover:bg-[var(--color-accent)] group-hover:text-black text-white shrink-0">
              <ArrowUpRight
                className="w-4 h-4 -rotate-45 group-hover:rotate-0 transition-transform duration-500"
                strokeWidth={1.5}
              />
            </div>
          </Link>

          {/* Button 2: Explore Project */}
          <Link
            to="/work"
            className="group flex items-center justify-between sm:justify-start gap-4 text-xs font-mono uppercase tracking-[0.2em]"
          >
            <span className="relative overflow-hidden">
              <span className="inline-block transition-transform duration-300 group-hover:-translate-y-full text-white">
                Explore Project
              </span>
              <span className="absolute inset-0 inline-block transition-transform duration-300 translate-y-full group-hover:translate-y-0 text-[var(--color-accent)]">
                Explore Project
              </span>
            </span>
            <div className="w-12 h-12 rounded-full border border-[var(--color-border)] flex items-center justify-center transition-all duration-300 group-hover:border-[var(--color-accent)] group-hover:bg-[var(--color-accent)] group-hover:text-black text-white shrink-0">
              <ArrowUpRight
                className="w-4 h-4 -rotate-45 group-hover:rotate-0 transition-transform duration-500"
                strokeWidth={1.5}
              />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};
