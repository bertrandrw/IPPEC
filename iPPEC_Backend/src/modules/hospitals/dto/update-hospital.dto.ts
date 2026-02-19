import { z } from 'zod';
// Import the enums from the generated Prisma Client to use for validation
import { FacilityType, Ownership } from '@prisma/client';

export const updateHospitalDto = z.object({
  body: z.object({
    // Basic Information
    name: z.string().min(1, 'Name cannot be empty.').optional(),
    address: z.string().min(1, 'Address cannot be empty.').optional(),
    type: z.nativeEnum(FacilityType).optional(),
    ownership: z.nativeEnum(Ownership).optional(),

    // Contact Details
    email: z.string().email('If provided, email must be a valid format.').optional(),
    phone: z.string().optional(),
    emergencyPhone: z.string().optional(),
    website: z.string().url('If provided, website must be a valid URL.').optional(),

    // Facility Head Info
    facilityHeadName: z.string().optional(),
    facilityHeadDesignation: z.string().optional(),
    facilityHeadPhone: z.string().optional(),
    facilityHeadEmail: z.string().email('If provided, facility head email must be a valid format.').optional(),
  }),
});
