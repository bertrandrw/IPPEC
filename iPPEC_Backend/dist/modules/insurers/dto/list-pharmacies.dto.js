// src/modules/insurers/dto/list-pharmacies.dto.ts
import { z } from 'zod';
export const listPharmaciesDto = z.object({
    query: z.object({
        page: z.coerce.number().int().positive().default(1),
        limit: z.coerce.number().int().positive().default(10),
    }),
});
//# sourceMappingURL=list-pharmacies.dto.js.map