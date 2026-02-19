// src/modules/articles/dto/article-params.dto.ts
import { z } from 'zod';

export const articleParamsDto = z.object({
  params: z.object({
    id: z.string().cuid('A valid article ID is required.'), // <-- This is the check
  }),
});

