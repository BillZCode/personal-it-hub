import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '../../utils';
import { getInitials, getColorForString } from '../../utils';

export interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  src?: string | null;
  alt?: string;
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  shape?: 'circle' | 'square';
  status?: 'online' | 'offline' | 'busy' | 'away';
}

export const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, src, alt, name, size = 'md', shape = 'circle', status, ...props }, ref) => {
    const sizeClasses = {
      xs: 'w-6 h-6 text-xs',
      sm: 'w-8 h-8 text-sm',
      md: 'w-10 h-10 text-base',
      lg: 'w-12 h-12 text-lg',
      xl: 'w-16 h-16 text-xl',
    };

    const statusSizeClasses = {
      xs: 'w-1.5 h-1.5',
      sm: 'w-2 h-2',
      md: 'w-2.5 h-2.5',
      lg: 'w-3 h-3',
      xl: 'w-4 h-4',
    };

    const statusColorClasses = {
      online: 'bg-green-500',
      offline: 'bg-dark-500',
      busy: 'bg-red-500',
      away: 'bg-yellow-500',
    };

    const shapeClasses = shape === 'circle' ? 'rounded-full' : 'rounded-lg';

    const backgroundColor = name ? getColorForString(name) : undefined;

    return (
      <div
        ref={ref}
        className={cn('relative inline-flex shrink-0', shapeClasses, sizeClasses[size], className)}
        {...props}
      >
        {src ? (
          <img
            src={src}
            alt={alt || name || 'Avatar'}
            className={cn('w-full h-full object-cover', shapeClasses)}
          />
        ) : name ? (
          <div
            className={cn('w-full h-full flex items-center justify-center font-medium text-white', shapeClasses)}
            style={{ backgroundColor }}
          >
            {getInitials(name)}
          </div>
        ) : (
          <div className={cn('w-full h-full flex items-center justify-center text-dark-500', shapeClasses)}>
            <svg className="w-1/2 h-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
        )}
        {status && (
          <span
            className={cn(
              'absolute bottom-0 right-0 border-2 border-dark-950 rounded-full',
              statusSizeClasses[size],
              statusColorClasses[status]
            )}
            aria-label={`Status: ${status}`}
          />
        )}
      </div>
    );
  }
);

Avatar.displayName = 'Avatar';