import { StatusCodes } from 'http-status-codes';
import { prisma } from '../../config/index.js';
import { ApiError } from '../../utils/ApiError.js';
import { calculateDistance, calculateSimpleBoundingBox } from '../../utils/geolocation.js';
/**
 * Helper function to get the profile and associated pharmacy ID for a pharmacist user.
 * @param pharmacistUser The authenticated user object with the 'PHARMACIST' role.
 * @returns The CUID of the pharmacy the user belongs to.
 */
const getPharmacistPharmacyId = async (pharmacistUser) => {
    const pharmacistProfile = await prisma.pharmacistProfile.findUnique({
        where: { userId: pharmacistUser.id },
    });
    if (!pharmacistProfile) {
        throw new ApiError(StatusCodes.FORBIDDEN, 'User does not have a valid pharmacist profile.');
    }
    return pharmacistProfile.pharmacyId;
};
/**
 * Fetches the full inventory for the logged-in pharmacist's pharmacy.
 * It returns all medicines from the master list, annotated with the stock status for their specific pharmacy.
 */
export const getInventoryForMyPharmacy = async (pharmacistUser, { page, limit, search, sortBy }) => {
    const pharmacyId = await getPharmacistPharmacyId(pharmacistUser);
    const skip = (page - 1) * limit;
    // 1. Build the search filter for the Medicine model
    const where = search
        ? {
            OR: [
                { brandName: { contains: search, mode: 'insensitive' } },
                { genericName: { contains: search, mode: 'insensitive' } },
            ],
        }
        : {};
    // 2. Build the dynamic sorting logic
    let orderBy = [];
    // Default sorting: IN_STOCK/LOW_STOCK first, then by name
    // This is a bit complex in Prisma. We need to sort on a related table's field.
    // The most reliable way is to sort by the presence of a matching relation.
    orderBy.push({
        inventory: {
            _count: 'desc', // Medicines with an inventory record for this pharmacy come first
        },
    });
    // Add user-specified sorting if provided
    if (sortBy) {
        const [field, direction] = sortBy.split('_');
        if (field === 'brandName') {
            orderBy.push({ brandName: direction });
        }
        // Note: Direct sorting by stockStatus is complex because it's a related field.
        // The default sort handles the primary use case.
    }
    else {
        // If no specific sort is requested, add the default secondary sort
        orderBy.push({ brandName: 'asc' });
    }
    // 3. Fetch the total count of matching medicines
    const totalCount = await prisma.medicine.count({ where });
    // 4. Fetch the paginated and sorted list of medicines
    const medicines = await prisma.medicine.findMany({
        where,
        skip,
        take: limit,
        include: {
            inventory: {
                where: { pharmacyId },
                select: { stockStatus: true },
            },
        },
        orderBy,
    });
    // 5. Format the response
    const data = medicines.map(med => ({
        id: med.id,
        brandName: med.brandName,
        genericName: med.genericName,
        manufacturer: med.manufacturer,
        price: med.price,
        stockStatus: med.inventory[0]?.stockStatus || 'OUT_OF_STOCK',
    }));
    return { data, totalCount };
};
// export const getInventoryForMyPharmacy = async (pharmacistUser: User) => {
//   const pharmacyId = await getPharmacistPharmacyId(pharmacistUser);
//   const medicines = await prisma.medicine.findMany({
//     include: {
//       inventory: {
//         where: { pharmacyId },
//       },
//     },
//     orderBy: { brandName: 'asc' },
//   });
//   // Format the response to be more user-friendly on the frontend
//   return medicines.map(med => ({
//     id: med.id,
//     brandName: med.brandName,
//     genericName: med.genericName,
//     manufacturer: med.manufacturer,
//     stockStatus: med.inventory[0]?.stockStatus || 'OUT_OF_STOCK', // Default to OUT_OF_STOCK
//   }));
// };
/**
 * Updates or creates inventory records for the logged-in pharmacist's pharmacy.
 * Uses `upsert` for efficiency.
 */
export const updateInventoryForMyPharmacy = async (pharmacistUser, items) => {
    const pharmacyId = await getPharmacistPharmacyId(pharmacistUser);
    const upsertPromises = items.map(item => {
        return prisma.medicineInventory.upsert({
            where: {
                pharmacyId_medicineId: {
                    pharmacyId,
                    medicineId: item.medicineId,
                },
            },
            update: { stockStatus: item.stockStatus },
            create: {
                pharmacyId,
                medicineId: item.medicineId,
                stockStatus: item.stockStatus,
            },
        });
    });
    await prisma.$transaction(upsertPromises);
    return { message: `${items.length} inventory items updated successfully.` };
};
export const searchPharmaciesByLocation = async (params) => {
    const { medicineId, latitude, longitude, radius, limit = 10, insuranceCompanyId } = params;
    const boundingBox = calculateSimpleBoundingBox(latitude, longitude, radius);
    const whereClause = {
        latitude: { gte: boundingBox.minLat, lte: boundingBox.maxLat },
        longitude: { gte: boundingBox.minLon, lte: boundingBox.maxLon },
        NOT: { latitude: null, longitude: null },
        inventory: {
            some: {
                medicineId: medicineId,
                stockStatus: { in: ['IN_STOCK', 'LOW_STOCK'] },
            },
        },
    };
    if (insuranceCompanyId) {
        whereClause.insurancePlansAccepted = {
            some: {
                insuranceCompanyId: insuranceCompanyId,
            },
        };
    }
    const nearbyPharmacies = await prisma.pharmacy.findMany({
        where: whereClause,
        include: {
            inventory: {
                where: { medicineId: medicineId },
                select: { stockStatus: true },
            },
        },
        take: limit * 2, // Fetch a bit more to account for corners of the box
    });
    const pharmaciesWithDistance = nearbyPharmacies
        .map(p => {
        const distance = calculateDistance(latitude, longitude, p.latitude, p.longitude);
        return {
            id: p.id,
            name: p.name,
            address: p.address,
            latitude: p.latitude,
            longitude: p.longitude,
            stockStatus: p.inventory[0]?.stockStatus,
            distance,
        };
    })
        .filter(p => p.distance <= radius) // Precise circular filter
        .sort((a, b) => a.distance - b.distance); // Sort by nearest
    return pharmaciesWithDistance.slice(0, limit);
};
export const listAllPharmacies = async ({ page, limit, search }) => {
    const skip = (page - 1) * limit;
    const take = limit;
    // Dynamically build the 'where' clause for filtering
    const where = search
        ? {
            OR: [
                { name: { contains: search, mode: 'insensitive' } },
                { address: { contains: search, mode: 'insensitive' } },
                { licenseNumber: { contains: search, mode: 'insensitive' } },
            ],
        }
        : {}; // If no search term, the where clause is empty
    // Use a transaction to get both the data and the total count efficiently
    const [pharmacies, totalCount] = await prisma.$transaction([
        prisma.pharmacy.findMany({
            where,
            skip,
            take,
            orderBy: { name: 'asc' },
        }),
        prisma.pharmacy.count({ where }),
    ]);
    return { data: pharmacies, totalCount };
};
//# sourceMappingURL=pharmacy.service.js.map