import { z } from 'zod';

export const findPatientDto = z.object({
  query: z.object({
    nid: z.string().min(1, 'National ID (NID) is required.'),
  }),
});