import { z } from 'zod';

export const createPostSchema = z.object({
  body: z.object({
    title: z
      .string({ required_error: 'Title is required' })
      .trim()
      .min(1, 'Title must be at least 1 character')
      .max(150, 'Title cannot exceed 150 characters'),
    content: z
      .string({ required_error: 'Content is required' })
      .min(1, 'Content must be at least 1 character'),
    coverImage: z.string().trim().optional().or(z.literal('')),
    excerpt: z.string().trim().max(300).optional(),
    status: z.enum(['draft', 'published']).default('draft'),
    tags: z.array(z.string().trim()).default([]),
  }),
});

export const updatePostSchema = z.object({
  body: z.object({
    title: z.string().trim().min(1).max(150).optional(),
    content: z.string().min(1).optional(),
    coverImage: z.string().trim().optional().or(z.literal('')),
    excerpt: z.string().trim().max(300).optional(),
    status: z.enum(['draft', 'published']).optional(),
    tags: z.array(z.string().trim()).optional(),
  }),
  params: z.object({
    id: z.string().min(1, 'Post ID is required'),
  }),
});

export const postIdParamSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Post ID is required'),
  }),
});
