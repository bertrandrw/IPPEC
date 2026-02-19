import { StatusCodes } from 'http-status-codes';
import { prisma } from '../../config/index.js';
import { ApiError } from '../../utils/ApiError.js';
// --- READ (List All with Filtering) ---
export const listHospitals = async (page, limit, search) => {
    const skip = (page - 1) * limit;
    const where = search
        ? { OR: [{ name: { contains: search, mode: 'insensitive' } }, { address: { contains: search, mode: 'insensitive' } }] }
        : {};
    const [hospitals, totalCount] = await prisma.$transaction([
        prisma.hospital.findMany({ where, skip, take: limit, orderBy: { name: 'asc' } }),
        prisma.hospital.count({ where }),
    ]);
    return { data: hospitals, totalCount };
};
// --- READ (Get One by ID) ---
export const getHospitalById = async (hospitalId) => {
    const hospital = await prisma.hospital.findUnique({
        where: { id: hospitalId },
        include: { _count: { select: { doctors: true } } },
    });
    if (!hospital) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'Hospital not found.');
    }
    return hospital;
};
// --- UPDATE ---
export const updateHospital = async (hospitalId, data) => {
    await getHospitalById(hospitalId);
    return prisma.hospital.update({ where: { id: hospitalId }, data });
};
// --- DELETE ---
export const deleteHospital = async (hospitalId) => {
    await getHospitalById(hospitalId);
    await prisma.hospital.delete({ where: { id: hospitalId } });
    return { message: 'Hospital has been permanently deleted.' };
};
// import { Prisma } from '@prisma/client';
// import { prisma } from '../../config/index.js';
// interface ListHospitalsParams {
//   page: number;
//   limit: number;
//   search?: string;
// }
// // --- ADD THE NEW LIST FUNCTION ---
// export const listHospitals = async ({ page, limit, search }: ListHospitalsParams) => {
//   const skip = (page - 1) * limit;
//   const take = limit;
//   // Dynamically build the 'where' clause for filtering
//   const where: Prisma.HospitalWhereInput = search
//     ? {
//         OR: [
//           { name: { contains: search, mode: 'insensitive' } },
//           { address: { contains: search, mode: 'insensitive' } },
//         ],
//       }
//     : {}; // If no search term, the where clause is empty
//   // Use a transaction to get both the data and the total count efficiently
//   const [hospitals, totalCount] = await prisma.$transaction([
//     prisma.hospital.findMany({
//       where,
//       skip,
//       take,
//       orderBy: { name: 'asc' },
//     }),
//     prisma.hospital.count({ where }),
//   ]);
//   return { data: hospitals, totalCount };
// };
//# sourceMappingURL=hospital.service.js.map