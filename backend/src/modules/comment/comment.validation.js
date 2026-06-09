import { z } from 'zod';

export const createCommentSchema = z.object({
  body: z.object({
    content: z
      .string({ required_error: 'Content is required' })
      .trim()
      .min(1, 'Comment must be at least 1 character')
      .max(500, 'Comment cannot exceed 500 characters'),
    post: z.string({ required_error: 'Post ID is required' }),
  }),
});
