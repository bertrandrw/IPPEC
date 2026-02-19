// src/modules/articles/dto/update-article.dto.ts
import { z } from 'zod';
import { ArticleStatus } from '@prisma/client';

export const updateArticleDto = z.object({
  body: z.object({
    title: z.string().min(5).optional(),
    
    content: z
      .string()
      .min(50)
      // --- ADD THE SAME VALIDATION HERE ---
      .refine(
        (content) => !/<script\b[^>]*>[\s\S]*?<\/script\b[^>]*>/i.test(content),
        {
          message: 'Content cannot contain script tags.',
        }
      )
      .optional(),
      
    featuredImageUrl: z.string().url().optional().nullable(),
    status: z.nativeEnum(ArticleStatus).optional(),
    category: z.string().optional().nullable(),
  }),
});

























// // src/modules/articles/dto/update-article.dto.ts
// import { z } from 'zod';
// import { ArticleStatus } from '@prisma/client';

// export const updateArticleDto = z.object({
//   body: z.object({
//     title: z.string().min(5).optional(),
//     content: z.string().min(50).optional(),
//     category: z.string().optional().nullable(),
//     // Allow setting to a new URL, or to null to remove it
//     featuredImageUrl: z.string().url().optional().nullable(),
//     status: z.nativeEnum(ArticleStatus).optional(),
//   }),
// });
