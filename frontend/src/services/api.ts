import { api } from '../api/client';
import type {
  Project,
  Certificate,
  TechnicalNote,
  GuestbookEntry,
  ChangelogEntry,
  GalleryItem,
  ServerMetric,
  Statistics,
  PersonalMedia,
  LinuxSetup,
  SystemStatus,
  NetworkToolResult,
  PaginatedResponse,
} from '../types';

export const projectsApi = {
  getAll: (params?: { status?: string; technology?: string; featured?: boolean; page?: number; limit?: number }) =>
    api.get<PaginatedResponse<Project>>('/projects', params),

  getFeatured: () =>
    api.get<Project[]>('/projects/featured'),

  getBySlug: (slug: string) =>
    api.get<Project>(`/projects/${slug}`),

  create: (data: Partial<Project>) =>
    api.post<Project>('/projects', data),

  update: (id: string, data: Partial<Project>) =>
    api.put<Project>(`/projects/${id}`, data),

  delete: (id: string) =>
    api.delete<void>(`/projects/${id}`),
};

export const notesApi = {
  getAll: (params?: { category?: string; tag?: string; search?: string; page?: number; limit?: number; published?: boolean }) =>
    api.get<PaginatedResponse<TechnicalNote>>('/notes', params),

  getBySlug: (slug: string) =>
    api.get<TechnicalNote>(`/notes/${slug}`),

  getCategories: () =>
    api.get<string[]>('/notes/categories'),

  getTags: () =>
    api.get<string[]>('/notes/tags'),

  getRelated: (slug: string) =>
    api.get<TechnicalNote[]>(`/notes/related/${slug}`),

  create: (data: Partial<TechnicalNote>) =>
    api.post<TechnicalNote>('/notes', data),

  update: (id: string, data: Partial<TechnicalNote>) =>
    api.put<TechnicalNote>(`/notes/${id}`, data),

  delete: (id: string) =>
    api.delete<void>(`/notes/${id}`),
};

export const certificatesApi = {
  getAll: (params?: { provider?: string; search?: string; page?: number; limit?: number }) =>
    api.get<PaginatedResponse<Certificate>>('/certificates', params),

  getById: (id: string) =>
    api.get<Certificate>(`/certificates/${id}`),

  create: (data: Partial<Certificate>) =>
    api.post<Certificate>('/certificates', data),

  update: (id: string, data: Partial<Certificate>) =>
    api.put<Certificate>(`/certificates/${id}`, data),

  delete: (id: string) =>
    api.delete<void>(`/certificates/${id}`),
};

export const changelogApi = {
  getAll: () =>
    api.get<ChangelogEntry[]>('/changelog'),

  getLatest: () =>
    api.get<ChangelogEntry>('/changelog/latest'),

  create: (data: Partial<ChangelogEntry>) =>
    api.post<ChangelogEntry>('/changelog', data),

  update: (id: string, data: Partial<ChangelogEntry>) =>
    api.put<ChangelogEntry>(`/changelog/${id}`, data),

  delete: (id: string) =>
    api.delete<void>(`/changelog/${id}`),
};

export const guestbookApi = {
  getAll: (page = 1, limit = 20) =>
    api.get<PaginatedResponse<GuestbookEntry>>('/guestbook', { page, limit }),

  create: (data: { name: string; message: string }) =>
    api.post<GuestbookEntry>('/guestbook', data),

  approve: (id: string) =>
    api.put<GuestbookEntry>(`/admin/guestbook/${id}/approve`, {}),

  delete: (id: string) =>
    api.delete<void>(`/admin/guestbook/${id}`),
};

export const galleryApi = {
  getAll: (params?: { category?: string; search?: string; page?: number; limit?: number }) =>
    api.get<PaginatedResponse<GalleryItem>>('/gallery', params),

  getById: (id: string) =>
    api.get<GalleryItem>(`/gallery/${id}`),

  create: (data: Partial<GalleryItem>) =>
    api.post<GalleryItem>('/gallery', data),

  update: (id: string, data: Partial<GalleryItem>) =>
    api.put<GalleryItem>(`/gallery/${id}`, data),

  delete: (id: string) =>
    api.delete<void>(`/gallery/${id}`),
};

