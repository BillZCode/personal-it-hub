import React, { useLayoutEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TycamiNavbar } from './TycamiNavbar';
import { TycamiFooter } from './TycamiFooter';

gsap.registerPlugin(ScrollTrigger);

const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 120);
    return () => clearTimeout(timer);
  }, [pathname]);

  return null;
};

const PageTransitionWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { pathname } = useLocation();
  const pageRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        pageRef.current,
        { opacity: 0, filter: 'blur(8px)' },
        { opacity: 1, filter: 'blur(0px)', duration: 1.1, ease: 'power4.out' }
      );
    }, pageRef);

    return () => ctx.revert();
  }, [pathname]);

  return (
    <div ref={pageRef} className="w-full min-h-screen pt-20">
      {children}
    </div>
  );
};

export const TycamiLayout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-[var(--color-background)] text-white font-sans relative overflow-x-hidden selection:bg-[var(--color-accent)] selection:text-black">
      {/* Background ambient light orbs */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[8%] left-[18%] w-[42vw] h-[42vw] rounded-full bg-[var(--color-accent)] opacity-[0.035] blur-[120px]" />
        <div className="absolute bottom-[20%] right-[10%] w-[50vw] h-[50vw] rounded-full bg-[#1c2230]/70 opacity-25 blur-[140px]" />
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[var(--color-border)] to-transparent" />
      </div>

      <ScrollToTop />
      <TycamiNavbar />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-12">
        <PageTransitionWrapper>
          {children || <Outlet />}
        </PageTransitionWrapper>
        <TycamiFooter />
      </div>
    </div>
  );
};
