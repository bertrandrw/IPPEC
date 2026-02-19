import { StatusCodes } from 'http-status-codes';
import { prisma } from '../../config/index.js';
import { ApiError } from '../../utils/ApiError.js';
// --- PATIENT-SPECIFIC SERVICES ---
export const createOrder = async (patientUser, input) => {
    const { pharmacyId, prescriptionId, orderItems } = input;
    const patientProfile = await prisma.patientProfile.findUnique({ where: { userId: patientUser.id } });
    if (!patientProfile) {
        throw new ApiError(StatusCodes.FORBIDDEN, "Patient profile not found.");
    }
    // 1. Validate the prescription
    const prescription = await prisma.prescription.findFirst({
        where: { id: prescriptionId, patientId: patientProfile.id },
        include: { medicines: { select: { medicineId: true } } },
    });
    if (!prescription) {
        throw new ApiError(StatusCodes.FORBIDDEN, 'Prescription not found or does not belong to you.');
    }
    if (prescription.status !== 'ACTIVE') {
        throw new ApiError(StatusCodes.BAD_REQUEST, `Cannot order from a prescription with status: ${prescription.status}.`);
    }
    // 2. Validate the pharmacy
    const pharmacy = await prisma.pharmacy.findUnique({ where: { id: pharmacyId } });
    if (!pharmacy) {
        throw new ApiError(StatusCodes.NOT_FOUND, `Pharmacy with ID ${pharmacyId} not found.`);
    }
    // 3. Validate that every ordered medicine is actually on the prescription
    const prescribedMedicineIds = new Set(prescription.medicines.map(m => m.medicineId));
    for (const item of orderItems) {
        if (!prescribedMedicineIds.has(item.medicineId)) {
            throw new ApiError(StatusCodes.BAD_REQUEST, `Medicine with ID ${item.medicineId} is not on the specified prescription.`);
        }
    }
    // 4. Create the order and its items in a transaction
    const newOrder = await prisma.$transaction(async (tx) => {
        const order = await tx.order.create({
            data: {
                patientId: patientProfile.id,
                pharmacyId: pharmacyId,
                // Status defaults to PENDING
            },
        });
        await tx.orderItem.createMany({
            data: orderItems.map(item => ({
                orderId: order.id,
                medicineId: item.medicineId,
                quantity: item.quantity,
                prescriptionId: prescriptionId, // Crucial link for authorization
            })),
        });
        return order;
    });
    // Return the full order details
    return prisma.order.findUnique({
        where: { id: newOrder.id },
        include: {
            orderItems: { include: { medicine: true } },
            pharmacy: { select: { name: true } },
        },
    });
};
/**
 * Lists all orders placed by the currently logged-in patient.
 */
export const listMyOrders = async (patientUser) => {
    const patientProfile = await prisma.patientProfile.findUnique({ where: { userId: patientUser.id } });
    if (!patientProfile)
        throw new ApiError(StatusCodes.NOT_FOUND, 'Patient profile not found.');
    return prisma.order.findMany({
        where: { patientId: patientProfile.id },
        orderBy: { createdAt: 'desc' },
        include: {
            pharmacy: { select: { name: true } },
            _count: { select: { orderItems: true } }, // A summary of how many items
        },
    });
};
/**
 * Gets a single, detailed order for the logged-in patient.
 */
export const getMyOrderById = async (patientUser, orderId) => {
    const patientProfile = await prisma.patientProfile.findUnique({ where: { userId: patientUser.id } });
    if (!patientProfile)
        throw new ApiError(StatusCodes.NOT_FOUND, 'Patient profile not found.');
    const order = await prisma.order.findFirst({
        where: { id: orderId, patientId: patientProfile.id }, // Security check
        include: {
            pharmacy: true,
            orderItems: { include: { medicine: true } },
        },
    });
    if (!order)
        throw new ApiError(StatusCodes.NOT_FOUND, 'Order not found or you are not authorized to view it.');
    return order;
};
// --- PHARMACIST-SPECIFIC SERVICES ---
/**
 * Lists all orders received by the logged-in pharmacist's pharmacy.
 */
