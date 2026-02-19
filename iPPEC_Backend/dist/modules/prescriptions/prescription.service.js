import { StatusCodes } from 'http-status-codes';
import { prisma } from '../../config/index.js';
import { ApiError } from '../../utils/ApiError.js';
import { calculateDistance, calculateSimpleBoundingBox } from '../../utils/geolocation.js';
// Helper to get doctor profile (we can reuse this)
const getDoctorProfile = async (doctorUser) => {
    const doctorProfile = await prisma.doctorProfile.findUnique({
        where: { userId: doctorUser.id },
    });
    if (!doctorProfile) {
        throw new ApiError(StatusCodes.FORBIDDEN, 'User does not have a valid doctor profile.');
    }
    return doctorProfile;
};
export const createPrescription = async (doctorUser, input) => {
    // 1. Verify that the doctor profile exists for the logged-in user
    const doctorProfile = await prisma.doctorProfile.findUnique({
        where: { userId: doctorUser.id },
    });
    if (!doctorProfile) {
        throw new ApiError(StatusCodes.FORBIDDEN, 'User does not have a valid doctor profile.');
    }
    // 2. Verify that the patient exists
    const patientProfile = await prisma.patientProfile.findUnique({
        where: { id: input.patientId },
    });
    if (!patientProfile) {
        throw new ApiError(StatusCodes.NOT_FOUND, `Patient with ID ${input.patientId} not found.`);
    }
    // 3. Use a transaction to create the prescription and all its medicine entries
    const newPrescription = await prisma.$transaction(async (tx) => {
        // Create the parent Prescription document
        const prescription = await tx.prescription.create({
            data: {
                patientId: patientProfile.id,
                doctorId: doctorProfile.id,
                hospitalId: doctorProfile.hospitalId,
                chiefComplaints: input.chiefComplaints,
                findingsOnExam: input.findingsOnExam,
                investigations: input.investigations,
                advice: input.advice,
                followUpDate: input.followUpDate,
            },
        });
        // --- THIS IS THE UPDATED MAPPING ---
        // Create each prescribed medicine and link it to the new prescription
        await tx.prescribedMedicine.createMany({
            data: input.medicines.map((med) => ({
                prescriptionId: prescription.id,
                medicineId: med.medicineId,
                // New structured fields
                route: med.route,
                form: med.form,
                quantityPerDose: med.quantityPerDose,
                frequency: med.frequency,
                durationInDays: med.durationInDays,
                fullInstruction: med.fullInstruction,
                totalQuantity: med.totalQuantity,
            })),
        });
        return prescription;
    });
    // 4. Return the full prescription details for the response
    return prisma.prescription.findUnique({
        where: { id: newPrescription.id },
        include: {
            patient: { select: { fullName: true } },
            doctor: { select: { fullName: true, specialty: true } },
            hospital: { select: { name: true } },
            medicines: {
                include: {
                    medicine: true, // Include details of the master medicine (e.g., name, dosage)
                },
            },
        },
    });
};
export const listPrescriptionsForPatient = async (patientUser) => {
    const patientProfile = await prisma.patientProfile.findUnique({
        where: { userId: patientUser.id },
    });
    if (!patientProfile) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'Patient profile not found.');
    }
    return prisma.prescription.findMany({
        where: { patientId: patientProfile.id },
        orderBy: { createdAt: 'desc' }, // Show the most recent first
        // --- THIS IS THE CORRECT, COMPREHENSIVE QUERY ---
        include: {
            doctor: { select: { fullName: true, specialty: true } },
            hospital: { select: { name: true } },
            medicines: {
                // Order the medicines within the prescription if needed
                orderBy: {
                    id: 'asc', // Or any other field
                },
                include: {
                    // Include the full details from the master medicine list
                    medicine: true,
                },
            },
        },
    });
};
// export const listPrescriptionsForPatient = async (patientUser: User) => {
//   const patientProfile = await prisma.patientProfile.findUnique({
//     where: { userId: patientUser.id },
//   });
//   if (!patientProfile) {
//     throw new ApiError(StatusCodes.NOT_FOUND, 'Patient profile not found.');
//   }
//   return prisma.prescription.findMany({
//     where: { patientId: patientProfile.id },
//     orderBy: { createdAt: 'desc' }, // Show the most recent first
//     include: {
//       doctor: { select: { fullName: true, specialty: true } },
//       hospital: { select: { name: true } },
//     },
//   });
// };
// New function to get a single prescription by its ID
export const getPrescriptionByIdForPatient = async (patientUser, prescriptionId) => {
    const patientProfile = await prisma.patientProfile.findUnique({
        where: { userId: patientUser.id },
    });
    if (!patientProfile) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'Patient profile not found.');
    }
    const prescription = await prisma.prescription.findUnique({
        where: { id: prescriptionId },
        include: {
            doctor: { select: { fullName: true, specialty: true, credentials: true } },
            hospital: { select: { name: true, address: true } },
            medicines: { include: { medicine: true } },
        },
    });
    if (!prescription) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'Prescription not found.');
    }
    // SECURITY CHECK: Ensure the patient requesting the prescription is the owner
    if (prescription.patientId !== patientProfile.id) {
        throw new ApiError(StatusCodes.FORBIDDEN, 'You are not authorized to view this prescription.');
    }
    return prescription;
};
/**
 * Retrieves a single, active prescription for fulfillment.
 * This can be accessed by any authenticated pharmacist.
 * @param prescriptionId The ID of the prescription to retrieve.
 */
