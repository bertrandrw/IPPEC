// src/modules/articles/dto/list-articles.dto.ts
import { z } from 'zod';

export const listArticlesDto = z.object({
  query: z.object({
    search: z.string().optional(),
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().default(10),
    category: z.string().optional()
  }),
});
