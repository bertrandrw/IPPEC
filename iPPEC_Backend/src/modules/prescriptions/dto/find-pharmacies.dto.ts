// src/modules/prescriptions/dto/find-pharmacies.dto.ts
import { z } from 'zod';

export const findPharmaciesDto = z.object({
  query: z.object({
    // Location is required
    latitude: z.coerce.number().min(-90).max(90),
    longitude: z.coerce.number().min(-180).max(180),
    // Optional search parameters with defaults
    radius: z.coerce.number().positive('Radius must be a positive number.').default(100000000000000),
    limit: z.coerce.number().int().positive('Limit must be a positive integer.').default(10),
  }),
});