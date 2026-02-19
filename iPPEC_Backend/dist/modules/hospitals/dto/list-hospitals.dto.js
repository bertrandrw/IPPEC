import { z } from 'zod';
export const listHospitalsDto = z.object({
    query: z.object({
        search: z.string().optional(),
        page: z.coerce.number().int().positive().default(1),
        limit: z.coerce.number().int().positive().default(10),
    }),
});
// import { z } from 'zod';
// export const listHospitalsDto = z.object({
//   query: z.object({
//     // Optional search string
//     search: z.string().optional(),
//     // Pagination fields with defaults
//     page: z.coerce.number().int().positive().default(1),
//     limit: z.coerce.number().int().positive().default(10),
//   }),
// });
//# sourceMappingURL=list-hospitals.dto.js.map