export const getPrescriptionForFulfillment = async (prescriptionId) => {
    const prescription = await prisma.prescription.findUnique({
        where: {
            id: prescriptionId,
            status: 'ACTIVE', // Only active prescriptions can be fulfilled
        },
        include: {
            patient: { select: { fullName: true, sex: true, dateOfBirth: true } },
            doctor: { select: { fullName: true, specialty: true, credentials: true } },
            hospital: { select: { name: true } },
            medicines: { include: { medicine: true } },
        },
    });
    if (!prescription) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'Active prescription with this ID not found.');
    }
    return prescription;
};
/**
 * Marks a prescription as completed.
 * In a real-world app, you might mark individual medicines. For simplicity, we'll mark the whole prescription.
 * @param pharmacistUser The logged-in pharmacist user.
 * @param prescriptionId The ID of the prescription to mark as completed.
 */
export const fulfillPrescription = async (pharmacistUser, prescriptionId) => {
    const pharmacistProfile = await prisma.pharmacistProfile.findUnique({
        where: { userId: pharmacistUser.id },
    });
    if (!pharmacistProfile) {
        throw new ApiError(StatusCodes.FORBIDDEN, 'User does not have a valid pharmacist profile.');
    }
    // Use a transaction to ensure we find the prescription and update it atomically
    return prisma.$transaction(async (tx) => {
        const prescription = await tx.prescription.findUnique({
            where: { id: prescriptionId },
        });
        if (!prescription) {
            throw new ApiError(StatusCodes.NOT_FOUND, 'Prescription not found.');
        }
        if (prescription.status !== 'ACTIVE') {
            throw new ApiError(StatusCodes.BAD_REQUEST, `Cannot fulfill a prescription with status: ${prescription.status}`);
        }
        const updatedPrescription = await tx.prescription.update({
            where: { id: prescriptionId },
            data: {
                status: 'COMPLETED',
                dispensedById: pharmacistProfile.id, // Log who fulfilled it
                dispensedAt: new Date(), // Log when it was fulfilled
            },
        });
        // In a more advanced version, you would also decrement pharmacy inventory here.
        return updatedPrescription;
    });
};
// --- FUNCTION FOR DOCTOR'S OWN PRESCRIPTIONS ---
/**
 * Retrieves a paginated list of prescriptions created by the currently logged-in doctor.
 * @param doctorUser The authenticated doctor user object.
 * @param page The page number for pagination.
 * @param limit The number of items per page.
 */
export const listMyPrescriptionsForDoctor = async (doctorUser, page, limit) => {
    // 1. Get the doctor's profile to find their doctorId.
    const doctorProfile = await getDoctorProfile(doctorUser);
    const skip = (page - 1) * limit;
    // 2. Use a transaction to get both the paginated data and the total count.
    const [prescriptions, totalCount] = await prisma.$transaction([
        prisma.prescription.findMany({
            where: { doctorId: doctorProfile.id }, // Filter by the doctor's own ID
            skip,
            take: limit,
            orderBy: { createdAt: 'desc' },
            include: {
                // Include patient's name to know who the prescription was for
                patient: {
                    select: {
                        fullName: true,
                    },
                },
            },
        }),
        prisma.prescription.count({
            where: { doctorId: doctorProfile.id },
        }),
    ]);
    return { data: prescriptions, totalCount };
};
/**
 * Retrieves a list of all prescriptions for a specific patient.
 * This is intended for use by doctors to review a patient's history.
 * @param patientId The ID of the patient's profile.
 */
