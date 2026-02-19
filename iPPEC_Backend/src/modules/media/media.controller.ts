// src/modules/media/media.controller.ts
import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { IAuthRequest } from '../../types/custom.d.js';
import { catchAsync } from '../../utils/catchAsync.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import { ApiError } from '../../utils/ApiError.js';

export const uploadImageController = catchAsync(async (req: IAuthRequest, res: Response) => {
  if (!req.file) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'No image file uploaded.');
  }

  // The cloudinaryStorage middleware has already uploaded the file.
  // The URL and other data are available in req.file.path (which is the URL) and other properties.
  const imageUrl = req.file.path;

  res.status(StatusCodes.OK).json(new ApiResponse(StatusCodes.OK, { url: imageUrl }, 'Image uploaded successfully.'));
});
