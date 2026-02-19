import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { catchAsync } from '../../utils/catchAsync.js';
import * as pharmacistService from './pharmacist.service.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import { ApiError } from '../../utils/ApiError.js';

export const createPharmacistController = catchAsync(async (req: Request, res: Response) => {
  const result = await pharmacistService.createPharmacist(req.body);
  res.status(StatusCodes.CREATED).json(new ApiResponse(StatusCodes.CREATED, result, 'Pharmacist created successfully.'));
});

export const getPharmacistByIdController = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) throw new ApiError(StatusCodes.BAD_REQUEST, 'Pharmacist ID is required.');
  const pharmacist = await pharmacistService.getPharmacistById(id);
  res.status(StatusCodes.OK).json(new ApiResponse(StatusCodes.OK, pharmacist));
});

export const updatePharmacistController = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) throw new ApiError(StatusCodes.BAD_REQUEST, 'Pharmacist ID is required.');
  const updatedPharmacist = await pharmacistService.updatePharmacist(id, req.body);
  res.status(StatusCodes.OK).json(new ApiResponse(StatusCodes.OK, updatedPharmacist, 'Pharmacist updated successfully.'));
});

export const deletePharmacistController = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) throw new ApiError(StatusCodes.BAD_REQUEST, 'Pharmacist ID is required.');
  const result = await pharmacistService.deletePharmacist(id);
  res.status(StatusCodes.OK).json(new ApiResponse(StatusCodes.OK, result));
});
