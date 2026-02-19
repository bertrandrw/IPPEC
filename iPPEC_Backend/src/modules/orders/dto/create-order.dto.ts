// src/modules/orders/dto/create-order.dto.ts
import { z } from 'zod';

const orderItemSchema = z.object({
  medicineId: z.string().cuid('A valid medicine ID is required.'),
  quantity: z.number().int().positive('Quantity must be a positive integer.'),
});

export const createOrderDto = z.object({
  body: z.object({
    pharmacyId: z.string().cuid('A valid pharmacy ID is required.'),
    prescriptionId: z.string().cuid('A valid prescription ID is required.'),
    orderItems: z.array(orderItemSchema).min(1, 'At least one medicine must be ordered.'),
  }),
});
