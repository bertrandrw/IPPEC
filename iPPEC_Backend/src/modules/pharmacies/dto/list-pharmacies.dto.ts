import { z } from 'zod';

export const listPharmaciesDto = z.object({
  query: z.object({
    // Optional search string
    search: z.string().optional(),
    
    // Pagination fields with defaults
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().default(10),
  }),
});