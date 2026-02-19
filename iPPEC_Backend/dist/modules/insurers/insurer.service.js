import { StatusCodes } from 'http-status-codes';
import { prisma } from '../../config/index.js';
import { ApiError } from '../../utils/ApiError.js';
/**
 * Helper function to get the Insurer's profile and associated company ID.
 * This is a critical security and data-scoping function.
 */
const getInsurerCompanyId = async (insurerUser) => {
    const insurerProfile = await prisma.insurerProfile.findUnique({
        where: { userId: insurerUser.id },
    });
    if (!insurerProfile) {
        throw new ApiError(StatusCodes.FORBIDDEN, 'User does not have a valid insurer profile.');
    }
    return insurerProfile.insuranceCompanyId;
};
/**
 * Lists all claim reports submitted to the logged-in insurer's company.
 */
export const listCompanyClaims = async (insurerUser, { page, limit, pharmacyId }) => {
    const companyId = await getInsurerCompanyId(insurerUser);
    const skip = (page - 1) * limit;
    // 1. Dynamically build the 'where' clause for filtering
    const where = {
        insuranceCompanyId: companyId,
        // Add the pharmacyId to the filter if it was provided
        ...(pharmacyId && { pharmacyId: pharmacyId }),
    };
    // 2. Use a transaction to get both the paginated data and the total count
    const [claims, totalCount] = await prisma.$transaction([
        prisma.claimReport.findMany({
            where,
            skip,
            take: limit,
            orderBy: { createdAt: 'desc' },
            include: {
                pharmacy: { select: { name: true } },
                _count: { select: { claimItems: true } } // Count of prescriptions in the report
            },
        }),
        prisma.claimReport.count({ where }),
    ]);
    return { data: claims, totalCount };
};
// export const listCompanyClaims = async (insurerUser: User) => {
//   const companyId = await getInsurerCompanyId(insurerUser);
//   return prisma.claimReport.findMany({
//     where: { insuranceCompanyId: companyId },
//     orderBy: { createdAt: 'desc' },
//     include: {
//       pharmacy: { select: { name: true } },
//     },
//   });
// };
/**
 * Gets the full details of a single claim report, including all prescriptions,
 * ensuring it belongs to the insurer's company.
 */
export const getClaimDetails = async (insurerUser, claimId) => {
    const companyId = await getInsurerCompanyId(insurerUser);
    const claimReport = await prisma.claimReport.findFirst({
        where: {
            id: claimId,
            insuranceCompanyId: companyId, // Security check
        },
        // --- THIS IS THE CORRECTED INCLUDE BLOCK ---
        include: {
            pharmacy: { select: { name: true, address: true } },
            // 1. Include the list of claim items
            claimItems: {
                // 2. For each claim item, include its related prescription
                include: {
                    prescription: {
                        // 3. For each prescription, include all the details you need
                        include: {
                            patient: { select: { fullName: true, insurancePolicyNumber: true } },
                            doctor: { select: { fullName: true, specialty: true } },
                            medicines: { include: { medicine: true } },
                        },
                    },
                },
            },
        },
    });
    // --- END OF CORRECTION ---
    if (!claimReport) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'Claim report not found or you do not have permission to view it.');
    }
    return claimReport;
};
// export const getClaimDetails = async (insurerUser: User, claimId: string) => {
//   const companyId = await getInsurerCompanyId(insurerUser);
//   const claimReport = await prisma.claimReport.findFirst({
//     where: { id: claimId, insuranceCompanyId: companyId },
//     include: {
//       pharmacy: true,
//       prescriptions: {
//         include: {
//           patient: { select: { fullName: true, insurancePolicyNumber: true } },
//           medicines: { include: { medicine: true } },
//           doctor: { select: { fullName: true } },
//         },
//       },
//     },
//   });
//   if (!claimReport) {
//     throw new ApiError(StatusCodes.NOT_FOUND, 'Claim report not found or you do not have permission to view it.');
//   }
//   return claimReport;
// };
/**
 * Updates the status of a claim report after verifying ownership.
 */
export const updateClaimStatus = async (insurerUser, claimId, input) => {
    const companyId = await getInsurerCompanyId(insurerUser);
    const claimToUpdate = await prisma.claimReport.findFirst({
        where: { id: claimId, insuranceCompanyId: companyId },
    });
    if (!claimToUpdate) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'Claim report not found or you do not have permission to update it.');
    }
    return prisma.claimReport.update({
        where: { id: claimId },
        data: { status: input.status },
    });
};
/**
 * Retrieves a paginated list of all pharmacies that have an agreement
 * with the logged-in insurer's company.
 */
export const listNetworkPharmacies = async (insurerUser, { page, limit }) => {
    const companyId = await getInsurerCompanyId(insurerUser);
    const skip = (page - 1) * limit;
    const [agreements, totalCount] = await prisma.$transaction([
        prisma.insuranceAcceptance.findMany({
            where: { insuranceCompanyId: companyId },
            skip,
            take: limit,
            orderBy: { pharmacy: { name: 'asc' } },
            include: { pharmacy: true },
        }),
        prisma.insuranceAcceptance.count({ where: { insuranceCompanyId: companyId } }),
    ]);
    // --- FIX 1: Explicitly type the parameter in the map function ---
    const data = agreements.map((agreement) => ({
        ...agreement.pharmacy
    }));
    return { data, totalCount };
};
/**
 * Creates a new InsuranceAcceptance record, adding a pharmacy to the
 * logged-in insurer's company network.
 * @param insurerUser The authenticated insurer user.
 * @param input Contains the pharmacyId to add.
 * @returns The newly created agreement record.
 */
