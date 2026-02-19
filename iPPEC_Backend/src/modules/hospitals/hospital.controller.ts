import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { catchAsync } from '../../utils/catchAsync.js';
import * as hospitalService from './hospital.service.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import { ApiError } from '../../utils/ApiError.js';

export const listHospitalsController = catchAsync(async (req: Request, res: Response) => {
  const { page, limit, search } = req.query as unknown as { page: number; limit: number; search?: string; };
  const result = await hospitalService.listHospitals(page, limit, search);
  // ... (format paginated response)
  const { data, totalCount } = result;
  const totalPages = Math.ceil(totalCount / limit);
  const meta = { totalRecords: totalCount, currentPage: page, totalPages, limit };
  res.status(StatusCodes.OK).json(new ApiResponse(StatusCodes.OK, { data, meta }));
});

export const getHospitalByIdController = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) throw new ApiError(StatusCodes.BAD_REQUEST, 'Hospital ID is required.');
  const hospital = await hospitalService.getHospitalById(id);
  res.status(StatusCodes.OK).json(new ApiResponse(StatusCodes.OK, hospital));
});

export const updateHospitalController = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) throw new ApiError(StatusCodes.BAD_REQUEST, 'Hospital ID is required.');
  const updatedHospital = await hospitalService.updateHospital(id, req.body);
  res.status(StatusCodes.OK).json(new ApiResponse(StatusCodes.OK, updatedHospital, 'Hospital updated.'));
});

export const deleteHospitalController = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) throw new ApiError(StatusCodes.BAD_REQUEST, 'Hospital ID is required.');
  const result = await hospitalService.deleteHospital(id);
  res.status(StatusCodes.OK).json(new ApiResponse(StatusCodes.OK, result));
});

















// import { Response } from 'express';
// import { StatusCodes } from 'http-status-codes';
// import { IAuthRequest } from '../../types/custom.d.js';
// import { catchAsync } from '../../utils/catchAsync.js';
// import { ApiResponse } from '../../utils/ApiResponse.js';
// import * as hospitalService from './hospital.service.js';


// // --- ADD THE NEW LIST CONTROLLER ---
// export const listHospitalsController = catchAsync(async (req: IAuthRequest, res: Response) => {
//   // The query params are already validated and typed by our middleware
//   const { page, limit, search } = req.query as unknown as { page: number; limit: number; search?: string; };

//   const result = await hospitalService.listHospitals({ page, limit, search });

//   const { data, totalCount } = result;
//   const totalPages = Math.ceil(totalCount / limit);
//   const meta = {
//     totalRecords: totalCount,
//     currentPage: page,
//     totalPages,
//     limit,
//   };

//   res.status(StatusCodes.OK).json(new ApiResponse(StatusCodes.OK, { data, meta }));
// });