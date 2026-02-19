// src/modules/medicines/medicine.service.ts

import { z } from 'zod';
import csvParser from 'csv-parser';
import { Readable } from 'stream';
import * as xlsx from 'xlsx';
import { WorkSheet } from 'xlsx';
import { StatusCodes } from 'http-status-codes';
import { prisma } from '../../config/index.js';
import { ApiError } from '../../utils/ApiError.js';
import { medicineCsvRowSchema, MedicineCsvRow } from './dto/bulk-import.dto.js';
import { createMedicineDto } from './dto/create-medicine.dto.js';
import { updateMedicineDto } from './dto/update-medicine.dto.js';
import { Prisma } from '@prisma/client';

type CreateMedicineInput = z.infer<typeof createMedicineDto>['body'];
type UpdateMedicineInput = z.infer<typeof updateMedicineDto>['body'];

// Interface for the function parameters
interface ListMedicinesParams {
  page: number;
  limit: number;
  search?: string;
}

// ====================================================================
// SECTION: SINGLE-ENTRY CRUD
// ====================================================================

export const createMedicine = async (input: CreateMedicineInput) => {
  const existingMedicine = await prisma.medicine.findFirst({
    where: { brandName: input.brandName, manufacturer: input.manufacturer },
  });
  if (existingMedicine) {
    throw new ApiError(StatusCodes.CONFLICT, 'This medicine from this manufacturer already exists.');
  }
  return prisma.medicine.create({ data: input });
};

// export const getAllMedicines = async () => {
//   return prisma.medicine.findMany({ orderBy: { brandName: 'asc' } });
// };

export const getAllMedicines = async ({ page, limit, search }: ListMedicinesParams) => {
  const skip = (page - 1) * limit;
  const take = limit;

  // Dynamically build the 'where' clause for filtering
  const where: Prisma.MedicineWhereInput = search
    ? {
        OR: [
          { brandName: { contains: search, } },
          { genericName: { contains: search,  } },
          { manufacturer: { contains: search,  } },
        ],
      }
    : {};

  // Use a transaction to get both the paginated data and the total count
  const [medicines, totalCount] = await prisma.$transaction([
    prisma.medicine.findMany({
      where,
      skip,
      take,
      orderBy: { brandName: 'asc' },
    }),
    prisma.medicine.count({ where }),
  ]);

  return { data: medicines, totalCount };
};

export const getMedicineById = async (medicineId: string) => {
  const medicine = await prisma.medicine.findUnique({ where: { id: medicineId } });
  if (!medicine) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Medicine not found.');
  }
  return medicine;
};

export const updateMedicine = async (medicineId: string, input: UpdateMedicineInput) => {
  await getMedicineById(medicineId); // Ensure it exists
  return prisma.medicine.update({ where: { id: medicineId }, data: input });
};

export const deleteMedicine = async (medicineId: string) => {
  await getMedicineById(medicineId); // Ensure it exists
  await prisma.medicine.delete({ where: { id: medicineId } });
  return { message: 'Medicine deleted successfully.' };
};

// ====================================================================
// SECTION: BULK IMPORT LOGIC
// ====================================================================



const parseDataFile = (fileBuffer: Buffer, originalname: string): Promise<Record<string, any>[]> => {
  return new Promise((resolve, reject) => {
    const fileExtension = originalname.split('.').pop()?.toLowerCase();

    if (fileExtension === 'csv') {
      const results: Record<string, any>[] = [];
      Readable.from(fileBuffer)
        .pipe(csvParser())
        .on('data', (row) => results.push(row))
        .on('end', () => resolve(results))
        .on('error', (error) => reject(error));
    } else if (fileExtension === 'xlsx') {
      try {
        const workbook = xlsx.read(fileBuffer, { type: 'buffer' });

        // 1. Get the sheet name. Its type is correctly inferred as `string | undefined`.
        const sheetName = workbook.SheetNames[0];

        // 2. Add an explicit guard clause to check if the sheetName is valid.
        // This prevents using `undefined` as an index and resolves the first error.
        if (!sheetName) {
          return reject(new ApiError(StatusCodes.BAD_REQUEST, 'The uploaded Excel file contains no sheets.'));
        }
        
        // This line is now safe, but the result can still be undefined.
        const worksheet: WorkSheet | undefined = workbook.Sheets[sheetName];

        // 3. Add a second guard clause to ensure the worksheet object itself exists.
        // This resolves the "Argument of type 'WorkSheet | undefined' is not assignable" error.
        if (!worksheet) {
          return reject(new ApiError(StatusCodes.BAD_REQUEST, `Could not find a valid sheet named "${sheetName}" in the file.`));
        }
        
        // Now that `worksheet` is guaranteed to be a `WorkSheet`, this call is safe.
        // We still cast the result as its type is `unknown[]` by default.
        const data = xlsx.utils.sheet_to_json(worksheet) as Record<string, any>[];
        resolve(data);

      } catch (error) {
        reject(error);
      }
    } else {
      reject(new ApiError(StatusCodes.BAD_REQUEST, 'Unsupported file type. Please upload a CSV or XLSX file.'));
    }
  });
};


