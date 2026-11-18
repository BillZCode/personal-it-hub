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

  const badgeColorMap: Record<
    string,
    { iconBox: string; hoverBorder: string }
  > = {
    violet: {
      iconBox: 'bg-white/[0.06] text-[#D2D8F0] border-white/15',
      hoverBorder: 'hover:border-white/30',
    },
    cyan: {
      iconBox: 'bg-[#5B8DEF]/15 text-[#5B8DEF] border-[#5B8DEF]/40',
      hoverBorder: 'hover:border-[#5B8DEF]/50',
    },
    emerald: {
      iconBox: 'bg-[#4ED69E]/15 text-[#4ED69E] border-[#4ED69E]/40',
      hoverBorder: 'hover:border-[#4ED69E]/50',
    },
    amber: {
      iconBox: 'bg-[#F7C95C]/15 text-[#F7C95C] border-[#F7C95C]/40',
      hoverBorder: 'hover:border-[#F7C95C]/50',
    },
    rose: {
      iconBox: 'bg-[#F26676]/15 text-[#F26676] border-[#F26676]/40',
      hoverBorder: 'hover:border-[#F26676]/50',
    },
    neutral: {
      iconBox: 'bg-white/[0.05] text-[#A3ADC4] border-white/10',
      hoverBorder: 'hover:border-white/25',
    },
  };

  const styleSet = item.badgeVariant
    ? badgeColorMap[item.badgeVariant] || badgeColorMap.cyan
    : badgeColorMap.cyan;

  const cardContent = (
    <div
      className={cn(
        'group relative flex flex-col justify-between h-full p-6 rounded-2xl transition-all duration-300',
        'bg-[#0D101A] border border-white/[0.08]',
        styleSet.hoverBorder,
        'shadow-nocturneCard hover:-translate-y-1',
        className
      )}
    >
      <div className="space-y-3.5">
        {/* Card Header: Icon + Category Badge + External/Internal Icon */}
        <div className="flex items-start justify-between gap-3">
          <div
            className={cn(
              'w-11 h-11 rounded-xl border flex items-center justify-center transition-transform duration-300 group-hover:scale-105',
              styleSet.iconBox
            )}
          >
            <Icon className="h-5 w-5" aria-hidden="true" />
          </div>

          <div className="text-[#8E9AB5] group-hover:text-[#F4F3F8] transition-colors">
            {isExternal ? (
              <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
            ) : (
              <ArrowUpRight
                className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                aria-hidden="true"
              />
            )}
          </div>
        </div>

        {/* Title */}
        <h3 className="font-display text-lg font-medium text-[#F4F3F8] group-hover:text-white transition-colors line-clamp-1">
          {item.title}
        </h3>

        {/* Description */}
        <p className="text-xs sm:text-sm text-[#8E9AB5] leading-relaxed line-clamp-2 font-sans">
          {item.description}
        </p>

        {/* Technical Tags Pills */}
        {item.tags && item.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {item.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-[#080A10] text-[#A3ADC4] border border-white/[0.08]"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Card Footer */}
      <div className="mt-5 pt-3.5 border-t border-white/[0.06] flex items-center justify-between text-xs font-mono">
        <span className="text-[#8E9AB5] text-[11px] truncate max-w-[170px]">
          {item.stats || 'Tersedia'}
        </span>

        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#F4F3F8] group-hover:text-[#D2D8F0] transition-colors">
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
        className="block h-full outline-none focus-visible:ring-2 focus-visible:ring-[#5B8DEF] rounded-2xl"
        aria-label={`${item.title} (buka tab baru)`}
      >
        {cardContent}
      </a>
    );
  }

  return (
    <Link
      to={targetUrl}
      className="block h-full outline-none focus-visible:ring-2 focus-visible:ring-[#5B8DEF] rounded-2xl"
      aria-label={item.title}
    >
      {cardContent}
    </Link>
  );
};

export default PortalCard;
