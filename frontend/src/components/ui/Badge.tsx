import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '../../utils';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'neutral';
  size?: 'sm' | 'md';
  dot?: boolean;
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'neutral', size = 'md', dot, children, ...props }, ref) => {
    const variantClasses = {
      primary: 'bg-primary-500/15 text-emerald-700 dark:text-primary-400 border border-primary-500/30',
      success: 'bg-green-500/15 text-green-700 dark:text-green-400 border border-green-500/30',
      warning: 'bg-amber-500/15 text-amber-700 dark:text-yellow-400 border border-amber-500/30',
      danger: 'bg-red-500/15 text-red-700 dark:text-red-400 border border-red-500/30',
      info: 'bg-blue-500/15 text-blue-700 dark:text-blue-400 border border-blue-500/30',
      neutral: 'bg-dark-800 text-dark-400 border border-dark-600',
    };

    const sizeClasses = {
      sm: 'px-2 py-0.5 text-xs',
      md: 'px-2.5 py-0.5 text-xs',
    };

    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center gap-1.5 rounded-full font-medium border',
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {dot && (
          <span
            className={cn(
              'rounded-full',
              variant === 'primary' && 'bg-primary-500',
              variant === 'success' && 'bg-green-500',
              variant === 'warning' && 'bg-yellow-500',
              variant === 'danger' && 'bg-red-500',
              variant === 'info' && 'bg-blue-500',
              variant === 'neutral' && 'bg-dark-500',
              size === 'sm' && 'w-1.5 h-1.5',
              size === 'md' && 'w-2 h-2'
            )}
          />
        )}
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';