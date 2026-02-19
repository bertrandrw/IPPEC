// src/modules/users/user.service.ts
import { prisma } from '../../config/index.js';
// Helper function to handle pagination logic
const getPagination = (page, limit) => {
    const skip = (page - 1) * limit;
    const take = limit;
    return { skip, take };
};
// 1. Get ALL Users (Simple List)
export const listAllUsers = async ({ page, limit }) => {
    const { skip, take } = getPagination(page, limit);
    const [users, totalCount] = await prisma.$transaction([
        prisma.user.findMany({
            skip,
            take,
            select: {
                id: true,
                email: true,
                phone: true,
                role: true,
                isVerified: true,
                createdAt: true,
            },
            orderBy: { createdAt: 'desc' },
        }),
        prisma.user.count(),
    ]);
    return { data: users, totalCount };
};
// Generic function to fetch users by role with their profile
const listUsersByRole = async (role, { page, limit }) => {
    const { skip, take } = getPagination(page, limit);
    // Define what profile to include based on the role
    const includeProfile = {
        [role.toLowerCase() + 'Profile']: true,
    };
    const [users, totalCount] = await prisma.$transaction([
        prisma.user.findMany({
            where: { role },
            skip,
            take,
            select: {
                id: true,
                email: true,
                phone: true,
                role: true,
                isVerified: true,
                createdAt: true,
                // Dynamically include the correct profile
                ...includeProfile,
            },
            orderBy: { createdAt: 'desc' },
        }),
        prisma.user.count({ where: { role } }),
    ]);
    return { data: users, totalCount };
};
// 2. Get ALL Doctors (with Profiles)
export const listDoctors = (params) => listUsersByRole('DOCTOR', params);
// 3. Get ALL Pharmacists (with Profiles)
export const listPharmacists = (params) => listUsersByRole('PHARMACIST', params);
// 4. Get ALL Patients (with Profiles)
export const listPatients = (params) => listUsersByRole('PATIENT', params);
// 5. Get ALL Insurers (with Profiles)
export const listInsurers = (params) => listUsersByRole('INSURER', params);
//# sourceMappingURL=user.service.js.map