// src/modules/medicines/dto/list-medicines.dto.ts
import { z } from 'zod';
export const listMedicinesDto = z.object({
    query: z.object({
        search: z.string().optional(),
        page: z.coerce.number().int().positive().default(1),
        limit: z.coerce.number().int().positive().default(10),
    }),
});
//# sourceMappingURL=list-medicines.dto.js.map