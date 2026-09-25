import { z } from 'zod';

export const loginSchema = z.object({
  body: z.object({
    email: z.string().min(1, 'Username or Email is required'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
  }),
});

export const projectSchema = z.object({
  body: z.object({
    title: z.string().min(1).max(200),
    slug: z.string().min(1).max(200).regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens'),
    description: z.string().min(1).max(1000),
    content: z.string().optional(),
    technologies: z.array(z.string()).optional(),
    image: z.string().url().optional().or(z.literal('')),
    demoUrl: z.string().url().optional().or(z.literal('')),
    repoUrl: z.string().url().optional().or(z.literal('')),
    status: z.enum(['PLANNING', 'IN_PROGRESS', 'COMPLETED', 'ARCHIVED']).optional(),
    featured: z.boolean().optional(),
  }),
});

export const noteSchema = z.object({
  body: z.object({
    title: z.string().min(1).max(200),
    slug: z.string().min(1).max(200).regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens'),
    category: z.string().min(1).max(50),
    tags: z.array(z.string()).optional(),
    summary: z.string().min(1).max(500),
    content: z.string().min(1),
    published: z.boolean().optional(),
  }),
});

export const certificateSchema = z.object({
  body: z.object({
    name: z.string().min(1).max(200),
    provider: z.string().min(1).max(100),
    issueDate: z.string().datetime(),
    expiryDate: z.string().datetime().optional().nullable(),
    credentialId: z.string().optional(),
    verificationUrl: z.string().url().optional().or(z.literal('')),
    imageUrl: z.string().url().optional().or(z.literal('')),
  }),
});

export const changelogSchema = z.object({
  body: z.object({
    version: z.string().min(1).max(50).regex(/^v\d+\.\d+\.\d+$/, 'Version must be in format vX.Y.Z'),
    date: z.string().datetime(),
    added: z.array(z.string()).optional(),
    changed: z.array(z.string()).optional(),
    fixed: z.array(z.string()).optional(),
    improved: z.array(z.string()).optional(),
  }),
});

export const gallerySchema = z.object({
  body: z.object({
    title: z.string().min(1).max(200),
    description: z.string().optional(),
    category: z.string().min(1).max(50),
    imageUrl: z.string().url(),
    thumbnailUrl: z.string().url().optional().or(z.literal('')),
    tags: z.array(z.string()).optional(),
  }),
});

export const guestbookSchema = z.object({
  body: z.object({
    name: z.string().min(1).max(100),
    message: z.string().min(1).max(500),
  }),
});

export const contactSchema = z.object({
  body: z.object({
    name: z.string().min(1).max(100),
    email: z.string().email(),
    message: z.string().min(1).max(2000),
  }),
});

export const networkToolSchemas = {
  dns: z.object({ body: z.object({ domain: z.string().min(1).max(253) }) }),
  whois: z.object({ body: z.object({ domain: z.string().min(1).max(253) }) }),
  ping: z.object({ body: z.object({ host: z.string().min(1).max(253) }) }),
  checkPort: z.object({ body: z.object({ host: z.string().min(1).max(253), port: z.union([z.number().int().min(1).max(65535), z.string().regex(/^\d+$/)]) }) }),
  traceroute: z.object({ body: z.object({ host: z.string().min(1).max(253) }) }),
  httpHeaders: z.object({ body: z.object({ url: z.string().url() }) }),
  ipCalculator: z.object({ body: z.object({ ip: z.string().ip(), cidr: z.number().int().min(0).max(32) }) }),
  subnetCalculator: z.object({ body: z.object({ ip: z.string().ip(), cidr: z.number().int().min(0).max(30), subnets: z.number().int().min(1).max(256) }) }),
  cidrConverter: z.object({ body: z.object({ value: z.string(), type: z.enum(['cidr', 'mask']) }) }),
};