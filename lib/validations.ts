import { z } from 'zod';

export const siteSchema = z.object({
  teamId: z.number(),
  name: z.string().min(1).max(100),
  domain: z.string().min(1).max(255),
  isActive: z.boolean().optional(),
  settings: z.record(z.unknown()).optional(),
});

export const postTypeSchema = z.object({
  siteId: z.number(),
  name: z.string().min(1).max(100),
  slug: z.string().min(1).max(100),
  description: z.string().optional(),
  fields: z.array(z.unknown()),
  isActive: z.boolean().optional(),
});

export const postSchema = z.object({
  postTypeId: z.number(),
  authorId: z.number(),
  title: z.string().min(1).max(255),
  slug: z.string().min(1).max(255),
  content: z.record(z.unknown()),
  status: z.enum(['draft', 'published']).optional(),
  isPublished: z.boolean().optional(),
});

export const fieldSchema = z.object({
  postTypeId: z.number(),
  name: z.string().min(1).max(100),
  slug: z.string().min(1).max(100),
  type: z.string().min(1).max(50),
  isRequired: z.boolean().optional(),
  defaultValue: z.unknown().optional(),
  options: z.record(z.unknown()).optional(),
  order: z.number(),
});

export const mediaSchema = z.object({
  siteId: z.number(),
  fileName: z.string().min(1).max(255),
  fileType: z.string().min(1).max(50),
  fileSize: z.number(),
  url: z.string().url(),
  altText: z.string().optional(),
});
