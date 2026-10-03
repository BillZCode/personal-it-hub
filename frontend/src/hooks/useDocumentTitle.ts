import { useEffect } from 'react';

/**
 * Custom hook to dynamically manage the document title for SEO and user orientation.
 * Formats titles uniformly across the application.
 */
export function useDocumentTitle(title: string, prevailOnUnmount = false) {
  useEffect(() => {
    const prevTitle = document.title;
    const fullTitle = title.includes('Personal IT Hub')
      ? title
      : `${title} — Personal IT Hub`;

    document.title = fullTitle;

    return () => {
      if (!prevailOnUnmount) {
        document.title = prevTitle;
      }
    };
  }, [title, prevailOnUnmount]);
}

export default useDocumentTitle;
