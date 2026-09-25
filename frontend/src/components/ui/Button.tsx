import { forwardRef, ButtonHTMLAttributes } from 'react';
import { cn } from '../../utils';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, leftIcon, rightIcon, disabled, children, ...props }, ref) => {
    const baseClasses = 'group relative inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-200 ease-fluid active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-dark-950 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100';

    const variantClasses = {
      primary: 'bg-primary-500 text-dark-950 font-semibold hover:bg-primary-400 active:bg-primary-600 focus-visible:ring-primary-500 shadow-console border border-primary-300/30',
      secondary: 'bg-dark-900 text-dark-100 border border-dark-750 hover:bg-dark-850 hover:border-dark-700 active:bg-dark-800 focus-visible:ring-dark-500 shadow-console',
      ghost: 'bg-transparent text-dark-300 hover:bg-dark-900 hover:text-dark-100 active:bg-dark-850 focus-visible:ring-dark-500',
      danger: 'bg-rose-600 text-white hover:bg-rose-500 active:bg-rose-700 focus-visible:ring-rose-500 shadow-console border border-rose-400/30',
      outline: 'border border-primary-500/40 text-primary-400 hover:bg-primary-500/10 active:bg-primary-500/20 focus-visible:ring-primary-500',
    };

    const sizeClasses = {
      sm: 'px-3 py-1.5 text-xs',
      md: 'px-4 py-2 text-sm',
      lg: 'px-6 py-2.5 text-base',
    };

    return (
      <button
        ref={ref}
        className={cn(baseClasses, variantClasses[variant], sizeClasses[size], className)}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        )}
        {!loading && leftIcon && <span className="flex items-center">{leftIcon}</span>}
        <span>{children}</span>
        {!loading && rightIcon && (
          <span className="w-5 h-5 rounded-md bg-black/10 dark:bg-white/10 flex items-center justify-center transition-transform duration-200 group-hover:translate-x-0.5">
            {rightIcon}
          </span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';