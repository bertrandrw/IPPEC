import { Request, Response } from 'express';
import multer from 'multer';
import { StatusCodes } from 'http-status-codes';
import { catchAsync } from '../../utils/catchAsync.js';
import * as medicineService from './medicine.service.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import { ApiError } from '../../utils/ApiError.js';

export const createMedicineController = catchAsync(async (req: Request, res: Response) => {
  const medicine = await medicineService.createMedicine(req.body);
  res.status(StatusCodes.CREATED).json(new ApiResponse(StatusCodes.CREATED, medicine, 'Medicine added successfully.'));
});

export const getAllMedicinesController = catchAsync(async (req: Request, res: Response) => {
  // The query params are validated and typed by our middleware
  const { page, limit, search } = req.query as unknown as { page: number; limit: number; search?: string; };

  const result = await medicineService.getAllMedicines({ page, limit, search });

  const { data, totalCount } = result;
  const totalPages = Math.ceil(totalCount / limit);
  const meta = {
    totalRecords: totalCount,
    currentPage: page,
    totalPages,
    limit,
  };

  res.status(StatusCodes.OK).json(new ApiResponse(StatusCodes.OK, { data, meta }));
});

// export const getAllMedicinesController = catchAsync(async (req: Request, res: Response) => {
//   const medicines = await medicineService.getAllMedicines();
//   res.status(StatusCodes.OK).json(new ApiResponse(StatusCodes.OK, medicines));
// });

export const getMedicineByIdController = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

    if (!id) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Medicine ID is required in URL parameters.');
  }

  const medicine = await medicineService.getMedicineById(id);
  res.status(StatusCodes.OK).json(new ApiResponse(StatusCodes.OK, medicine));
});

export const updateMedicineController = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Medicine ID is required in URL parameters.');
  }

  const updatedMedicine = await medicineService.updateMedicine(id, req.body);
  res.status(StatusCodes.OK).json(new ApiResponse(StatusCodes.OK, updatedMedicine, 'Medicine updated successfully.'));
});

export const deleteMedicineController = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

    if (!id) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Medicine ID is required in URL parameters.');
  }
  
  await medicineService.deleteMedicine(id);
  res.status(StatusCodes.OK).json(new ApiResponse(StatusCodes.OK, null, 'Medicine deleted successfully.'));
});

export const bulkImportController = catchAsync(async (req: Request, res: Response) => {
  if (!req.file) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'No CSV or XLSX file uploaded.');
  }
  const result = await medicineService.bulkImportMedicines(req.file);
  res.status(StatusCodes.OK).json(new ApiResponse(StatusCodes.OK, result, result.message));
});
