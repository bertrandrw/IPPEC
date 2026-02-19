import { z } from 'zod';
export const createInsurerDto = z.object({
    body: z.object({
        // User account details
        email: z.string().email('A valid email is required.'),
        phone: z.string().min(10, 'Phone number must be at least 10 digits.'),
        password: z.string().min(6, 'Password must be at least 6 characters long.'),
        // Insurer's profile details
        fullName: z.string().min(1, 'Full name is required.'),
        // Link to the company they work for
        insuranceCompanyId: z.string().cuid('A valid insurance company ID is required.'),
    }),
});
//# sourceMappingURL=create-insurer.dto.js.map