export const listPharmacyOrders = async (pharmacistUser) => {
    const pharmacistProfile = await prisma.pharmacistProfile.findUnique({ where: { userId: pharmacistUser.id } });
    if (!pharmacistProfile)
        throw new ApiError(StatusCodes.FORBIDDEN, 'Pharmacist profile not found.');
    return prisma.order.findMany({
        where: { pharmacyId: pharmacistProfile.pharmacyId },
        orderBy: { createdAt: 'desc' },
        include: {
            patient: { select: { fullName: true } },
            _count: { select: { orderItems: true } },
        },
    });
};
/**
 * Gets a single, detailed order for a pharmacist to process.
 */
export const getPharmacyOrderById = async (pharmacistUser, orderId) => {
    const pharmacistProfile = await prisma.pharmacistProfile.findUnique({ where: { userId: pharmacistUser.id } });
    if (!pharmacistProfile)
        throw new ApiError(StatusCodes.FORBIDDEN, 'Pharmacist profile not found.');
    const order = await prisma.order.findFirst({
        where: {
            id: orderId,
            pharmacyId: pharmacistProfile.pharmacyId, // Security check: order must belong to this pharmacy
        },
        include: {
            // Include patient's full profile for context
            patient: true,
            // --- THIS IS THE KEY ENHANCEMENT ---
            // Include all order items...
            orderItems: {
                include: {
                    // ...for each item, include the master medicine details...
                    medicine: true,
                    // ...and crucially, include the prescription that authorized this item.
                    prescription: {
                        include: {
                            // And for that prescription, include the authoring doctor's details.
                            doctor: {
                                select: {
                                    fullName: true,
                                    specialty: true,
                                    credentials: true,
                                    hospital: {
                                        select: {
                                            name: true,
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
    });
    if (!order) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'Order not found or it does not belong to your pharmacy.');
    }
    // --- Optional: Data Simplification for Frontend ---
    // The prescription details will be the same for all order items. We can hoist it to the top level.
    const firstItem = order.orderItems[0];
    const prescriptionDetails = firstItem ? {
        id: firstItem.prescription.id,
        createdAt: firstItem.prescription.createdAt,
        doctor: firstItem.prescription.doctor,
    } : null;
    return {
        ...order,
        prescription: prescriptionDetails, // Add a top-level prescription object for easy access
    };
};
// export const getPharmacyOrderById = async (pharmacistUser: User, orderId: string) => {
//   const pharmacistProfile = await prisma.pharmacistProfile.findUnique({ where: { userId: pharmacistUser.id } });
//   if (!pharmacistProfile) throw new ApiError(StatusCodes.FORBIDDEN, 'Pharmacist profile not found.');
//   const order = await prisma.order.findFirst({
//     where: { id: orderId, pharmacyId: pharmacistProfile.pharmacyId }, // Security check
//     include: {
//       patient: true,
//       orderItems: { include: { medicine: true } },
//     },
//   });
//   if (!order) throw new ApiError(StatusCodes.NOT_FOUND, 'Order not found or it does not belong to your pharmacy.');
//   return order;
// };
/**
 * Updates the status of an order (e.g., to 'PROCESSING' or 'READY_FOR_PICKUP').
 */
export const updateOrderStatus = async (pharmacistUser, orderId, newStatus) => {
    const pharmacistProfile = await prisma.pharmacistProfile.findUnique({ where: { userId: pharmacistUser.id } });
    if (!pharmacistProfile)
        throw new ApiError(StatusCodes.FORBIDDEN, 'Pharmacist profile not found.');
    // Verify the order belongs to this pharmacy before updating
    const orderToUpdate = await prisma.order.findFirst({
        where: { id: orderId, pharmacyId: pharmacistProfile.pharmacyId },
    });
    if (!orderToUpdate) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'Order not found or it does not belong to your pharmacy.');
    }
    return prisma.order.update({
        where: { id: orderId },
        data: { status: newStatus },
    });
};
//# sourceMappingURL=order.service.js.map