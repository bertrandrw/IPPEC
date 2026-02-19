import { z } from 'zod';
// Re-use the medicine schema from the create DTO, but make all fields optional for updates
const prescribedMedicineUpdateSchema = z.object({
    medicineId: z.string().cuid(),
    route: z.string().min(1),
    form: z.string().min(1),
    quantityPerDose: z.number().int().positive(),
    frequency: z.string().min(1),
    durationInDays: z.number().int().positive().optional(),
    fullInstruction: z.string().min(1),
    totalQuantity: z.string().optional(),
});
export const updatePrescriptionDto = z.object({
    body: z.object({
        // Clinical context can be updated
        chiefComplaints: z.string().optional(),
        findingsOnExam: z.string().optional(),
        advice: z.string().optional(),
        followUpDate: z.string().datetime().optional().nullable(),
        // The entire list of medicines can be replaced
        medicines: z.array(prescribedMedicineUpdateSchema).optional(),
    }),
});
//# sourceMappingURL=update-prescription.dto.js.map