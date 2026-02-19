// src/modules/patients/patient.service.ts
import { StatusCodes } from 'http-status-codes';
import { prisma } from '../../config/index.js';
import { ApiError } from '../../utils/ApiError.js';
export const getMyProfile = async (patientUser) => {
    const profile = await prisma.patientProfile.findUnique({
        where: { userId: patientUser.id },
        include: {
            // We can include other related data here in the future, like insurance
            insuranceCompany: true,
        },
    });
    if (!profile) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'Patient profile not found for the logged-in user.');
    }
    return profile;
};
//# sourceMappingURL=patient.service.js.map