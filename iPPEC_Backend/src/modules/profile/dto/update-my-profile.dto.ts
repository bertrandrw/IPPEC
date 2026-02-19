// src/modules/profile/dto/update-my-profile.dto.ts

import { z } from 'zod';

export const updateMyProfileDto = z.object({
  body: z.object({
    // Fields from the base User model that can be changed
    email: z.string().email('If provided, must be a valid email.').optional(),
    phone: z.string().min(10, 'Phone must be at least 10 digits.').optional(),
    fullName: z.string().min(1, 'Full name cannot be empty.').optional(),

  }),
});
