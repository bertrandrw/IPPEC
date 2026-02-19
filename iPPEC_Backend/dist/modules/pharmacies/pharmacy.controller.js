import { StatusCodes } from 'http-status-codes';
import { catchAsync } from '../../utils/catchAsync.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import * as pharmacyService from './pharmacy.service.js';
// export const getMyInventoryController = catchAsync(async (req: IAuthRequest, res: Response) => {
//   const pharmacistUser = req.user!;
//   const inventory = await pharmacyService.getInventoryForMyPharmacy(pharmacistUser);
//   res.status(StatusCodes.OK).json(new ApiResponse(StatusCodes.OK, inventory));
// });
export const getMyInventoryController = catchAsync(async (req, res) => {
    const pharmacistUser = req.user;
    // Get validated and coerced query params
    const { page, limit, search, sortBy } = req.query;
    const result = await pharmacyService.getInventoryForMyPharmacy(pharmacistUser, { page, limit, search, sortBy });
    // Format and send the paginated response
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
export const updateMyInventoryController = catchAsync(async (req, res) => {
    const pharmacistUser = req.user;
    const { items } = req.body;
    const result = await pharmacyService.updateInventoryForMyPharmacy(pharmacistUser, items);
    res.status(StatusCodes.OK).json(new ApiResponse(StatusCodes.OK, result));
});
export const searchPharmaciesController = catchAsync(async (req, res) => {
    const queryParams = req.query;
    const pharmacies = await pharmacyService.searchPharmaciesByLocation({
        medicineId: String(queryParams.medicineId),
        latitude: Number(queryParams.latitude),
        longitude: Number(queryParams.longitude),
        radius: Number(queryParams.radius),
        // Handle optional fields safely
        limit: queryParams.limit ? Number(queryParams.limit) : undefined,
        insuranceCompanyId: queryParams.insuranceCompanyId ? String(queryParams.insuranceCompanyId) : undefined,
    });
    res.status(StatusCodes.OK).json(new ApiResponse(StatusCodes.OK, pharmacies));
});
export const listAllPharmaciesController = catchAsync(async (req, res) => {
    const { page, limit, search } = req.query;
    const result = await pharmacyService.listAllPharmacies({ page, limit, search });
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
//# sourceMappingURL=pharmacy.controller.js.map