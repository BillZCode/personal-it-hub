export interface User {
  id: string;
  email: string;
  name: string;
  role: 'ADMIN' | string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  content?: string;
  image?: string;
  technologies: string[];
  demoUrl?: string;
  repoUrl?: string;
  status: ProjectStatus;
  featured: boolean;
  startDate?: string;
  endDate?: string;
  createdAt: string;
  updatedAt: string;
}

export type ProjectStatus = 'PLANNING' | 'IN_PROGRESS' | 'COMPLETED' | 'ARCHIVED';

export interface Certificate {
  id: string;
  name: string;
  provider: string;
  issueDate: string;
  expiryDate?: string;
  credentialId?: string;
  verificationUrl?: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TechnicalNote {
  id: string;
  title: string;
  slug: string;
  category: string;
  tags: string[];
  summary: string;
  content: string;
  readingTime: number;
  published: boolean;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface GuestbookEntry {
  id: string;
  name: string;
  message: string;
  ipHash: string;
  userAgent?: string;
  approved: boolean;
  createdAt: string;
}

export interface ChangelogEntry {
  id: string;
  version: string;
  date: string;
  added: string[];
  changed: string[];
  fixed: string[];
  improved: string[];
  createdAt: string;
  updatedAt: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  description?: string;
  category: string;
  imageUrl: string;
  thumbnailUrl?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ServerMetric {
  id: string;
  cpuUsage: number;
  ramUsage: number;
  diskUsage: number;
  cpuTemp?: number;
  networkDown: number;
  networkUp: number;
  uptime: number;
  processCount: number;
  recordedAt: string;
}

export interface Statistics {
  id: string;
  date: string;
  visitors: number;
  pageViews: number;
  toolUsage: Record<string, number>;
  articleViews: Record<string, number>;
  createdAt: string;
  updatedAt: string;
}

export interface PersonalMedia {
  id: string;
  type: MediaType;
  title: string;
  artist?: string;
  album?: string;
  platform?: string;
  coverUrl?: string;
  status: string;
  rating?: number;
  progress?: number;
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export type MediaType = 'GAME' | 'MUSIC' | 'ANIME' | 'MOVIE';

export interface LinuxSetup {
  id: string;
  distribution: string;
  desktopEnv?: string;
  windowManager?: string;
  terminal: string;
  shell: string;
  editor: string;
  tools: string[];
  hardware?: Record<string, unknown>;
  dotfilesUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SystemStatus {
  website: ServiceStatus;
  api: ServiceStatus;
  download: ServiceStatus;
  database: ServiceStatus;
  dns: ServiceStatus;
}

export type ServiceStatus = 'operational' | 'degraded' | 'partial_outage' | 'major_outage';

export interface NetworkToolResult {
  success: boolean;
  data?: any;
  error?: string;
  executionTime: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiError {
  message: string;
  code?: string;
  statusCode: number;
  details?: Record<string, unknown>;
}

export interface Tool {
  name: string;
  category: string;
  description: string;
  icon: string;
  route: string;
  clientSide: boolean;
}

export interface NavItem {
  label: string;
  href: string;
  icon: string;
  children?: NavItem[];
  adminOnly?: boolean;
}

export interface NavSection {
  label: string;
  items: NavItem[];
}