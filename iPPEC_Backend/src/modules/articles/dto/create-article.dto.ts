// src/modules/articles/dto/create-article.dto.ts
import { z } from 'zod';

export const createArticleDto = z.object({
  body: z.object({
    title: z.string().min(5),
    
    content: z
      .string()
      .min(50, 'Content must be at least 50 characters long.')
      // --- THIS IS THE NEW VALIDATION ---
      .refine(
        (content) => !/<script\b[^>]*>[\s\S]*?<\/script\b[^>]*>/i.test(content),
        {
          message: 'Content cannot contain script tags.',
        }
      ),
      
    featuredImageUrl: z.string().url().optional(),
    category: z.string().optional(),
  }),
});






















// import { z } from 'zod';

// export const createArticleDto = z.object({
//   body: z.object({
//     title: z.string().min(5, 'Title must be at least 5 characters long.'),
//     content: z.string().min(50, 'Content must be at least 50 characters long.'),
//     category: z.string().optional(),
//     // featuredImageUrl is an optional, valid URL string
//     featuredImageUrl: z.string().url('If provided, featuredImageUrl must be a valid URL.').optional(),
//   }),
// });