import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

interface TycamiNextBannerProps {
  to: string;
  text: string;
  label: string;
  description: string;
}

export const TycamiNextBanner: React.FC<TycamiNextBannerProps> = ({
  to,
  text,
  label,
  description,
}) => {
  return (
    <Link
      to={to}
      className="group block w-full mt-24 md:mt-32 pt-8 border-t border-[var(--color-border)] relative z-20"
    >
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8">
        <div className="flex flex-col gap-2 max-w-md">
          <span className="font-mono text-[10px] md:text-xs uppercase tracking-[0.2em] text-[var(--color-accent)] opacity-90">
            {label}
          </span>
          <p className="font-sans text-sm md:text-base text-[var(--color-secondary)] leading-relaxed group-hover:text-white transition-colors duration-300">
            {description}
          </p>
        </div>

        <div className="flex items-center gap-4 shrink-0 self-end md:self-auto">
          <span className="relative overflow-hidden text-xs font-mono uppercase tracking-[0.2em]">
            <span className="inline-block transition-transform duration-300 group-hover:-translate-y-full text-white">
              {text}
            </span>
            <span className="absolute inset-0 inline-block transition-transform duration-300 translate-y-full group-hover:translate-y-0 text-[var(--color-accent)]">
              {text}
            </span>
          </span>
          <div className="w-12 h-12 rounded-full border border-[var(--color-border)] flex items-center justify-center transition-all duration-300 group-hover:border-[var(--color-accent)] group-hover:bg-[var(--color-accent)] group-hover:text-black text-white">
            <ArrowUpRight
              className="w-4 h-4 transition-transform duration-500 group-hover:rotate-45"
              strokeWidth={1.5}
            />
          </div>
        </div>
      </div>
    </Link>
  );
};
