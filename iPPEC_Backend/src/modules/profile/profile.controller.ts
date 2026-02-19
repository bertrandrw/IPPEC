// src/modules/profile/profile.controller.ts

import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { IAuthRequest } from '../../types/custom.d.js';
import { catchAsync } from '../../utils/catchAsync.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import * as profileService from './profile.service.js';

export const getMyProfileController = catchAsync(async (req: IAuthRequest, res: Response) => {
  const userProfile = await profileService.getMyProfile(req.user!);
  res.status(StatusCodes.OK).json(new ApiResponse(StatusCodes.OK, userProfile, 'Profile fetched successfully.'));
});

export const updateMyProfileController = catchAsync(async (req: IAuthRequest, res: Response) => {
  const updatedProfile = await profileService.updateMyProfile(req.user!, req.body);
  res.status(StatusCodes.OK).json(new ApiResponse(StatusCodes.OK, updatedProfile, 'Profile updated successfully.'));
});
