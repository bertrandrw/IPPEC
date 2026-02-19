// src/modules/insurers/dto/create-agreement.dto.ts

import { z } from 'zod';

export const createAgreementDto = z.object({
  body: z.object({
    pharmacyId: z.string().cuid('A valid pharmacy ID is required.'),
  }),
});
