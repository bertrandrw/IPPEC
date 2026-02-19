import { StatusCodes } from 'http-status-codes';
import { prisma } from '../../config/index.js';
import { ApiError } from '../../utils/ApiError.js';
import { z } from 'zod';
import { ROLES } from '../../constants/roles.js';
import { hashPassword } from '../../utils/hashing.js';
import { createPharmacistDto } from './dto/create-pharmacist.dto.js';
import { updatePharmacistDto } from './dto/update-pharmacist.dto.js';

type CreatePharmacistInput = z.infer<typeof createPharmacistDto>['body'];
type UpdatePharmacistInput = z.infer<typeof updatePharmacistDto>['body'];

/**
 * Creates a new Pharmacist user and their associated profile.
 */
export const createPharmacist = async (input: CreatePharmacistInput) => {
  return prisma.$transaction(async (tx) => {
    const existingUser = await tx.user.findFirst({
      where: { OR: [{ email: input.email }, { phone: input.phone }] },
    });
    if (existingUser) {
      throw new ApiError(StatusCodes.CONFLICT, 'User with this email or phone already exists.');
    }

    const hashedPassword = await hashPassword(input.password);
    
    const newUser = await tx.user.create({
      data: {
        email: input.email,
        phone: input.phone,
        password: hashedPassword,
        role: ROLES.PHARMACIST,
        isVerified: true, // Auto-verified since they are created by an Admin
      },
    });

    const pharmacistProfile = await tx.pharmacistProfile.create({
      data: {
        userId: newUser.id,
        fullName: input.fullName,
        pharmacyId: input.pharmacyId,
        licenceNumber: input.licenceNumber,
      },
    });

    const { password, ...userWithoutPassword } = newUser;
    return { user: userWithoutPassword, profile: pharmacistProfile };
  });
};

/**
 * Retrieves a single pharmacist by their User ID.
 */
export const getPharmacistById = async (pharmacistUserId: string) => {
  const user = await prisma.user.findFirst({
    where: { id: pharmacistUserId, role: ROLES.PHARMACIST },
    include: {
      pharmacistProfile: { include: { pharmacy: true } },
    },
  });

  if (!user) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Pharmacist not found.');
  }

  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

/**
 * Updates a pharmacist's user and profile information.
 */
export const updatePharmacist = async (pharmacistUserId: string, input: UpdatePharmacistInput) => {
  const { fullName, pharmacyId, ...userInput } = input;

  await getPharmacistById(pharmacistUserId); // Ensure the user and profile exist before updating

  // Use a transaction to update both user and profile atomically
  await prisma.$transaction(async (tx) => {
    // Update the base User model if there's data for it
    if (Object.keys(userInput).length > 0) {
      await tx.user.update({
        where: { id: pharmacistUserId },
        data: userInput,
      });
    }

    // Update the PharmacistProfile if there's data for it
    if (fullName || pharmacyId) {
      await tx.pharmacistProfile.update({
        where: { userId: pharmacistUserId }, // Find profile by the unique userId
        data: { fullName, pharmacyId },
      });
    }
  });

  return getPharmacistById(pharmacistUserId); // Return the newly updated full profile
};

/**
 * Permanently deletes a Pharmacist user and their associated profile.
 */
export const deletePharmacist = async (pharmacistUserId: string) => {
  // First, verify the user exists and is a pharmacist.
  await getPharmacistById(pharmacistUserId);

  // The `onDelete: Cascade` in the schema on PharmacistProfile's `user` relation
  // ensures that deleting the User will automatically delete their profile.
  await prisma.user.delete({
    where: { id: pharmacistUserId },
  });

  return { message: 'Pharmacist has been permanently deleted.' };
};