export const listPrescriptionsForPatientByDoctor = async (patientId) => {
    // 1. First, verify the patient actually exists.
    const patientProfile = await prisma.patientProfile.findUnique({
        where: { id: patientId },
    });
    if (!patientProfile) {
        throw new ApiError(StatusCodes.NOT_FOUND, `Patient with ID ${patientId} not found.`);
    }
    // 2. Fetch all prescriptions for that patient.
    const prescriptions = await prisma.prescription.findMany({
        where: { patientId: patientId },
        orderBy: { createdAt: 'desc' },
        include: {
            // Include the details of the doctor who wrote EACH prescription
            doctor: {
                select: {
                    fullName: true,
                    specialty: true,
                },
            },
            hospital: {
                select: {
                    name: true,
                },
            },
            // Optionally include a summary of medicines
            medicines: {
                select: {
                    medicine: {
                        select: { brandName: true }
                    }
                }
            }
        },
    });
    return prescriptions;
};
/**
 * Gets a single prescription by its ID, with security checks.
 * - A Patient can only get their own prescription.
 * - A Doctor can get any prescription.
 * @param user The authenticated user (Patient or Doctor).
 * @param prescriptionId The ID of the prescription to fetch.
 */
export const getPrescriptionById = async (user, prescriptionId) => {
    const prescription = await prisma.prescription.findUnique({
        where: { id: prescriptionId },
        include: {
            // Include all the rich details
            doctor: { include: { hospital: true } },
            patient: { select: { fullName: true } },
            medicines: { include: { medicine: true } },
        },
    });
    if (!prescription) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'Prescription not found.');
    }
    // --- SECURITY CHECK ---
    if (user.role === 'PATIENT') {
        const patientProfile = await prisma.patientProfile.findUnique({ where: { userId: user.id } });
        if (prescription.patientId !== patientProfile?.id) {
            throw new ApiError(StatusCodes.FORBIDDEN, 'You are not authorized to view this prescription.');
        }
    }
    // If the user is a Doctor, we allow access (as per our current rules).
    return prescription;
};
/**
 * Updates an active prescription. Only the authoring doctor can perform this action.
 * @param doctorUser The authenticated doctor user.
 * @param prescriptionId The ID of the prescription to update.
 * @param input The validated update data.
 */
