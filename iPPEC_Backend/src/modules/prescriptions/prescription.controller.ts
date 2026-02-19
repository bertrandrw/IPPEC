import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { catchAsync } from '../../utils/catchAsync.js';
import * as prescriptionService from './prescription.service.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import { IAuthRequest } from '../../types/custom.d.js';
import { ApiError } from '../../utils/ApiError.js'
export const createPrescriptionController = catchAsync(async (req: IAuthRequest, res: Response) => {
  // req.user is guaranteed to exist by the authMiddleware
  const doctorUser = req.user!; 
  
  const newPrescription = await prescriptionService.createPrescription(doctorUser, req.body);
  
  res
    .status(StatusCodes.CREATED)
    .json(new ApiResponse(StatusCodes.CREATED, newPrescription, 'Prescription created successfully.'));
});

export const listMyPrescriptionsController = catchAsync(async (req: IAuthRequest, res: Response) => {
  const patientUser = req.user!;
  const prescriptions = await prescriptionService.listPrescriptionsForPatient(patientUser);
  res.status(StatusCodes.OK).json(new ApiResponse(StatusCodes.OK, prescriptions));
});

export const getMyPrescriptionByIdController = catchAsync(async (req: IAuthRequest, res: Response) => {
  const patientUser = req.user!;
  const { id } = req.params;

  if (!id) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Prescription ID is required.');
  }

  const prescription = await prescriptionService.getPrescriptionByIdForPatient(patientUser, id);
  res.status(StatusCodes.OK).json(new ApiResponse(StatusCodes.OK, prescription));
});

// --- PHARMACIST CONTROLLERS ---

export const getPrescriptionForFulfillmentController = catchAsync(async (req: IAuthRequest, res: Response) => {
  const { id } = req.params;
  if (!id) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Prescription ID is required.');
  }
  const prescription = await prescriptionService.getPrescriptionForFulfillment(id);
  res.status(StatusCodes.OK).json(new ApiResponse(StatusCodes.OK, prescription));
});

export const fulfillPrescriptionController = catchAsync(async (req: IAuthRequest, res: Response) => {
  const pharmacistUser = req.user!;
  const { id } = req.params;
  if (!id) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Prescription ID is required.');
  }
  const updatedPrescription = await prescriptionService.fulfillPrescription(pharmacistUser, id);
  res.status(StatusCodes.OK).json(new ApiResponse(StatusCodes.OK, updatedPrescription, 'Prescription fulfilled successfully.'));
});

export const listMyPrescriptionsForDoctorController = catchAsync(async (req: IAuthRequest, res: Response) => {
  const doctorUser = req.user!;
  const { page = 1, limit = 10 } = req.query as unknown as { page?: number; limit?: number };

  const result = await prescriptionService.listMyPrescriptionsForDoctor(doctorUser, page, limit);
  
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

export const listPatientPrescriptionsForDoctorController = catchAsync(async (req: IAuthRequest, res: Response) => {
  const { patientId } = req.params;
  if (!patientId) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Patient ID is required in the URL.');
  }

  const prescriptions = await prescriptionService.listPrescriptionsForPatientByDoctor(patientId);
  res.status(StatusCodes.OK).json(new ApiResponse(StatusCodes.OK, prescriptions));
});

export const getPrescriptionByIdController = catchAsync(async (req: IAuthRequest, res: Response) => {
  const user = req.user!;
  const { id } = req.params;

  if (!id) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Prescription ID is required.');
  }

  // Call the new, secure service function
  const prescription = await prescriptionService.getPrescriptionById(user, id);
  res.status(StatusCodes.OK).json(new ApiResponse(StatusCodes.OK, prescription));
});

export const updateMyPrescriptionController = catchAsync(async (req: IAuthRequest, res: Response) => {
  const doctorUser = req.user!;
  const { id } = req.params;

  if (!id) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Prescription ID is required.');
  }

  const updatedPrescription = await prescriptionService.updateMyPrescription(doctorUser, id, req.body);
  
  res.status(StatusCodes.OK).json(new ApiResponse(StatusCodes.OK, updatedPrescription, 'Prescription updated successfully.'));
});

/**
 * Handles the request to cancel an existing prescription.
 */
export const cancelMyPrescriptionController = catchAsync(async (req: IAuthRequest, res: Response) => {
  const doctorUser = req.user!;
  const { id } = req.params;

  if (!id) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Prescription ID is required.');
  }

  const cancelledPrescription = await prescriptionService.cancelMyPrescription(doctorUser, id);
  
  res.status(StatusCodes.OK).json(new ApiResponse(StatusCodes.OK, cancelledPrescription, 'Prescription has been cancelled.'));
});


export const findPharmaciesForPrescriptionController = catchAsync(async (req: IAuthRequest, res: Response) => {
  const patientUser = req.user!;
  const { prescriptionId } = req.params;
  const { latitude, longitude, radius, limit } = req.query as unknown as { latitude: number; longitude: number; radius: number; limit: number; };
  
  if (!prescriptionId) throw new ApiError(StatusCodes.BAD_REQUEST, 'Prescription ID is required.');

  const pharmacies = await prescriptionService.findPharmaciesForPrescription(patientUser, prescriptionId, { latitude, longitude, radius, limit });
  res.status(StatusCodes.OK).json(new ApiResponse(StatusCodes.OK, pharmacies));
});
