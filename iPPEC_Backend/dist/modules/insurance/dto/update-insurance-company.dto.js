import { z } from 'zod';
export const updateInsuranceCompanyDto = z.object({
    body: z.object({
        name: z.string().min(1).optional(),
        address: z.string().optional(),
        contactEmail: z.string().email().optional(),
        contactPhone: z.string().optional(),
    }),
});
//# sourceMappingURL=update-insurance-company.dto.js.map