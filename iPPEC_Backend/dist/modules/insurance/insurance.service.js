import { StatusCodes } from 'http-status-codes';
import { prisma } from '../../config/index.js';
import { ApiError } from '../../utils/ApiError.js';
// in src/modules/insurance/insurance.service.ts
/**
 * Generates a claim report by finding all fulfilled, unclaimed prescriptions
 * for a specific insurance company within a date range, and then creates a
 * permanent ClaimReport record in the database.
 * @param pharmacistUser The authenticated pharmacist performing the action.
 * @param params The criteria for the report (insurance company and date range).
 * @returns The newly created ClaimReport database object.
 */
export const generateClaimReport = async (pharmacistUser, params) => {
    const { insuranceCompanyId, startDate, endDate } = params;
    // 1. Get the logged-in pharmacist's pharmacy ID
    const pharmacistProfile = await prisma.pharmacistProfile.findUnique({
        where: { userId: pharmacistUser.id },
        select: { pharmacyId: true },
    });
    if (!pharmacistProfile) {
        throw new ApiError(StatusCodes.FORBIDDEN, 'User does not have a valid pharmacist profile.');
    }
    const { pharmacyId } = pharmacistProfile;
    // 2. Find all relevant prescriptions that are NOT already part of a claim
    const fulfilledPrescriptions = await prisma.prescription.findMany({
        where: {
            dispensedBy: { pharmacyId },
            status: 'COMPLETED',
            dispensedAt: {
                gte: new Date(startDate),
                lte: new Date(endDate),
            },
            // CRITICAL: The prescription must NOT have an associated claimItem
            claimItem: null,
            patient: {
                insuranceCompanyId: insuranceCompanyId,
                coveragePercentage: { not: null },
            },
        },
        include: {
            patient: {
                select: {
                    coveragePercentage: true,
                },
            },
            medicines: {
                include: {
                    medicine: {
                        select: { price: true },
                    },
                },
            },
        },
    });
    if (fulfilledPrescriptions.length === 0) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'No new, unclaimed prescriptions were found for the given criteria.');
    }
    // 3. Calculate the total potential claim amount
    let grandTotalClaimAmount = 0;
    fulfilledPrescriptions.forEach(prescription => {
        const totalCostOfMedicines = prescription.medicines.reduce((sum, prescribedMed) => {
            const price = prescribedMed.medicine?.price ? Number(prescribedMed.medicine.price) : 0;
            return sum + (price * prescribedMed.quantityPerDose);
        }, 0);
        const patientCoverage = prescription.patient.coveragePercentage ?? 0;
        grandTotalClaimAmount += totalCostOfMedicines * Number(patientCoverage);
    });
    // 4. Create the ClaimReport and all its child ClaimItems in a single transaction
    const newClaimReport = await prisma.claimReport.create({
        data: {
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            status: 'SUBMITTED', // The overall report is submitted
            pharmacyId: pharmacyId,
            insuranceCompanyId: insuranceCompanyId,
            totalAmount: Number(grandTotalClaimAmount.toFixed(2)),
            // Use a nested 'create' to generate a ClaimItem for each prescription
            claimItems: {
                create: fulfilledPrescriptions.map(p => ({
                    prescriptionId: p.id,
                    // The status of each item defaults to PENDING
                })),
            },
        },
        include: {
            // Include useful data in the response for confirmation
            pharmacy: { select: { name: true } },
            insuranceCompany: { select: { name: true } },
            _count: { select: { claimItems: true } }, // Include a count of created claim items
        }
    });
    return newClaimReport;
};
// export const generateClaimReport = async (pharmacistUser: User, params: ReportParams) => {
//   const { insuranceCompanyId, startDate, endDate } = params;
//   // 1. Get the logged-in pharmacist's pharmacy ID
//   const pharmacistProfile = await prisma.pharmacistProfile.findUnique({
//     where: { userId: pharmacistUser.id },
//     select: { pharmacyId: true },
//   });
//   if (!pharmacistProfile) {
//     throw new ApiError(StatusCodes.FORBIDDEN, 'User does not have a valid pharmacist profile.');
//   }
//   const { pharmacyId } = pharmacistProfile;
//   // 2. Find all relevant, UNCLAIMED prescriptions that match the criteria
//   const fulfilledPrescriptions = await prisma.prescription.findMany({
//     where: {
//       // Must be fulfilled by THIS pharmacy
//       dispensedBy: { pharmacyId },
//       // Must be marked as COMPLETED
//       status: 'COMPLETED',
//       // Must have been dispensed within the date range
//       dispensedAt: {
//         gte: new Date(startDate),
//         lte: new Date(endDate),
//       },
//       // Prescription must not already be part of another claim
//       claimReportId: null,
//       // The patient must be covered by THIS insurance company
//       patient: {
//         insuranceCompanyId: insuranceCompanyId,
//         // And the patient must have a defined coverage percentage
//         coveragePercentage: { not: null },
//       },
//     },
//     // Include all the necessary nested data for calculations and reporting
//     include: {
//       patient: {
//         select: {
//           fullName: true,
//           insurancePolicyNumber: true,
//           coveragePercentage: true, // <-- Fetch the patient's specific coverage
//         },
//       },
//       medicines: {
//         include: {
//           medicine: {
//             select: {
//               brandName: true,
//               price: true,
//             },
//           },
//         },
//       },
//     },
//   });
//   // If there's nothing new to claim, inform the user clearly.
//   if (fulfilledPrescriptions.length === 0) {
//     throw new ApiError(StatusCodes.NOT_FOUND, 'No new, unclaimed prescriptions were found for patients with active coverage in the given date range.');
//   }
//   // 3. Calculate the total amount to be claimed, using each patient's specific coverage
//   let grandTotalClaimAmount = 0;
//   fulfilledPrescriptions.forEach(prescription => {
//     const totalCostOfMedicines = prescription.medicines.reduce((sum: number, prescribedMed) => {
//       const price = prescribedMed.medicine?.price ? Number(prescribedMed.medicine.price) : 0;
//       return sum + (price * prescribedMed.quantityPerDose);
//     }, 0);
//     // Use the patient's coverage percentage. Default to 0 if null/undefined for safety.
//     const patientCoverage = prescription.patient.coveragePercentage ?? 0;
//     grandTotalClaimAmount += totalCostOfMedicines * Number(patientCoverage);
//   });
//   // 4. Create the ClaimReport record and link all the prescriptions in a single transaction
//   const newClaimReport = await prisma.claimReport.create({
//     data: {
//       startDate: new Date(startDate),
//       endDate: new Date(endDate),
//       status: 'SUBMITTED',
//       pharmacyId: pharmacyId,
//       insuranceCompanyId: insuranceCompanyId,
//       totalAmount: Number(grandTotalClaimAmount.toFixed(2)),
//       // Use Prisma's 'connect' relation API to link all prescriptions to this new report
//       prescriptions: {
//         connect: fulfilledPrescriptions.map(p => ({ id: p.id })),
//       },
//     },
//     include: {
//       pharmacy: { select: { name: true } },
//       insuranceCompany: { select: { name: true } },
//       _count: { select: { prescriptions: true } }, // Include a count of linked prescriptions
//     }
//   });
//   return newClaimReport;
// };
// export const generateClaimReport = async (pharmacistUser: User, params: ReportParams) => {
//   const { insuranceCompanyId, startDate, endDate } = params;
//   // 1. Get the logged-in pharmacist's pharmacy ID
//   const pharmacistProfile = await prisma.pharmacistProfile.findUnique({
//     where: { userId: pharmacistUser.id },
//     select: { pharmacyId: true },
//   });
//   if (!pharmacistProfile) {
//     throw new ApiError(StatusCodes.FORBIDDEN, 'User does not have a valid pharmacist profile.');
//   }
//   const { pharmacyId } = pharmacistProfile;
//   // 2. Get the insurance coverage terms for this specific pharmacy
//   const insuranceTerms = await prisma.insuranceAcceptance.findUnique({
//     where: {
//       pharmacyId_insuranceCompanyId: {
//         pharmacyId,
//         insuranceCompanyId,
//       },
//     },
//   });
//   if (!insuranceTerms) {
//     throw new ApiError(StatusCodes.NOT_FOUND, 'This pharmacy does not have an agreement with the specified insurance company.');
//   }
//   const { coveragePercentage } = insuranceTerms;
//   // 3. Find all relevant, UNCLAIMED prescriptions that match the criteria
//   const fulfilledPrescriptions = await prisma.prescription.findMany({
//     where: {
//       dispensedBy: { pharmacyId },
//       status: 'COMPLETED',
//       dispensedAt: {
//         gte: new Date(startDate),
//         lte: new Date(endDate),
//       },
//       patient: {
//         insuranceCompanyId: insuranceCompanyId,
//       },
//       // CRITICAL: Only find prescriptions that are not already part of another claim.
//       claimReportId: null,
//     },
//     // Include the necessary nested data for calculations
//     include: {
//       medicines: {
//         include: {
//           medicine: {
//             select: { price: true }, // We only need the price for the calculation
//           },
//         },
//       },
//     },
//   });
//   // If there's nothing new to claim, inform the user.
//   if (fulfilledPrescriptions.length === 0) {
//     throw new ApiError(StatusCodes.NOT_FOUND, 'No new, unclaimed prescriptions were found for the given criteria.');
//   }
//   // 4. Calculate the total amount to be claimed with explicit typing
//   let grandTotalClaimAmount = 0;
//   fulfilledPrescriptions.forEach(prescription => {
//     const totalCostOfMedicines = prescription.medicines.reduce((sum: number, prescribedMed) => {
//       // Safely handle cases where medicine or price might be null
//       const price = prescribedMed.medicine?.price ? Number(prescribedMed.medicine.price) : 0;
//       return sum + (price * prescribedMed.quantityPerDose);
//     }, 0); // Initialize sum as 0
//     grandTotalClaimAmount += totalCostOfMedicines * Number(coveragePercentage);
//   });
//   // 5. Create the ClaimReport record and link the prescriptions in a single transaction
//   const newClaimReport = await prisma.claimReport.create({
//     data: {
//       startDate: new Date(startDate),
//       endDate: new Date(endDate),
//       status: 'SUBMITTED',
//       pharmacyId: pharmacyId,
//       insuranceCompanyId: insuranceCompanyId,
//       totalAmount: Number(grandTotalClaimAmount.toFixed(2)),
//       // Use Prisma's 'connect' relation API to link all the prescriptions to this new report
//       prescriptions: {
//         connect: fulfilledPrescriptions.map(p => ({ id: p.id })),
//       },
//     },
//     include: {
//       // Include some data in the response for confirmation
//       pharmacy: { select: { name: true } },
//       _count: { select: { prescriptions: true } }, // Include a count of linked prescriptions
//     }
//   });
//   // Return the newly created database record
//   return newClaimReport;
// };
// export const generateClaimReport = async (pharmacistUser: User, params: ReportParams) => {
//   const { insuranceCompanyId, startDate, endDate } = params;
//   // 1. Get the logged-in pharmacist's pharmacy
//   const pharmacistProfile = await prisma.pharmacistProfile.findUnique({
//     where: { userId: pharmacistUser.id },
//     select: { pharmacyId: true },
//   });
//   if (!pharmacistProfile) {
//     throw new ApiError(StatusCodes.FORBIDDEN, 'User does not have a valid pharmacist profile.');
//   }
//   const { pharmacyId } = pharmacistProfile;
//   // 2. Get the insurance coverage terms for this specific pharmacy
//   const insuranceTerms = await prisma.insuranceAcceptance.findUnique({
//     where: {
//       pharmacyId_insuranceCompanyId: {
//         pharmacyId,
//         insuranceCompanyId,
//       },
//     },
//   });
//   if (!insuranceTerms) {
//     throw new ApiError(StatusCodes.NOT_FOUND, 'This pharmacy does not have an agreement with the specified insurance company.');
//   }
//   const { coveragePercentage } = insuranceTerms;
//   // 3. Find all relevant prescriptions
//   const fulfilledPrescriptions = await prisma.prescription.findMany({
//     where: {
//       // Must be fulfilled by THIS pharmacy
//       dispensedBy: { pharmacyId },
//       // Must be marked as COMPLETED
//       status: 'COMPLETED',
//       // Must be within the date range
//       dispensedAt: {
//         gte: new Date(startDate),
//         lte: new Date(endDate),
//       },
//       // Patient must be covered by THIS insurance company
//       patient: {
//         insuranceCompanyId: insuranceCompanyId,
//       },
//     },
//     include: {
//       patient: { select: { fullName: true, insurancePolicyNumber: true } },
//       medicines: { include: { medicine: { select: { brandName: true, price: true } } } },
//     },
//   });
//   // 4. Process the data and calculate totals
//   let grandTotalCost = 0;
//   let grandTotalClaimAmount = 0;
//   const reportItems = fulfilledPrescriptions.map(p => {
//     const totalCostOfMedicines = p.medicines.reduce((sum, med) => {
//       // Prisma's Decimal type needs to be converted to a number for calculation
//       return sum + Number(med.medicine.price) * med.quantityPerDose;
//     }, 0);
//     const amountToClaim = totalCostOfMedicines * Number(coveragePercentage);
//     grandTotalCost += totalCostOfMedicines;
//     grandTotalClaimAmount += amountToClaim;
//     return {
//       prescriptionId: p.id,
//       dispensedAt: p.dispensedAt,
//       patientName: p.patient.fullName,
//       patientPolicyNumber: p.patient.insurancePolicyNumber,
//       medicines: p.medicines.map(m => ({
//         name: m.medicine.brandName,
//         quantity: m.quantityPerDose,
//         unitPrice: Number(m.medicine.price),
//         totalPrice: Number(m.medicine.price) * m.quantityPerDose,
//       })),
//       totalCost: totalCostOfMedicines,
//       claimAmount: amountToClaim,
//     };
//   });
//   // 5. Assemble the final report
//   return {
//     reportMetadata: {
//       pharmacyId,
//       insuranceCompanyId,
//       coveragePercentage,
//       startDate,
//       endDate,
//       generatedAt: new Date(),
//     },
//     summary: {
//       totalPrescriptions: reportItems.length,
//       grandTotalCost: Number(grandTotalCost.toFixed(2)),
//       grandTotalClaimAmount: Number(grandTotalClaimAmount.toFixed(2)),
//     },
//     claims: reportItems,
//   };
// };
export const createInsuranceCompany = async (input) => {
    const existingCompany = await prisma.insuranceCompany.findFirst({
        where: { OR: [{ name: input.name }, { contactEmail: input.contactEmail }] },
    });
    if (existingCompany) {
        throw new ApiError(StatusCodes.CONFLICT, 'A company with this name or contact email already exists.');
    }
    return prisma.insuranceCompany.create({ data: input });
};
// --- READ (List All with Pagination) ---
export const listInsuranceCompanies = async (page, limit) => {
    const skip = (page - 1) * limit;
    const take = limit;
    const [companies, totalCount] = await prisma.$transaction([
        prisma.insuranceCompany.findMany({
            skip,
            take,
            orderBy: { name: 'asc' },
        }),
        prisma.insuranceCompany.count(),
    ]);
    return { data: companies, totalCount };
};
// --- READ (Get One by ID) ---
export const getInsuranceCompanyById = async (companyId) => {
    const company = await prisma.insuranceCompany.findUnique({
        where: { id: companyId },
    });
    if (!company) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'Insurance company not found.');
    }
    return company;
};
// --- UPDATE ---
export const updateInsuranceCompany = async (companyId, input) => {
    await getInsuranceCompanyById(companyId); // Ensure it exists
    return prisma.insuranceCompany.update({
        where: { id: companyId },
        data: input,
    });
};
// --- DELETE ---
export const deleteInsuranceCompany = async (companyId) => {
    await getInsuranceCompanyById(companyId); // Ensure it exists
    // Note: This will fail if the company is linked to any patients, insurers, or pharmacies.
    // This is a good safety feature of relational databases.
    // A soft-delete would be an alternative for production systems.
    await prisma.insuranceCompany.delete({ where: { id: companyId } });
    return { message: 'Insurance company has been permanently deleted.' };
};
//# sourceMappingURL=insurance.service.js.map