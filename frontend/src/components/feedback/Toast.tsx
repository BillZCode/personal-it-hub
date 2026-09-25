import toast, { Toaster as HotToaster, ToastOptions } from 'react-hot-toast';

type ToastType = 'success' | 'error' | 'loading' | 'promise' | 'custom' | 'info';

export function useToast() {
  const showToast = (message: string, type: ToastType = 'custom', options?: ToastOptions) => {
    const defaultOptions: ToastOptions = {
      duration: 4000,
      style: {
        background: '#0f172a',
        color: '#f1f5f9',
        border: '1px solid #334155',
        borderRadius: '0.75rem',
        padding: '0.75rem 1rem',
        fontSize: '0.875rem',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)',
      },
      ...options,
    };

    switch (type) {
      case 'success':
        return toast.success(message, {
          ...defaultOptions,
          iconTheme: { primary: '#10b981', secondary: '#0f172a' },
        });
      case 'error':
        return toast.error(message, {
          ...defaultOptions,
          iconTheme: { primary: '#f43f5e', secondary: '#0f172a' },
        });
      case 'info':
        return toast(message, defaultOptions);
      case 'loading':
        return toast.loading(message, defaultOptions);
      case 'promise':
        return toast.promise(message as unknown as Promise<unknown>, defaultOptions as any);
      default:
        return toast(message, defaultOptions);
    }
  };

  const dismiss = (id?: string) => {
    toast.dismiss(id);
  };

  return { showToast, dismiss, toast };
}

export { HotToaster as Toaster };