export const statisticsApi = {
  getOverview: () =>
    api.get<Statistics>('/statistics'),

  getVisitors: (period = '30d') =>
    api.get<{ date: string; visitors: number }[]>('/statistics/visitors', { period }),

  getToolUsage: () =>
    api.get<{ tool: string; count: number }[]>('/statistics/tools'),

  getArticleViews: () =>
    api.get<{ slug: string; views: number }[]>('/statistics/articles'),
};

export const serverApi = {
  getStats: () =>
    api.get<ServerMetric>('/server/stats'),

  getHistory: (hours = 24) =>
    api.get<ServerMetric[]>('/server/stats/history', { hours }),
};

export const statusApi = {
  getSystemStatus: () =>
    api.get<SystemStatus>('/status'),
};

export const personalApi = {
  getMedia: () =>
    api.get<PersonalMedia[]>('/personal/media'),

  getLinuxSetup: () =>
    api.get<LinuxSetup>('/personal/linux-setup'),
};

export const toolsApi = {
  getAll: () =>
    api.get<{ name: string; category: string; description: string; icon: string; route: string; clientSide: boolean }[]>('/tools'),
};

export const networkToolsApi = {
  getAll: () =>
    api.get<{ name: string; category: string; description: string; icon: string; route: string; clientSide: boolean }[]>('/network/tools'),

  dnsLookup: (domain: string, type?: string, server?: string) =>
    api.post<NetworkToolResult>('/network/dns', { domain, type, server }),

  whois: (domain: string) =>
    api.post<NetworkToolResult>('/network/whois', { domain }),

  ping: (host: string) =>
    api.post<NetworkToolResult>('/network/ping', { host }),

  checkPort: (host: string, port: number) =>
    api.post<NetworkToolResult>('/network/port-check', { host, port }),

  traceroute: (host: string) =>
    api.post<NetworkToolResult>('/network/traceroute', { host }),

  httpHeaders: (url: string) =>
    api.post<NetworkToolResult>('/network/http-headers', { url }),

  publicIp: () =>
    api.get<NetworkToolResult>('/network/public-ip'),

  ipCalculator: (ip: string, cidr: number) =>
    api.post<NetworkToolResult>('/network/ip-calculator', { ip, cidr }),

  subnetCalculator: (ip: string, cidr: number, subnets: number) =>
    api.post<NetworkToolResult>('/network/subnet-calculator', { ip, cidr, subnets }),

  cidrConverter: (value: string, type: 'cidr' | 'mask') =>
    api.post<NetworkToolResult>('/network/cidr-converter', { value, type }),
};

export const contactApi = {
  submit: (data: { name: string; email: string; message: string }) =>
    api.post<{ success: boolean }>('/contact', data),
};

export const authApi = {
  login: (email: string, password: string) =>
    api.post<{ user: { id: string; email: string; name: string; role: string } }>('/auth/login', { email, password }),

  logout: () =>
    api.post<void>('/auth/logout'),

  me: () =>
    api.get<{ id: string; email: string; name: string; role: string }>('/auth/me'),
};

