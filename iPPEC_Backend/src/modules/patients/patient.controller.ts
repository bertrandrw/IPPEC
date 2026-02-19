import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { IAuthRequest } from '../../types/custom.d.js';
import { catchAsync } from '../../utils/catchAsync.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import * as patientService from './patient.service.js';

export const getMyProfileController = catchAsync(async (req: IAuthRequest, res: Response) => {
  const patientUser = req.user!;
  const profile = await patientService.getMyProfile(patientUser);
  res.status(StatusCodes.OK).json(new ApiResponse(StatusCodes.OK, profile, 'Profile fetched successfully.'));
});
