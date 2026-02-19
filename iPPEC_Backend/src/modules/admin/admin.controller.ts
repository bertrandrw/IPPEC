import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import * as adminService from './admin.service.js';
import { ApiError } from '../../utils/ApiError.js';
import { catchAsync } from '../../utils/catchAsync.js';
import { ApiResponse } from '../../utils/ApiResponse.js';

// User & Institution Controllers
export const listPendingUsersController = catchAsync(async (req: Request, res: Response) => {
  const users = await adminService.listPendingUsers();
  res.status(StatusCodes.OK).json(new ApiResponse(StatusCodes.OK, users));
});

export const approveUserController = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'User ID is required in the URL parameters.');
  }
  await adminService.approveUser(id);
  res.status(StatusCodes.OK).json(new ApiResponse(StatusCodes.OK, null, 'User approved successfully.'));
});

export const createHospitalController = catchAsync(async (req: Request, res: Response) => {
  const hospital = await adminService.createHospital(req.body);
  res.status(StatusCodes.CREATED).json(new ApiResponse(StatusCodes.CREATED, hospital, 'Hospital created.'));
});

export const createPharmacyController = catchAsync(async (req: Request, res: Response) => {
  const pharmacy = await adminService.createPharmacy(req.body);
  res.status(StatusCodes.CREATED).json(new ApiResponse(StatusCodes.CREATED, pharmacy, 'Pharmacy created.'));
});

export const createDoctorController = catchAsync(async (req: Request, res: Response) => {
  const { user, profile } = await adminService.createDoctor(req.body);
  const { password, ...userWithoutPassword } = user;
  res.status(StatusCodes.CREATED).json(new ApiResponse(StatusCodes.CREATED, { user: userWithoutPassword, profile }, 'Doctor created successfully.'));
});


// Master Data Controllers
export const createMedicineController = catchAsync(async (req: Request, res: Response) => {
  const medicine = await adminService.createMedicine(req.body);
  res.status(StatusCodes.CREATED).json(new ApiResponse(StatusCodes.CREATED, medicine, 'Medicine added.'));
});

export const listAllMedicinesController = catchAsync(async (req: Request, res: Response) => {
  const medicines = await adminService.listAllMedicines();
  res.status(StatusCodes.OK).json(new ApiResponse(StatusCodes.OK, medicines));
});

export const createInsurerController = catchAsync(async (req: Request, res: Response) => {
  const result = await adminService.createInsurer(req.body);
  res.status(StatusCodes.CREATED).json(new ApiResponse(StatusCodes.CREATED, result, 'Insurer user created successfully.'));
});
