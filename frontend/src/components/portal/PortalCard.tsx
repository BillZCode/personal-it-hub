import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, ExternalLink } from 'lucide-react';
import type { PortalItem } from '../../data/portalNavigation';
import { cn } from '../../utils';

interface PortalCardProps {
  item: PortalItem;
  className?: string;
}

export const PortalCard: React.FC<PortalCardProps> = ({ item, className }) => {
  const Icon = item.icon;
  const isExternal = Boolean(item.isExternal);
  const targetUrl = item.isExternal && item.subdomainUrl ? item.subdomainUrl : item.href;

  const badgeColorMap: Record<string, string> = {
    violet: 'bg-violet-500/10 text-violet-700 dark:text-violet-300 border-violet-500/25',
    cyan: 'bg-sky-500/10 text-sky-700 dark:text-sky-300 border-sky-500/25',
    emerald: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/25',
    amber: 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/25',
    rose: 'bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/25',
    neutral: 'bg-slate-500/10 text-slate-700 dark:text-slate-300 border-slate-500/20',
  };

  const badgeStyle = item.badgeVariant ? badgeColorMap[item.badgeVariant] : badgeColorMap.violet;

  const cardContent = (
    <div
      className={cn(
        'group relative flex flex-col justify-between h-full p-5 sm:p-6 rounded-2xl transition-all duration-300',
        'bg-white/80 dark:bg-[#0c0f1e]/80 backdrop-blur-md',
        'border border-slate-200/90 dark:border-white/[0.08]',
        'hover:border-violet-500/40 dark:hover:border-violet-400/40',
        'hover:shadow-[0_12px_30px_-8px_rgba(124,58,237,0.14)] dark:hover:shadow-[0_16px_36px_-10px_rgba(0,0,0,0.6)]',
        'hover:-translate-y-1',
        item.featured && 'ring-1 ring-violet-500/20 dark:ring-violet-400/25',
        className
      )}
    >
      {/* Top Subtle Border Highlight on Hover */}
      <div 
        className="absolute inset-x-0 top-0 h-0.5 rounded-t-2xl bg-gradient-to-r from-transparent via-violet-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" 
        aria-hidden="true" 
      />

      <div className="space-y-3">
        {/* Card Header: Icon + Category Badge + External/Internal Icon */}
        <div className="flex items-start justify-between gap-3">
          <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-white/[0.06] text-slate-800 dark:text-slate-200 border border-slate-200/80 dark:border-white/10 group-hover:bg-violet-600 group-hover:text-white dark:group-hover:bg-violet-600 dark:group-hover:text-white group-hover:border-violet-600 transition-all duration-300 shadow-sm">
            <Icon className="h-5 w-5" aria-hidden="true" />
          </div>

          <div className="flex items-center gap-2">
            {item.badge && (
              <span className={cn('text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full border', badgeStyle)}>
                {item.badge}
              </span>
            )}
            <div className="text-slate-400 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
              {isExternal ? (
                <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
              ) : (
                <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" aria-hidden="true" />
              )}
            </div>
          </div>
        </div>

        {/* Title */}
        <h3 className="font-display text-base font-bold text-slate-900 dark:text-slate-100 group-hover:text-violet-600 dark:group-hover:text-violet-300 transition-colors line-clamp-1">
          {item.title}
        </h3>

        {/* Description */}
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-2">
          {item.description}
        </p>

        {/* Technical Tags Pills (if present) */}
        {item.tags && item.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 pt-1">
            {item.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-100/90 dark:bg-white/[0.04] text-slate-600 dark:text-slate-400 border border-slate-200/60 dark:border-white/5"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Card Footer */}
      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-white/[0.06] flex items-center justify-between text-xs font-mono">
        <span className="text-slate-500 dark:text-slate-400 text-[11px] truncate max-w-[170px]">
          {item.stats || 'Tersedia'}
        </span>

        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-violet-600 dark:text-violet-400 group-hover:underline">
          <span>{isExternal ? 'Buka Tab' : 'Akses'}</span>
          <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
        </span>
      </div>
    </div>
  );

  if (isExternal) {
    return (
      <a
        href={targetUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="block h-full outline-none focus-visible:ring-2 focus-visible:ring-violet-500 rounded-2xl"
        aria-label={`${item.title} (buka tab baru)`}
      >
        {cardContent}
      </a>
    );
  }

  return (
    <Link
      to={targetUrl}
      className="block h-full outline-none focus-visible:ring-2 focus-visible:ring-violet-500 rounded-2xl"
      aria-label={item.title}
    >
      {cardContent}
    </Link>
  );
};

export default PortalCard;
