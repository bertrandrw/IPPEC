import { z } from 'zod';

export const createPharmacyDto = z.object({
  body: z.object({
    name: z.string().min(1, 'Pharmacy name is required.'),
    address: z.string().min(1, 'Pharmacy address is required.'),
    licenseNumber: z.string().min(1, 'License number is required.'),
    
    // Optional contact fields
    contactPhone: z.string().optional(),
    contactEmail: z.string().email('If provided, contactEmail must be a valid email.').optional(),

    // Other optional fields
    latitude: z.number().optional(),
    longitude: z.number().optional(),
    companyCode: z.string().optional(),
    managingDirector: z.string().optional(),
    licenseExpiryDate: z.string().datetime({ message: 'Expiry date must be a valid ISO date string.' }).optional(),
    authorizedPharmacistId: z.string().cuid('authorizedPharmacistId must be a valid CUID.').optional(),
  }),
});















// import { z } from 'zod';

// export const createPharmacyDto = z.object({
//   body: z.object({
//     name: z.string().min(1, 'Pharmacy name is required.'),
//     address: z.string().min(1, 'Pharmacy address is required.'),
//     licenseNumber: z.string().min(1, 'License number is required.'),
//     latitude: z.number().min(1, 'latitude is required.'),
//     longitude: z.number().min(1, 'longitude is required.'),
//   }),
// });