import { z } from 'zod';

export const generateClaimReportDto = z.object({
  body: z.object({
    insuranceCompanyId: z.string().cuid('A valid insurance company ID is required.'),
    startDate: z.string().datetime({ message: 'Start date must be a valid ISO 8601 date string.' }),
    endDate: z.string().datetime({ message: 'End date must be a valid ISO 8601 date string.' }),
  }),
});