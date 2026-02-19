import { StatusCodes } from 'http-status-codes';
import { catchAsync } from '../../utils/catchAsync.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import * as insurerService from './insurer.service.js';
import { ApiError } from '../../utils/ApiError.js';
import { prisma } from '../../config/index.js';
// export const listCompanyClaimsController = catchAsync(async (req: IAuthRequest, res: Response) => {
//   const insurerUser = req.user!;
//   const claims = await insurerService.listCompanyClaims(insurerUser);
//   res.status(StatusCodes.OK).json(new ApiResponse(StatusCodes.OK, claims));
// });
export const listCompanyClaimsController = catchAsync(async (req, res) => {
    const insurerUser = req.user;
    // Get validated and coerced query params
    const { page, limit, pharmacyId } = req.query;
    const result = await insurerService.listCompanyClaims(insurerUser, { page, limit, pharmacyId });
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
export const getClaimDetailsController = catchAsync(async (req, res) => {
    const insurerUser = req.user;
    const { id } = req.params;
    if (!id)
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Claim ID is required.');
    const claim = await insurerService.getClaimDetails(insurerUser, id);
    res.status(StatusCodes.OK).json(new ApiResponse(StatusCodes.OK, claim));
});
export const updateClaimStatusController = catchAsync(async (req, res) => {
    const insurerUser = req.user;
    const { id } = req.params;
    if (!id)
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Claim ID is required.');
    const updatedClaim = await insurerService.updateClaimStatus(insurerUser, id, req.body);
    res.status(StatusCodes.OK).json(new ApiResponse(StatusCodes.OK, updatedClaim, 'Claim status updated.'));
});
export const listNetworkPharmaciesController = catchAsync(async (req, res) => {
    const insurerUser = req.user;
    const { page, limit } = req.query;
    const result = await insurerService.listNetworkPharmacies(insurerUser, { page, limit });
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
export const addPharmacyToNetworkController = catchAsync(async (req, res) => {
    const insurerUser = req.user;
    const agreement = await insurerService.addPharmacyToNetwork(insurerUser, req.body);
    res.status(StatusCodes.CREATED).json(new ApiResponse(StatusCodes.CREATED, agreement, 'Pharmacy added to network successfully.'));
});
export const removePharmacyFromNetworkController = catchAsync(async (req, res) => {
    const insurerUser = req.user;
    const { pharmacyId } = req.params;
    if (!pharmacyId)
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Pharmacy ID is required.');
    const result = await insurerService.removePharmacyFromNetwork(insurerUser, pharmacyId);
    res.status(StatusCodes.OK).json(new ApiResponse(StatusCodes.OK, result));
});
export const adjudicateClaimItemController = catchAsync(async (req, res) => {
    const insurerUser = req.user;
    const { itemId } = req.params; // Get the ClaimItem ID from the URL
    if (!itemId) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Claim item ID is required.');
    }
    const updatedItem = await insurerService.adjudicateClaimItem(insurerUser, itemId, req.body);
    res.status(StatusCodes.OK).json(new ApiResponse(StatusCodes.OK, updatedItem, 'Claim item status updated successfully.'));
});
export const addPatientToCoverageController = catchAsync(async (req, res) => {
    const insurerUser = req.user;
    const updatedProfile = await insurerService.addPatientToCoverage(insurerUser, req.body);
    res.status(StatusCodes.OK).json(new ApiResponse(StatusCodes.OK, updatedProfile, "Patient added to coverage successfully."));
});
export const removePatientFromCoverageController = catchAsync(async (req, res) => {
    const insurerUser = req.user;
    const { patientProfileId } = req.params;
    // --- THIS IS THE FIX ---
    // Add a guard clause to ensure the patientProfileId is a valid string.
    if (!patientProfileId) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Patient Profile ID is required in the URL parameters.');
    }
    // Now TypeScript knows that 'patientProfileId' is a string, so this call is safe.
    await insurerService.removePatientFromCoverage(insurerUser, patientProfileId);
    res.status(StatusCodes.OK).json(new ApiResponse(StatusCodes.OK, null, "Patient removed from coverage successfully."));
});
export const findPatientByNid = async (nid) => {
    // Use `findFirst` which is often safer for queries on non-primary-key unique fields.
    const patientProfile = await prisma.patientProfile.findFirst({
        where: { nid: nid },
        // --- THIS IS THE CRITICAL FIX ---
        // We are selecting ONLY scalar fields (String, DateTime, Float, etc.).
        // We are NOT selecting any relations (like `insuranceCompany`).
        // This query cannot possibly cause a circular reference.
        select: {
            id: true,
            fullName: true,
            dateOfBirth: true,
            sex: true,
            insuranceCompanyId: true, // Select the ID string
            insurancePolicyNumber: true, // Select the policy number string
        },
    });
    if (!patientProfile) {
        throw new ApiError(StatusCodes.NOT_FOUND, `No patient found with the provided NID.`);
    }
    // The frontend can now check if `patientProfile.insuranceCompanyId` is null or not.
    // If it's not null, the frontend can make a separate, simple call to get the company name if needed.
    // This pattern (separating queries) is a robust way to avoid complex join issues.
    return patientProfile;
};
/**
 * Finds a patient by their National ID (NID).
 * Intended for use by insurers to locate a patient before adding them to a coverage plan.
 * Returns only non-sensitive confirmation data.
 * @param nid The National ID to search for.
 */
// export const findPatientByNid = async (nid: string) => {
//   const patientProfile = await prisma.patientProfile.findUnique({
//     where: { nid: nid },
//     select: {
//       // Return only the data needed for confirmation
//       id: true,
//       fullName: true,
//       dateOfBirth: true,
//       sex: true,
//       // Also indicate if they are already covered
//       insuranceCompany: {
//         select: {
//           name: true,
//         },
//       },
//     },
//   });
//   if (!patientProfile) {
//     throw new ApiError(StatusCodes.NOT_FOUND, `No patient found with the provided NID.`);
//   }
//   return patientProfile;
// };
//# sourceMappingURL=insurer.controller.js.map