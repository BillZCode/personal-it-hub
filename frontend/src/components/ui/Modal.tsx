import { Fragment, ReactNode, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, AlertTriangle, Trash2, Info } from 'lucide-react';
import { cn } from '../../utils';
import { Button } from './Button';
import { useOnClickOutside } from '../../hooks';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
}

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = 'md',
  showCloseButton = true,
  closeOnOverlayClick = true,
  closeOnEscape = true,
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useOnClickOutside(modalRef, () => {
    if (closeOnOverlayClick) onClose();
  });

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && closeOnEscape) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, closeOnEscape, onClose]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    full: 'max-w-4xl',
  };

  const modalContent = (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
      aria-describedby={description ? 'modal-description' : undefined}
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-md transition-opacity animate-in fade-in duration-200"
        aria-hidden="true"
        onClick={() => {
          if (closeOnOverlayClick) onClose();
        }}
      />

      {/* Modal Dialog Container */}
      <div className="flex min-h-full items-center justify-center p-4 relative z-10 pointer-events-none">
        <div
          ref={modalRef}
          className={cn(
            'w-full p-1 rounded-[1.75rem] bg-gradient-to-b from-white/10 to-transparent border border-white/10 shadow-2xl animate-in fade-in duration-200 pointer-events-auto',
            sizeClasses[size]
          )}
        >
          <div className="rounded-[calc(1.75rem-0.25rem)] bg-dark-900 border border-dark-800 shadow-inner overflow-hidden">
            {(title || showCloseButton) && (
              <div className="flex items-start justify-between p-5 sm:p-6 border-b border-dark-800 bg-dark-950/40">
                <div>
                  {title && (
                    <h2 id="modal-title" className="text-base sm:text-lg font-semibold text-dark-100 tracking-tight">
                      {title}
                    </h2>
                  )}
                  {description && (
                    <p id="modal-description" className="mt-1 text-xs text-dark-400">
                      {description}
                    </p>
                  )}
                </div>
                {showCloseButton && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClose}
                    aria-label="Tutup modal"
                    className="text-dark-400 hover:text-dark-100 -mr-2"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            )}
            <div className="p-5 sm:p-6">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );

  if (typeof window === 'undefined') return null;
  return createPortal(modalContent, document.body);
}

export interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'primary';
  loading?: boolean;
  isLoading?: boolean;
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  description,
  confirmText = 'Konfirmasi',
  cancelText = 'Batal',
  variant = 'primary',
  loading = false,
  isLoading = false,
}: ConfirmDialogProps) {
  const isBusy = loading || isLoading;
  const contentText = message || description || '';

  const iconMap = {
    danger: <Trash2 className="h-5 w-5 text-rose-400" />,
    warning: <AlertTriangle className="h-5 w-5 text-amber-400" />,
    primary: <Info className="h-5 w-5 text-primary-400" />,
  };

  const badgeBorderMap = {
    danger: 'border-rose-500/30 bg-rose-500/10 text-rose-400 shadow-rose-500/10',
    warning: 'border-amber-500/30 bg-amber-500/10 text-amber-400 shadow-amber-500/10',
    primary: 'border-primary-500/30 bg-primary-500/10 text-primary-400 shadow-primary-500/10',
  };

  const confirmBtnVariant = variant === 'danger' ? 'danger' : 'primary';

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm" showCloseButton={!isBusy} closeOnEscape={!isBusy}>
      <div className="flex items-start gap-3.5 mb-5">
        <div className={`p-2.5 rounded-xl border shadow flex-shrink-0 ${badgeBorderMap[variant]}`}>
          {iconMap[variant]}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm sm:text-base font-semibold text-dark-100 tracking-tight">{title}</h3>
          {contentText && (
            <p className="text-xs text-dark-400 mt-1 leading-relaxed">{contentText}</p>
          )}
        </div>
      </div>
      <div className="flex justify-end gap-2.5 pt-3 border-t border-dark-800">
        <Button variant="ghost" size="sm" onClick={onClose} disabled={isBusy} className="text-xs">
          {cancelText}
        </Button>
        <Button
          variant={confirmBtnVariant}
          size="sm"
          onClick={onConfirm}
          loading={isBusy}
          className="text-xs shadow-md"
        >
          {confirmText}
        </Button>
      </div>
    </Modal>
  );
}