import { StatusCodes } from 'http-status-codes';
import { catchAsync } from '../../utils/catchAsync.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import * as patientService from './patient.service.js';
export const getMyProfileController = catchAsync(async (req, res) => {
    const patientUser = req.user;
    const profile = await patientService.getMyProfile(patientUser);
    res.status(StatusCodes.OK).json(new ApiResponse(StatusCodes.OK, profile, 'Profile fetched successfully.'));
});
//# sourceMappingURL=patient.controller.js.map