import { z } from 'zod';
import { StockStatus } from '@prisma/client';
// Define the shape for a single medicine inventory update
const inventoryItemSchema = z.object({
    medicineId: z.string().cuid('A valid medicine ID is required.'),
    stockStatus: z.nativeEnum(StockStatus, {
        errorMap: () => ({ message: 'Invalid stock status. Must be IN_STOCK, LOW_STOCK, or OUT_OF_STOCK.' }),
    }),
});
export const updateInventoryDto = z.object({
    body: z.object({
        // The request body should contain an array of medicine updates
        items: z.array(inventoryItemSchema).min(1, 'At least one inventory item is required for an update.'),
    }),
});
//# sourceMappingURL=update-inventory.dto.js.map