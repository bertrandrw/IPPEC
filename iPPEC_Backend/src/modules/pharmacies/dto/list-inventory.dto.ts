// src/modules/pharmacies/dto/list-inventory.dto.ts
import { z } from 'zod';

// Define the allowed fields for sorting
const sortByEnum = z.enum([
  'brandName_asc',
  'brandName_desc',
  'stockStatus_asc',
  'stockStatus_desc',
]);

export const listInventoryDto = z.object({
  query: z.object({
    search: z.string().optional(),
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().default(20),
    sortBy: sortByEnum.optional(),
  }),
});
