import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 30,
      retry: 1,
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: 0,
    },
  },
});

export const queryKeys = {
  projects: {
    all: ['projects'] as const,
    lists: () => [...queryKeys.projects.all, 'list'] as const,
    list: (filters: Record<string, unknown>) => [...queryKeys.projects.lists(), filters] as const,
    details: () => [...queryKeys.projects.all, 'detail'] as const,
    detail: (slug: string) => [...queryKeys.projects.details(), slug] as const,
    featured: () => [...queryKeys.projects.all, 'featured'] as const,
  },
  notes: {
    all: ['notes'] as const,
    lists: () => [...queryKeys.notes.all, 'list'] as const,
    list: (filters: Record<string, unknown>) => [...queryKeys.notes.lists(), filters] as const,
    details: () => [...queryKeys.notes.all, 'detail'] as const,
    detail: (slug: string) => [...queryKeys.notes.details(), slug] as const,
    categories: () => [...queryKeys.notes.all, 'categories'] as const,
    tags: () => [...queryKeys.notes.all, 'tags'] as const,
    related: (slug: string) => [...queryKeys.notes.all, 'related', slug] as const,
  },
  certificates: {
    all: ['certificates'] as const,
    lists: () => [...queryKeys.certificates.all, 'list'] as const,
    list: (filters: Record<string, unknown>) => [...queryKeys.certificates.lists(), filters] as const,
    details: () => [...queryKeys.certificates.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.certificates.details(), id] as const,
  },
  changelog: {
    all: ['changelog'] as const,
    lists: () => [...queryKeys.changelog.all, 'list'] as const,
    latest: () => [...queryKeys.changelog.all, 'latest'] as const,
  },
  guestbook: {
    all: ['guestbook'] as const,
    lists: () => [...queryKeys.guestbook.all, 'list'] as const,
    list: (page: number, limit: number) => [...queryKeys.guestbook.lists(), page, limit] as const,
  },
  gallery: {
    all: ['gallery'] as const,
    lists: () => [...queryKeys.gallery.all, 'list'] as const,
    list: (filters: Record<string, unknown>) => [...queryKeys.gallery.lists(), filters] as const,
    details: () => [...queryKeys.gallery.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.gallery.details(), id] as const,
  },
  statistics: {
    all: ['statistics'] as const,
    overview: () => [...queryKeys.statistics.all, 'overview'] as const,
    visitors: (period: string) => [...queryKeys.statistics.all, 'visitors', period] as const,
    tools: () => [...queryKeys.statistics.all, 'tools'] as const,
    articles: () => [...queryKeys.statistics.all, 'articles'] as const,
  },
  server: {
    all: ['server'] as const,
    stats: () => [...queryKeys.server.all, 'stats'] as const,
    history: (hours: number) => [...queryKeys.server.all, 'history', hours] as const,
  },
  status: {
    all: ['status'] as const,
    system: () => [...queryKeys.status.all, 'system'] as const,
  },
  personal: {
    all: ['personal'] as const,
    media: () => [...queryKeys.personal.all, 'media'] as const,
    linuxSetup: () => [...queryKeys.personal.all, 'linux-setup'] as const,
  },
  tools: {
    all: ['tools'] as const,
    list: () => [...queryKeys.tools.all, 'list'] as const,
  },
  networkTools: {
    all: ['network-tools'] as const,
    list: () => [...queryKeys.networkTools.all, 'list'] as const,
  },
  admin: {
    all: ['admin'] as const,
    projects: {
      all: ['admin', 'projects'] as const,
      lists: () => [...queryKeys.admin.projects.all, 'list'] as const,
    },
    notes: {
      all: ['admin', 'notes'] as const,
      lists: () => [...queryKeys.admin.notes.all, 'list'] as const,
    },
    certificates: {
      all: ['admin', 'certificates'] as const,
      lists: () => [...queryKeys.admin.certificates.all, 'list'] as const,
    },
    gallery: {
      all: ['admin', 'gallery'] as const,
      lists: () => [...queryKeys.admin.gallery.all, 'list'] as const,
    },
    changelog: {
      all: ['admin', 'changelog'] as const,
      lists: () => [...queryKeys.admin.changelog.all, 'list'] as const,
    },
    guestbook: {
      all: ['admin', 'guestbook'] as const,
      lists: () => [...queryKeys.admin.guestbook.all, 'list'] as const,
    },
    statistics: {
      all: ['admin', 'statistics'] as const,
    },
  },
};