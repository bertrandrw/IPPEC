// in src/modules/admin/dto/create-hospital.dto.ts
import { z } from 'zod';
import { FacilityType, Ownership } from '@prisma/client';

export const createHospitalDto = z.object({
  body: z.object({
    // Required fields
    name: z.string().min(1, 'Facility name is required.'),
    address: z.string().min(1, 'Full address is required.'),

    // Basic Information (with defaults)
    type: z.nativeEnum(FacilityType).default('HOSPITAL'),
    ownership: z.nativeEnum(Ownership).default('PRIVATE'),

    // Contact Details (optional)
    email: z.string().email('Must be a valid email.').optional(),
    phone: z.string().optional(),
    emergencyPhone: z.string().optional(),
    website: z.string().url('Must be a valid URL.').optional(),

    // Facility Head Info (optional)
    facilityHeadName: z.string().optional(),
    facilityHeadDesignation: z.string().optional(),
    facilityHeadPhone: z.string().optional(),
    facilityHeadEmail: z.string().email().optional(),
  }),
});

















// import { z } from 'zod';

// export const createHospitalDto = z.object({
//   body: z.object({
//     name: z.string().min(1, 'Hospital name is required.'),
//     address: z.string().min(1, 'Hospital address is required.'),
//   }),
// });
