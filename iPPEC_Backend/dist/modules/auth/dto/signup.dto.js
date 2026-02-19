import { z } from 'zod';
import { ROLES } from '../../../constants/roles.js';
// Regex to check the basic structure: Starts with [1-3], followed by 15 more digits. Total 16 digits.
const nidStructuralRegex = /^[123]\d{15}$/;
export const signupDto = z.object({
    body: z
        .object({
        email: z.string().email('A valid email is required.'),
        phone: z.string().min(10, 'Phone number must be at least 10 digits.'),
        password: z.string().min(6, 'Password must be at least 6 characters long.'),
        role: z.literal(ROLES.PATIENT),
        // Patient Profile Data
        fullName: z.string().min(1, 'Full name is required.'),
        dateOfBirth: z.string().datetime({ message: "Date of birth must be a valid ISO 8601 date string." }),
        sex: z.string().min(1, 'Sex is required.'),
        // National ID (NID) - must be provided
        nid: z.string().regex(nidStructuralRegex, 'NID must be 16 digits and start with 1, 2, or 3.'),
    })
        // --- The Cross-Field Validation Logic ---
        .refine((data) => {
        // Extract the year from the dateOfBirth string (e.g., "1995-06-15...")
        const yearFromDob = new Date(data.dateOfBirth).getFullYear();
        // Extract the year from the NID string. The year is the 2nd to 5th characters.
        // NID example: 11995... -> substring(1, 5) gives "1995"
        const yearFromNid = parseInt(data.nid.substring(1, 5), 10);
        // Return true only if the years match.
        return yearFromDob === yearFromNid;
    }, {
        // This error message will be shown if the refine function returns false.
        message: 'The year in the NID must match the year in the date of birth.',
        // We specify the path to show which field the error is most related to.
        path: ['nid'],
    }),
});
// import { z } from 'zod';
// import { ROLES } from '../../../constants/roles.js';
// const nidRegex = /^[1-3]\d{4}[78]\d{9}$/;
// export const signupDto = z.object({
//   body: z
//     .object({
//       email: z.string().email('A valid email is required.'),
//       phone: z.string()
//         .length(10, 'Phone number must be exactly 10 characters')
//         .regex(/^(078|079|072|073)/, 'Phone number must start with 078, 079, 072, or 073')
//         .regex(/^\d+$/, 'Phone number must contain only digits'),
//       password: z.string().min(6, 'Password must be at least 6 characters long.'),
//       role: z.literal(ROLES.PATIENT, {
//         errorMap: () => ({ message: 'Signup is only allowed for patients.' }),
//       }),
//       fullName: z.string().min(1, 'Full name is required.'),
//       dateOfBirth: z.string().datetime({ message: "Date of birth must be a valid ISO 8601 date string." }),
//       sex: z.string().min(1, 'Sex is required.'),
//       nid: z.string()
//         .regex(nidRegex, 'NID must be a 16-digit number in the correct format.')
//         .optional(),
//     })
// });
//# sourceMappingURL=signup.dto.js.map