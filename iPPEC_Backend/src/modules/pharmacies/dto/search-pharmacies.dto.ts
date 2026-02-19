import { z } from 'zod';

export const searchPharmaciesDto = z.object({
  query: z.object({
    // The medicine the user is searching for
    medicineId: z.string().cuid('A valid medicine ID is required.'),

    // User's current location
    latitude: z.coerce.number().min(-90).max(90),
    longitude: z.coerce.number().min(-180).max(180),

    // Optional search radius and limit
    radius: z.coerce.number().positive().default(1000000),
    limit: z.coerce.number().int().positive().optional(),

    // --- NEW OPTIONAL FIELD ---
    // The CUID of the patient's insurance company to filter by.
    insuranceCompanyId: z.string().cuid('If provided, insuranceCompanyId must be a valid CUID.').optional(),
  }),
});