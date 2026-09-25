import { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '../ui/Button';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { cn } from '../../utils';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  private handleRetry = (): void => {
    this.setState({ hasError: false, error: null });
  };

  public render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex min-h-[400px] items-center justify-center p-4">
          <div className="card p-8 max-w-md w-full text-center">
            <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center">
              <AlertTriangle className="h-8 w-8 text-red-400" />
            </div>
            <h2 className="text-xl font-semibold text-dark-100 mb-2">Something went wrong</h2>
            <p className="text-dark-400 mb-6">
              An unexpected error occurred. Please try refreshing the page or contact support if the problem persists.
            </p>
            {this.state.error && (
              <details className="mb-4 text-left">
                <summary className="text-sm text-dark-500 cursor-pointer">Error details</summary>
                <pre className="mt-2 p-3 bg-dark-900 rounded text-xs text-dark-400 overflow-auto max-h-40 font-mono">
                  {this.state.error.message}
                  {this.state.error.stack && '\n\n' + this.state.error.stack}
                </pre>
              </details>
            )}
            <div className="flex gap-3 justify-center">
              <Button onClick={this.handleRetry} leftIcon={<RefreshCw className="h-4 w-4" />}>
                Try Again
              </Button>
              <Button variant="ghost" onClick={() => window.location.href = '/'}>
                Go Home
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export function ErrorFallback({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) {
  return (
    <div className="card p-6">
      <div className="flex items-center gap-3 text-red-400 mb-4">
        <AlertTriangle className="h-6 w-6 flex-shrink-0" />
        <h3 className="font-semibold">Error</h3>
      </div>
      <p className="text-dark-400 text-sm mb-4">{error.message}</p>
      <Button onClick={resetErrorBoundary} leftIcon={<RefreshCw className="h-4 w-4" />}>
        Try Again
      </Button>
    </div>
  );
}