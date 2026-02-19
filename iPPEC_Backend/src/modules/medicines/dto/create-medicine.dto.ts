import { z } from 'zod';

export const createMedicineDto = z.object({
  body: z.object({
    brandName: z.string().min(1, 'Brand name is required.'),
    genericName: z.string().min(1, 'Generic name is required.'),
    manufacturer: z.string().min(1, 'Manufacturer is required.'),
    price: z.number().positive('Price must be a positive number.'),
  }),
});
