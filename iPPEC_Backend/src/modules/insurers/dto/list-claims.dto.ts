import { z } from 'zod';

export const listClaimsDto = z.object({
  query: z.object({
    // Optional filter to see claims from only one pharmacy
    pharmacyId: z.string().cuid('If provided, pharmacyId must be a valid CUID.').optional(),
    
    // Pagination fields with defaults
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().default(10),
  }),
});
