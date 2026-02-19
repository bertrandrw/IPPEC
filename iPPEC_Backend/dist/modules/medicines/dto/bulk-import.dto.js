import { z } from 'zod';
// This schema defines the expected shape of a single row in the CSV/Excel file.
export const medicineCsvRowSchema = z.object({
    brandName: z.string().min(1, 'brandName is required.'),
    genericName: z.string().min(1, 'genericName is required.'),
    manufacturer: z.string().min(1, 'manufacturer is required.'),
    // Coerce price from string (as it comes from CSV) to a number
    price: z.coerce.number().positive('price must be a positive number.'),
});
//# sourceMappingURL=bulk-import.dto.js.map