export const bulkImportMedicines = async (file: Express.Multer.File): Promise<{ message: string; created: number; updated: number; errors: any[] }> => {
  // --- Step 1 & 2: Parse and Validate (This part is already correct) ---
  const parsedRows = await parseDataFile(file.buffer, file.originalname);
  const validationErrors: { row: number; errors: string }[] = [];
  const validMeds: MedicineCsvRow[] = [];
  
  parsedRows.forEach((row, index) => {
    const result = medicineCsvRowSchema.safeParse(row);
    if (result.success) {
      validMeds.push(result.data);
    } else {
      const errorMessages = result.error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ');
      validationErrors.push({ row: index + 2, errors: errorMessages });
    }
  });
  
  if (validationErrors.length > 0) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      `File contains invalid data on ${validationErrors.length} row(s).`,
      true,
      JSON.stringify(validationErrors)
    );
  }

  // --- Step 3: Efficient Upsert Strategy ---
  // --- Deduplicate validMeds by brandName+manufacturer (keep the last occurrence) ---
const uniqueMedsMap = new Map<string, MedicineCsvRow>();
validMeds.forEach(med => {
  const key = `${med.brandName}::${med.manufacturer}`;
  uniqueMedsMap.set(key, med); // overwrites if duplicate
});
const uniqueValidMeds = Array.from(uniqueMedsMap.values());
  
  // Get all unique brandName/manufacturer pairs from the input file
  // Get all unique brandName/manufacturer pairs from the input file
const uniqueIdentifiers = uniqueValidMeds.map(med => ({
  brandName: med.brandName,
  manufacturer: med.manufacturer,
}));
  

  // Fetch all existing medicines that match our input in a SINGLE query
  const existingMedicines = await prisma.medicine.findMany({
    where: {
      OR: uniqueIdentifiers,
    },
  });

  // Create a map for quick lookups (O(1) access)
  const existingMedsMap = new Map(
    existingMedicines.map(med => [`${med.brandName}::${med.manufacturer}`, med])
  );
  
  const toCreate: MedicineCsvRow[] = [];
  const toUpdate: { id: string; data: Partial<MedicineCsvRow> }[] = [];

  // In memory, determine what to create and what to update
  for (const med of uniqueValidMeds) {               // ← was validMeds
  const key = `${med.brandName}::${med.manufacturer}`;
  const existing = existingMedsMap.get(key);

  if (existing) {
    if (existing.genericName !== med.genericName || Number(existing.price) !== med.price) {
      toUpdate.push({
        id: existing.id,
        data: { genericName: med.genericName, price: med.price },
      });
    }
  } else {
    toCreate.push(med);                             // ← now uses uniqueValidMeds
  }
}

  // --- Step 4: Execute bulk database operations ---

  await prisma.$transaction(async (tx) => {
    // 1. Bulk create all new medicines in a single query
    if (toCreate.length > 0) {
      await tx.medicine.createMany({
        data: toCreate,
        //skipDuplicates: true, // Safety measure
      });
    }

    // 2. Loop and update existing medicines
    // This part still loops, but the transaction is much shorter as there's no `find` query inside.
    for (const update of toUpdate) {
      await tx.medicine.update({
        where: { id: update.id },
        data: update.data,
      });
    }
  });

  return {
    message: 'Bulk import completed successfully.',
    created: toCreate.length,
    updated: toUpdate.length,
    errors: [],
  };
};