// --- USE THE CORRECT TYPE IN THE FUNCTION SIGNATURE ---
export const updateMyPrescription = async (doctorUser, prescriptionId, input) => {
    const doctorProfile = await getDoctorProfile(doctorUser);
    // --- NEW VALIDATION STEP ---
    // If new medicines are being provided, validate all their IDs first.
    if (input.medicines && input.medicines.length > 0) {
        // 1. Extract all unique medicine IDs from the input.
        const medicineIds = [...new Set(input.medicines.map(med => med.medicineId))];
        // 2. Query the database to see how many of these IDs actually exist.
        const foundMedicinesCount = await prisma.medicine.count({
            where: {
                id: { in: medicineIds },
            },
        });
        // 3. If the counts don't match, an invalid ID was provided.
        if (foundMedicinesCount !== medicineIds.length) {
            throw new ApiError(StatusCodes.BAD_REQUEST, 'One or more provided medicine IDs are invalid or do not exist.');
        }
    }
    // --- END OF NEW VALIDATION ---
    return prisma.$transaction(async (tx) => {
        const prescription = await tx.prescription.findUnique({ where: { id: prescriptionId } });
        // --- (All other security and business rule checks remain the same) ---
        if (!prescription) {
            throw new ApiError(StatusCodes.NOT_FOUND, 'Prescription not found.');
        }
        if (prescription.doctorId !== doctorProfile.id) {
            throw new ApiError(StatusCodes.FORBIDDEN, 'You are not authorized to edit this prescription.');
        }
        if (prescription.status !== 'ACTIVE') {
            throw new ApiError(StatusCodes.BAD_REQUEST, `Cannot edit a prescription with status: ${prescription.status}`);
        }
        // Update the top-level prescription fields
        await tx.prescription.update({
            where: { id: prescriptionId },
            data: {
                chiefComplaints: input.chiefComplaints,
                findingsOnExam: input.findingsOnExam,
                advice: input.advice,
                followUpDate: input.followUpDate,
            },
        });
        // If a new list of medicines is provided, replace the old ones.
        if (input.medicines) {
            await tx.prescribedMedicine.deleteMany({ where: { prescriptionId } });
            // This operation is now safe because we validated all medicine IDs beforehand.
            if (input.medicines.length > 0) {
                await tx.prescribedMedicine.createMany({
                    data: input.medicines.map((med) => ({
                        prescriptionId: prescription.id,
                        ...med,
                    })),
                });
            }
        }
        // Return the fully updated prescription for the response
        return tx.prescription.findUnique({
            where: { id: prescriptionId },
            include: {
                medicines: { include: { medicine: true } },
                doctor: { select: { fullName: true } },
                patient: { select: { fullName: true } }
            },
        });
    });
};
// export const updateMyPrescription = async (doctorUser: User, prescriptionId: string, input: UpdatePrescriptionInput) => {
//   const doctorProfile = await getDoctorProfile(doctorUser);
//   return prisma.$transaction(async (tx) => {
//     const prescription = await tx.prescription.findUnique({ where: { id: prescriptionId } });
//     // --- Security & Business Rule Checks ---
//     if (!prescription) {
//       throw new ApiError(StatusCodes.NOT_FOUND, 'Prescription not found.');
//     }
//     if (prescription.doctorId !== doctorProfile.id) {
//       throw new ApiError(StatusCodes.FORBIDDEN, 'You are not authorized to edit this prescription.');
//     }
//     if (prescription.status !== 'ACTIVE') {
//       throw new ApiError(StatusCodes.BAD_REQUEST, `Cannot edit a prescription with status: ${prescription.status}`);
//     }
//     // Update the top-level prescription fields
//     await tx.prescription.update({
//       where: { id: prescriptionId },
//       data: {
//         chiefComplaints: input.chiefComplaints,
//         findingsOnExam: input.findingsOnExam,
//         advice: input.advice,
//         followUpDate: input.followUpDate,
//       },
//     });
//     // If a new list of medicines is provided, replace the old ones.
//     if (input.medicines) {
//       // 1. Delete all old medicine entries for this prescription
//       await tx.prescribedMedicine.deleteMany({ where: { prescriptionId } });
//       // 2. Create the new medicine entries
//       await tx.prescribedMedicine.createMany({
//         data: input.medicines.map((med) => ({
//           prescriptionId: prescription.id,
//           // Spread the rest of the medicine details from the input
//           ...med, 
//         })),
//       });
//     }
//     // Return the fully updated prescription for the response
//     return tx.prescription.findUnique({
//       where: { id: prescriptionId },
//       include: { 
//         medicines: { include: { medicine: true } },
//         doctor: { select: { fullName: true } },
//         patient: { select: { fullName: true } }
//       },
//     });
//   });
// };
export const cancelMyPrescription = async (doctorUser, prescriptionId) => {
    const doctorProfile = await getDoctorProfile(doctorUser);
    const prescription = await prisma.prescription.findUnique({ where: { id: prescriptionId } });
    // --- SECURITY & BUSINESS RULE CHECKS ---
    if (!prescription) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'Prescription not found.');
    }
    if (prescription.doctorId !== doctorProfile.id) {
        throw new ApiError(StatusCodes.FORBIDDEN, 'You are not authorized to cancel this prescription.');
    }
    if (prescription.status !== 'ACTIVE') {
        throw new ApiError(StatusCodes.BAD_REQUEST, `Cannot cancel a prescription with status: ${prescription.status}`);
    }
    // --- END OF CHECKS ---
    // Change the status to CANCELLED
    return prisma.prescription.update({
        where: { id: prescriptionId },
        data: { status: 'CANCELLED' },
    });
};
export const findPharmaciesForPrescription = async (patientUser, prescriptionId, params) => {
    const { latitude, longitude, radius, limit } = params;
    // 1. Verify ownership and get medicine IDs
    const patientProfile = await prisma.patientProfile.findUnique({ where: { userId: patientUser.id } });
    if (!patientProfile)
        throw new ApiError(StatusCodes.FORBIDDEN, "Patient profile not found.");
    const prescription = await prisma.prescription.findFirst({
        where: { id: prescriptionId, patientId: patientProfile.id },
        select: { medicines: { select: { medicineId: true } } },
    });
    if (!prescription)
        throw new ApiError(StatusCodes.NOT_FOUND, 'Prescription not found or you are not authorized.');
    if (prescription.medicines.length === 0)
        throw new ApiError(StatusCodes.BAD_REQUEST, 'This prescription has no medicines.');
    const requiredMedicineIds = prescription.medicines.map(m => m.medicineId);
    // 2. Build the query using the imported helper
    const boundingBox = calculateSimpleBoundingBox(latitude, longitude, radius);
    const whereClause = {
        latitude: { gte: boundingBox.minLat, lte: boundingBox.maxLat },
        longitude: { gte: boundingBox.minLon, lte: boundingBox.maxLon },
        NOT: { latitude: null, longitude: null },
        // Find pharmacies that have ALL the required medicines in stock
        AND: requiredMedicineIds.map(medId => ({
            inventory: {
                some: {
                    medicineId: medId,
                    stockStatus: { in: ['IN_STOCK', 'LOW_STOCK'] },
                },
            },
        })),
    };
    // 3. Execute query and process results
    const nearbyPharmacies = await prisma.pharmacy.findMany({ where: whereClause, take: limit * 2 });
    const pharmaciesWithDistance = nearbyPharmacies
        .map(p => {
        const distance = calculateDistance(latitude, longitude, p.latitude, p.longitude);
        return {
            id: p.id,
            name: p.name,
            address: p.address,
            latitude: p.latitude,
            longitude: p.longitude,
            distance,
        };
    })
        .filter(p => p.distance <= radius)
        .sort((a, b) => a.distance - b.distance);
    return pharmaciesWithDistance.slice(0, limit);
};
//# sourceMappingURL=prescription.service.js.map