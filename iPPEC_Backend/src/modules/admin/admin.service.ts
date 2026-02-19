import { StatusCodes } from 'http-status-codes';
import { prisma } from '../../config/index.js';
import { ApiError } from '../../utils/ApiError.js';
import { z } from 'zod';
import { ROLES } from '../../constants/roles.js';
import { hashPassword } from '../../utils/hashing.js';
import { createDoctorDto } from './dto/create-doctor.dto.js';
import { createHospitalDto } from './dto/create-hospital.dto.js';
import { createPharmacyDto } from './dto/create-pharmacy.dto.js';
import { createMedicineDto } from './dto/create-medicine.dto.js';

type CreateDoctorInput = z.infer<typeof createDoctorDto>['body'];
import { createInsurerDto } from './dto/create-insurer.dto.js';
type CreateInsurerInput = z.infer<typeof createInsurerDto>['body'];

// --- User & Institution Management ---

export const listPendingUsers = async () => {
  return prisma.user.findMany({
    where: { isVerified: false },
    select: { id: true, email: true, phone: true, role: true, createdAt: true },
  });
};

export const approveUser = async (userId: string) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'User not found.');
  }
  return prisma.user.update({
    where: { id: userId },
    data: { isVerified: true },
  });
};

export const createHospital = (data: z.infer<typeof createHospitalDto>['body']) => {
  return prisma.hospital.create({ data });
};

// export const createPharmacy = (data: z.infer<typeof createPharmacyDto>['body']) => {
//   return prisma.pharmacy.create({ data });
// };




export const createPharmacy = async (data: z.infer<typeof createPharmacyDto>['body']) => {
  const { authorizedPharmacistId, ...pharmacyData } = data;

  // If an authorized pharmacist is being assigned, validate the assignment.
  if (authorizedPharmacistId) {
    // 1. Check if the pharmacist exists.
    const pharmacistProfile = await prisma.pharmacistProfile.findUnique({
      where: { id: authorizedPharmacistId },
    });
    if (!pharmacistProfile) {
      throw new ApiError(StatusCodes.NOT_FOUND, `Pharmacist with ID ${authorizedPharmacistId} not found.`);
    }

    // 2. Check if the pharmacist is already an authorized person elsewhere.
    const existingAssignment = await prisma.pharmacy.findFirst({
        where: { authorizedPharmacistId: authorizedPharmacistId }
    });
    
    if (existingAssignment) {
        throw new ApiError(StatusCodes.CONFLICT, `This pharmacist is already the authorized person for pharmacy: ${existingAssignment.name}.`);
    }
  }

  // Create the pharmacy with all provided data.
  return prisma.pharmacy.create({
    data: {
      ...pharmacyData,
      authorizedPharmacistId, // This can be null or the validated ID.
    },
  });
};












export const createDoctor = async (input: CreateDoctorInput) => {
  // Use a transaction to ensure both user and profile are created or neither are.
  return prisma.$transaction(async (tx) => {
    const existingUser = await tx.user.findFirst({
      where: { OR: [{ email: input.email }, { phone: input.phone }] },
    });
    if (existingUser) {
      throw new ApiError(StatusCodes.CONFLICT, 'User with this email or phone already exists.');
    }

    const hashedPassword = await hashPassword(input.password);
    
    const newDoctorUser = await tx.user.create({
      data: {
        email: input.email,
        phone: input.phone,
        password: hashedPassword,
        role: ROLES.DOCTOR,
        isVerified: true, // Doctors created by admin are auto-verified
      },
    });

    const doctorProfile = await tx.doctorProfile.create({
      data: {
        userId: newDoctorUser.id,
        fullName: input.fullName,
        credentials: input.credentials,
        specialty: input.specialty,
        hospitalId: input.hospitalId,
        licenceNumber: input.licenceNumber,
      },
    });

    return { user: newDoctorUser, profile: doctorProfile };
  });
};

// --- Master Data Management ---

export const createMedicine = (data: z.infer<typeof createMedicineDto>['body']) => {
  return prisma.medicine.create({ data });
};

export const listAllMedicines = () => {
  return prisma.medicine.findMany();
};

export const createInsurer = async (input: CreateInsurerInput) => {
  // Use a transaction to ensure both the User and InsurerProfile are created successfully.
  return prisma.$transaction(async (tx) => {
    // 1. Check if a user with the same email or phone already exists
    const existingUser = await tx.user.findFirst({
      where: { OR: [{ email: input.email }, { phone: input.phone }] },
    });
    if (existingUser) {
      throw new ApiError(StatusCodes.CONFLICT, 'User with this email or phone already exists.');
    }

    // 2. Hash the password
    const hashedPassword = await hashPassword(input.password);
    
    // 3. Create the base User record
    const newUser = await tx.user.create({
      data: {
        email: input.email,
        phone: input.phone,
        password: hashedPassword,
        role: ROLES.INSURER,
        isVerified: true, // Insurers created by admin are auto-verified
      },
    });

    // 4. Create the InsurerProfile and link it to the User and their Company
    const insurerProfile = await tx.insurerProfile.create({
      data: {
        userId: newUser.id,
        fullName: input.fullName,
        insuranceCompanyId: input.insuranceCompanyId,
      },
    });

    // 5. Return the created user (without password) and profile
    const { password, ...userWithoutPassword } = newUser;
    return { user: userWithoutPassword, profile: insurerProfile };
  });
};
