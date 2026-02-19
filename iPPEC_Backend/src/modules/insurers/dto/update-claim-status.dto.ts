// src/modules/insurers/dto/update-claim-status.dto.ts
import { z } from 'zod';
import { ClaimStatus } from '@prisma/client';

export const updateClaimStatusDto = z.object({
  body: z.object({
    status: z.nativeEnum(ClaimStatus, {
      errorMap: () => ({ message: 'A valid claim status is required.' }),
    }),
  }),
});
