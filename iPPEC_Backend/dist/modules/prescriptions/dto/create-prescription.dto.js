import { z } from 'zod';
// Define the new, structured shape of a single medicine within the prescription
const prescribedMedicineSchema = z.object({
    // Link to the master medicine list
    medicineId: z.string().cuid('A valid medicine ID is required.'),
    // Structured fields based on the clinical prescription sheet
    route: z.string().min(1, 'Route (e.g., PO, IM) is required.'),
    form: z.string().min(1, 'Medication form (e.g., Tablet) is required.'),
    quantityPerDose: z.number().int().positive('Quantity per dose must be a positive integer.'),
    frequency: z.string().min(1, 'Frequency (e.g., tid, bid) is required.'),
    durationInDays: z.number().int().positive('Duration in days must be a positive integer.').optional(),
    // This human-readable string is constructed on the frontend and sent for storage
    fullInstruction: z.string().min(1, 'Full instruction summary (e.g., "1 tab tid 7/7") is required.'),
    // This calculated value is also sent from the frontend
    totalQuantity: z.string().optional(),
});
export const createPrescriptionDto = z.object({
    body: z.object({
        // Who the prescription is for
        patientId: z.string().cuid('A valid patient ID is required.'),
        // The list of medicines must contain at least one item, matching the new schema
        medicines: z.array(prescribedMedicineSchema).min(1, 'At least one medicine is required.'),
        // Optional clinical context fields
        chiefComplaints: z.string().optional(),
        findingsOnExam: z.string().optional(),
        investigations: z.string().optional(),
        advice: z.string().optional(),
        followUpDate: z.string().datetime({ message: "Follow-up date must be a valid ISO 8601 date string." }).optional(),
    }),
});
//# sourceMappingURL=create-prescription.dto.js.map