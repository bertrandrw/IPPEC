import { z } from 'zod';

export const createInsuranceCompanyDto = z.object({
  body: z.object({
    name: z.string().min(1, 'Company name is required.'),
    address: z.string().optional(),
    contactEmail: z.string().email('A valid contact email is required.'),
    contactPhone: z.string().optional(),
  }),
});
