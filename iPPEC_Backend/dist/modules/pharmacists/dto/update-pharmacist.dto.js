import { z } from 'zod';
export const updatePharmacistDto = z.object({
    body: z.object({
        // User fields
        email: z.string().email().optional(),
        phone: z.string().min(10).optional(),
        // Profile fields
        fullName: z.string().min(1).optional(),
        pharmacyId: z.string().cuid().optional(),
    }),
});
//# sourceMappingURL=update-pharmacist.dto.js.map