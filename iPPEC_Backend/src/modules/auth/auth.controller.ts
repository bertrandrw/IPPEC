import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { catchAsync } from '../../utils/catchAsync.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import * as authService from './auth.service.js';

export const signupController = catchAsync(async (req: Request, res: Response) => {
  const newUser = await authService.signup(req.body);
  res
    .status(StatusCodes.CREATED)
    .json(new ApiResponse(StatusCodes.CREATED, newUser, 'User registered successfully.'));
});

export const loginController = catchAsync(async (req: Request, res: Response) => {
  const result = await authService.login(req.body);
  res
    .status(StatusCodes.OK)
    .json(new ApiResponse(StatusCodes.OK, result, 'Login successful.'));
});