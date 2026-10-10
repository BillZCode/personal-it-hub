import React from 'react';

export const TycamiFooter: React.FC = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="relative z-10 w-full pb-8 pt-16">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[var(--color-border)] pt-8">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/30 text-center sm:text-left">
          © {year} Project by Sabbil Abdillah Ferdyansyah
        </p>
        <div className="flex items-center gap-6 font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
          <a
            href="https://github.com/BillZCode"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[var(--color-accent)] transition-colors"
          >
            GitHub
          </a>
          <a
            href="mailto:skyroomtl@gmail.com"
            className="hover:text-[var(--color-accent)] transition-colors"
          >
            skyroomtl@gmail.com
          </a>
          <span className="text-white/20 hidden md:inline-block">SMKN 1 Denpasar</span>
        </div>
      </div>
    </footer>
  );
};
