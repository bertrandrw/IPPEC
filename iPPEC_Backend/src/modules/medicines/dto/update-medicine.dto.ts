import { z } from 'zod';

export const updateMedicineDto = z.object({
  body: z.object({
    brandName: z.string().min(1).optional(),
    genericName: z.string().min(1).optional(),
    manufacturer: z.string().min(1).optional(),
    price: z.number().positive().optional(),
  }),
});
