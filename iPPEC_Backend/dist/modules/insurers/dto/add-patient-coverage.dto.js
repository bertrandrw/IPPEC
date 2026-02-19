import { z } from 'zod';
export const addPatientCoverageDto = z.object({
    body: z.object({
        // The ID of the patient profile to add coverage to
        patientProfileId: z.string().cuid('A valid patient profile ID is required.'),
        // The specific details of their plan
        insurancePolicyNumber: z.string().min(1, 'Insurance policy number is required.'),
        coveragePercentage: z
            .number()
            .min(0, 'Coverage must be at least 0.')
            .max(1, 'Coverage cannot be more than 1 (100%).'),
    }),
});
//# sourceMappingURL=add-patient-coverage.dto.js.map