export const addPharmacyToNetwork = async (insurerUser, input) => {
    const companyId = await getInsurerCompanyId(insurerUser);
    const { pharmacyId } = input;
    // Good practice: verify the pharmacy exists before creating a link.
    const pharmacy = await prisma.pharmacy.findUnique({ where: { id: pharmacyId } });
    if (!pharmacy) {
        throw new ApiError(StatusCodes.NOT_FOUND, `Pharmacy with ID ${pharmacyId} not found.`);
    }
    // The unique constraint in the schema will prevent creating a duplicate agreement.
    // Prisma will throw a catchable P2002 error if an agreement already exists.
    return prisma.insuranceAcceptance.create({
        data: {
            pharmacyId,
            insuranceCompanyId: companyId, // Scoped to the insurer's own company
        },
        include: {
            // Return useful data in the response
            pharmacy: { select: { name: true, address: true } },
            insuranceCompany: { select: { name: true } }
        },
    });
};
/**
 * Deletes an InsuranceAcceptance record, removing a pharmacy from the
 * logged-in insurer's company network.
 * @param insurerUser The authenticated insurer user.
 * @param pharmacyId The ID of the pharmacy to remove from the network.
 * @returns A confirmation message.
 */
export const removePharmacyFromNetwork = async (insurerUser, pharmacyId) => {
    const companyId = await getInsurerCompanyId(insurerUser);
    // Use the composite unique key to delete the specific agreement.
    // This implicitly verifies that the agreement belongs to the insurer's company.
    try {
        await prisma.insuranceAcceptance.delete({
            where: {
                pharmacyId_insuranceCompanyId: {
                    pharmacyId,
                    insuranceCompanyId: companyId,
                },
            },
        });
    }
    catch (error) {
        // If Prisma's delete fails because the record is not found (P2025), throw a clearer error.
        if (error.code === 'P2025') {
            throw new ApiError(StatusCodes.NOT_FOUND, 'Agreement with this pharmacy was not found for your company.');
        }
        // Re-throw other unexpected errors
        throw error;
    }
    return { message: 'The agreement with the pharmacy has been successfully terminated.' };
};
export const adjudicateClaimItem = async (insurerUser, claimItemId, input) => {
    const companyId = await getInsurerCompanyId(insurerUser);
    // Deeply nested query to ensure the insurer owns the report this item belongs to
    const item = await prisma.claimItem.findFirst({
        where: {
            id: claimItemId,
            claimReport: {
                insuranceCompanyId: companyId,
            },
        },
    });
    if (!item) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'Claim item not found or you do not have permission to modify it.');
    }
    return prisma.claimItem.update({
        where: { id: claimItemId },
        data: {
            status: input.status,
            // Only set the rejection reason if the status is REJECTED
            rejectionReason: input.status === 'REJECTED' ? input.rejectionReason : null,
        },
    });
};
export const addPatientToCoverage = async (insurerUser, input) => {
    const companyId = await getInsurerCompanyId(insurerUser);
    const { patientProfileId, insurancePolicyNumber, coveragePercentage } = input;
    // 1. Verify the patient profile exists
    const patientProfile = await prisma.patientProfile.findUnique({
        where: { id: patientProfileId },
    });
    if (!patientProfile) {
        throw new ApiError(StatusCodes.NOT_FOUND, `Patient profile with ID ${patientProfileId} not found.`);
    }
    // 2. Check if the patient is already covered by another company
    if (patientProfile.insuranceCompanyId && patientProfile.insuranceCompanyId !== companyId) {
        throw new ApiError(StatusCodes.CONFLICT, 'This patient is already covered by another insurance company.');
    }
    // 3. Update the patient's profile to link them to this insurer's company
    return prisma.patientProfile.update({
        where: { id: patientProfileId },
        data: {
            insuranceCompanyId: companyId,
            insurancePolicyNumber,
            coveragePercentage,
        },
        include: { insuranceCompany: true },
    });
};
export const removePatientFromCoverage = async (insurerUser, patientProfileId) => {
    const companyId = await getInsurerCompanyId(insurerUser);
    // 1. Find the patient and verify they are covered by this insurer's company
    const patientProfile = await prisma.patientProfile.findFirst({
        where: {
            id: patientProfileId,
            insuranceCompanyId: companyId,
        },
    });
    if (!patientProfile) {
        throw new ApiError(StatusCodes.NOT_FOUND, `Patient not found in your company's coverage list.`);
    }
    // 2. Remove the coverage by setting the insurance fields to null
    return prisma.patientProfile.update({
        where: { id: patientProfileId },
        data: {
            insuranceCompanyId: null,
            insurancePolicyNumber: null,
            coveragePercentage: null,
        },
    });
};
// export const adjudicateClaimItem = async (insurerUser: User, claimItemId: string, input: AdjudicateInput) => {
//   const companyId = await getInsurerCompanyId(insurerUser);
//   // Deeply nested query to ensure the insurer owns the report this item belongs to
//   const item = await prisma.claimItem.findFirst({
//     where: {
//       id: claimItemId,
//       claimReport: {
//         insuranceCompanyId: companyId,
//       },
//     },
//   });
//   if (!item) {
//     throw new ApiError(StatusCodes.NOT_FOUND, 'Claim item not found or you do not have permission to modify it.');
//   }
//   return prisma.claimItem.update({
//     where: { id: claimItemId },
//     data: {
//       status: input.status,
//       rejectionReason: input.status === 'REJECTED' ? input.rejectionReason : null,
//     },
//   });
// };
//# sourceMappingURL=insurer.service.js.map