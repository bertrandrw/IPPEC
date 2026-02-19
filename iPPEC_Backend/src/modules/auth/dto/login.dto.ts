import { z } from 'zod';

export const loginDto = z.object({
  body: z.object({
    // Allow login with either email or phone
    emailOrPhone: z.string().min(1, 'Email or phone number is required.'),
    password: z.string().min(1, 'Password is required.'),
  }),
});
