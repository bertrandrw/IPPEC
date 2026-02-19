import { z } from 'zod';
import { OrderStatus } from '@prisma/client';

export const updateOrderStatusDto = z.object({
  body: z.object({
    status: z.nativeEnum(OrderStatus, {
      errorMap: () => ({ message: 'A valid order status is required.' }),
    }),
  }),
});