export const adminApi = {
  projects: {
    getAll: (params?: { page?: number; limit?: number; search?: string }) =>
      api.get<PaginatedResponse<Project>>('/admin/projects', params),

    create: (data: Partial<Project>) =>
      api.post<Project>('/admin/projects', data),

    update: (id: string, data: Partial<Project>) =>
      api.put<Project>(`/admin/projects/${id}`, data),

    delete: (id: string) =>
      api.delete<void>(`/admin/projects/${id}`),
  },
  notes: {
    getAll: (params?: { page?: number; limit?: number; published?: boolean; search?: string }) =>
      api.get<PaginatedResponse<TechnicalNote>>('/admin/notes', params),

    create: (data: Partial<TechnicalNote>) =>
      api.post<TechnicalNote>('/admin/notes', data),

    update: (id: string, data: Partial<TechnicalNote>) =>
      api.put<TechnicalNote>(`/admin/notes/${id}`, data),

    delete: (id: string) =>
      api.delete<void>(`/admin/notes/${id}`),
  },
  certificates: {
    getAll: (params?: { page?: number; limit?: number; search?: string }) =>
      api.get<PaginatedResponse<Certificate>>('/admin/certificates', params),

    create: (data: Partial<Certificate>) =>
      api.post<Certificate>('/admin/certificates', data),

    update: (id: string, data: Partial<Certificate>) =>
      api.put<Certificate>(`/admin/certificates/${id}`, data),

    delete: (id: string) =>
      api.delete<void>(`/admin/certificates/${id}`),
  },
  gallery: {
    getAll: (params?: { page?: number; limit?: number; search?: string }) =>
      api.get<PaginatedResponse<GalleryItem>>('/admin/gallery', params),

    create: (data: Partial<GalleryItem>) =>
      api.post<GalleryItem>('/admin/gallery', data),

    update: (id: string, data: Partial<GalleryItem>) =>
      api.put<GalleryItem>(`/admin/gallery/${id}`, data),

    delete: (id: string) =>
      api.delete<void>(`/admin/gallery/${id}`),
  },
  changelog: {
    getAll: () =>
      api.get<ChangelogEntry[]>('/admin/changelog'),

    create: (data: Partial<ChangelogEntry>) =>
      api.post<ChangelogEntry>('/admin/changelog', data),

    update: (id: string, data: Partial<ChangelogEntry>) =>
      api.put<ChangelogEntry>(`/admin/changelog/${id}`, data),

    delete: (id: string) =>
      api.delete<void>(`/admin/changelog/${id}`),
  },
  guestbook: {
    getAll: (params?: { page?: number; limit?: number; approved?: boolean; search?: string }) =>
      api.get<PaginatedResponse<GuestbookEntry>>('/admin/guestbook', params),

    approve: (id: string) =>
      api.put<GuestbookEntry>(`/admin/guestbook/${id}/approve`, {}),

    delete: (id: string) =>
      api.delete<void>(`/admin/guestbook/${id}`),
  },
  statistics: {
    getDashboard: () =>
      api.get<unknown>('/admin/statistics'),
  },
};

export interface DriveItem {
  id: string;
  name: string;
  type: 'FILE' | 'FOLDER';
  mimeType?: string;
  size: number;
  parentId?: string | null;
  isTrash: boolean;
  trashedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface DriveResponse {
  items: DriveItem[];
  breadcrumbs: { id: string; name: string }[];
  currentFolderId: string | null;
  isTrash: boolean;
}

export interface StorageStats {
  usedBytes: number;
  activeBytes: number;
  trashBytes: number;
  maxQuotaBytes: number;
  percentageUsed: number;
  fileCount: number;
  folderCount: number;
}

export const driveApi = {
  list: (parentId?: string | null, trash?: boolean) => {
    const params: Record<string, string> = {};
    if (parentId) params.parentId = parentId;
    if (trash) params.trash = 'true';
    return api.get<DriveResponse>('/drive/files', params);
  },

  createFolder: (name: string, parentId?: string | null) =>
    api.post<DriveItem>('/drive/folders', { name, parentId }),

  upload: (file: File, parentId?: string | null) => {
    const formData = new FormData();
    formData.append('file', file);
    if (parentId) formData.append('parentId', parentId);
    return api.post<DriveItem>('/drive/upload', formData);
  },

  rename: (id: string, name: string) =>
    api.patch<DriveItem>('/drive/items/' + id, { name }),

  moveToTrash: (id: string) =>
    api.delete<{ success: boolean; item: DriveItem }>('/drive/items/' + id),

  restore: (id: string) =>
    api.post<{ success: boolean; item: DriveItem }>('/drive/items/' + id + '/restore', {}),

  deletePermanent: (id: string) =>
    api.delete<{ success: boolean }>('/drive/items/' + id + '/permanent'),

  emptyTrash: () =>
    api.delete<{ success: boolean }>('/drive/trash/empty'),

  getStorageStats: () =>
    api.get<StorageStats>('/drive/storage'),

  getDownloadUrl: (id: string) => '/api/drive/download/' + id,
  getPreviewUrl: (id: string) => '/api/drive/preview/' + id,
};