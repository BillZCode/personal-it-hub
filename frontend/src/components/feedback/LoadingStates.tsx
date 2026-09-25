import { ReactNode } from 'react';
import { cn } from '../../utils';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-12 px-4 text-center', className)}>
      {icon && (
        <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-dark-800 flex items-center justify-center text-dark-500">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-medium text-dark-100 mb-2">{title}</h3>
      {description && <p className="text-dark-400 text-sm mb-6 max-w-sm">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

interface LoadingStateProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
}

export function LoadingState({ size = 'md', text, className }: LoadingStateProps) {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  return (
    <div className={cn('flex flex-col items-center justify-center py-8', className)}>
      <div className={cn('animate-spin rounded-full border-2 border-dark-600 border-t-primary-500', sizeClasses[size])} />
      {text && <p className="mt-3 text-sm text-dark-400">{text}</p>}
    </div>
  );
}

interface InlineLoadingProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function InlineLoading({ size = 'md', className }: InlineLoadingProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  };

  return (
    <div className={cn('animate-spin rounded-full border-2 border-dark-600 border-t-primary-500', sizeClasses[size], className)} />
  );
}

export function PageLoading() {
  return (
    <div className="flex min-h-[400px] items-center justify-center">
      <LoadingState size="lg" text="Loading..." />
    </div>
  );
}

export { SkeletonCard, SkeletonText, SkeletonTable, SkeletonList } from '../ui/Skeleton';