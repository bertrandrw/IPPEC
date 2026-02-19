import { z } from 'zod';
const licenseNumberRegex = /^NPC\/[A-Z]\d{4}$/;
export const createPharmacistDto = z.object({
    body: z.object({
        // User data
        email: z.string().email('A valid email is required.'),
        phone: z.string().min(10, 'Phone number must be at least 10 digits.'),
        password: z.string().min(6, 'Password must be at least 6 characters long.'),
        // Profile data
        fullName: z.string().min(1, 'Full name is required.'),
        // Link to Pharmacy
        pharmacyId: z.string().cuid('A valid pharmacy ID is required.'),
        licenceNumber: z
            .string()
            .regex(licenseNumberRegex, 'Invalid license number format. Must be in the format NPC/A1182.'),
    }),
});
//# sourceMappingURL=create-pharmacist.dto.js.map