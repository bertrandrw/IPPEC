import { StatusCodes } from 'http-status-codes';
import { catchAsync } from '../../utils/catchAsync.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import * as userService from './user.service.js';
// Helper to format the paginated response
const paginatedResponse = (res, result, page, limit) => {
    const { data, totalCount } = result;
    const totalPages = Math.ceil(totalCount / limit);
    const meta = {
        totalRecords: totalCount,
        currentPage: page,
        totalPages,
        limit,
    };
    res.status(StatusCodes.OK).json(new ApiResponse(StatusCodes.OK, { data, meta }));
};
// --- THIS IS THE FIX ---
// A generic controller factory to avoid code duplication
const createListController = (serviceFunction) => {
    return catchAsync(async (req, res) => {
        // req.query is now guaranteed by the middleware to have number properties
        const page = req.query.page;
        const limit = req.query.limit;
        const result = await serviceFunction({ page, limit });
        paginatedResponse(res, result, page, limit);
    });
};
// Use the factory to create each controller
export const listAllUsersController = createListController(userService.listAllUsers);
export const listDoctorsController = createListController(userService.listDoctors);
export const listPharmacistsController = createListController(userService.listPharmacists);
export const listPatientsController = createListController(userService.listPatients);
export const listInsurersController = createListController(userService.listInsurers);
// // src/modules/users/user.controller.ts
// import { Response } from 'express';
// import { StatusCodes } from 'http-status-codes';
// import { IAuthRequest } from '../../types/custom.d.js';
// import { catchAsync } from '../../utils/catchAsync.js';
// import { ApiResponse } from '../../utils/ApiResponse.js';
// import * as userService from './user.service.js';
// // Helper to format the paginated response
// const paginatedResponse = (res: Response, result: { data: any[], totalCount: number }, page: number, limit: number) => {
//   const { data, totalCount } = result;
//   const totalPages = Math.ceil(totalCount / limit);
//   const meta = {
//     totalRecords: totalCount,
//     currentPage: page,
//     totalPages,
//     limit,
//   };
//   res.status(StatusCodes.OK).json(new ApiResponse(StatusCodes.OK, { data, meta }));
// };
// // Controller for the simple list of all users
// export const listAllUsersController = catchAsync(async (req: IAuthRequest, res: Response) => {
//   const { page, limit } = req.query as unknown as { page: number; limit: number; };
//   const result = await userService.listAllUsers({ page, limit });
//   paginatedResponse(res, result, page, limit);
// });
// // Controller for doctors with profiles
// export const listDoctorsController = catchAsync(async (req: IAuthRequest, res: Response) => {
//   const { page, limit } = req.query as unknown as { page: number; limit: number; };
//   const result = await userService.listDoctors({ page, limit });
//   paginatedResponse(res, result, page, limit);
// });
// // Controller for pharmacists with profiles
// export const listPharmacistsController = catchAsync(async (req: IAuthRequest, res: Response) => {
//   const { page, limit } = req.query as unknown as { page: number; limit: number; };
//   const result = await userService.listPharmacists({ page, limit });
//   paginatedResponse(res, result, page, limit);
// });
// // Controller for patients with profiles
// export const listPatientsController = catchAsync(async (req: IAuthRequest, res: Response) => {
//   const { page, limit } = req.query as unknown as { page: number; limit: number; };
//   const result = await userService.listPatients({ page, limit });
//   paginatedResponse(res, result, page, limit);
// });
// // Controller for insurers with profiles
// export const listInsurersController = catchAsync(async (req: IAuthRequest, res: Response) => {
//   const { page, limit } = req.query as unknown as { page: number; limit: number; };
//   const result = await userService.listInsurers({ page, limit });
//   paginatedResponse(res, result, page, limit);
// });
//# sourceMappingURL=user.controller.js.map