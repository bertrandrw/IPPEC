import { z } from 'zod';

export const createDoctorDto = z.object({
  body: z.object({
    // User data
    email: z.string().email(),
    phone: z.string()
      .length(10, 'Phone number must be exactly 10 characters')
      .regex(/^(078|079|072|073)/, 'Phone number must start with 078, 079, 072, or 073')
      .regex(/^\d+$/, 'Phone number must contain only digits'),
    password: z.string().min(6),
    // DoctorProfile data
    fullName: z.string().min(1),
    credentials: z.string().min(1),
    specialty: z.string().min(1),
    licenceNumber: z.string().min(2),
    // Link to hospital
    hospitalId: z.string().cuid('A valid hospital ID is required.'),
  }),
});

// import { z } from 'zod';
// import { ROLES } from '../../../constants/roles.js';

// export const createDoctorDto = z.object({
//   body: z.object({
//     // User data
//     email: z.string().email(),
//     phone: z.string().min(10),
//     password: z.string().min(6),
//     // DoctorProfile data
//     fullName: z.string().min(1),
//     credentials: z.string().min(1),
//     specialty: z.string().min(1),
//     // Link to hospital
//     hospitalId: z.string().cuid('A valid hospital ID is required.'),
//   }),
// });