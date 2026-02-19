// src/modules/insurers/dto/adjudicate-item.dto.ts
import { z } from 'zod';
import { ClaimItemStatus } from '@prisma/client';

export const adjudicateItemDto = z.object({
  body: z.object({
    status: z.nativeEnum(ClaimItemStatus),
    // Rejection reason is only required if the status is REJECTED
    rejectionReason: z.string().optional(),
  }).refine(data => {
      if (data.status === 'REJECTED') {
        return typeof data.rejectionReason === 'string' && data.rejectionReason.length > 0;
      }
      return true;
  }, {
      message: "Rejection reason is required when rejecting a claim item.",
      path: ["rejectionReason"],
  }),
});
