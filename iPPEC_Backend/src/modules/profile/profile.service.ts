// src/modules/profile/profile.service.ts

import { Prisma, User } from '@prisma/client';
import { StatusCodes } from 'http-status-codes';
import { prisma } from '../../config/index.js';
import { ApiError } from '../../utils/ApiError.js';
import { z } from 'zod';
import { updateMyProfileDto } from './dto/update-my-profile.dto.js';

type UpdateMyProfileInput = z.infer<typeof updateMyProfileDto>['body'];

/**
 * Fetches the complete profile for the currently authenticated user.
 * It intelligently includes the correct role-specific profile based on the user's role.
 * @param user The authenticated user object from the auth middleware.
 * @returns The user object with their detailed profile included.
 */
export const getMyProfile = async (user: User) => {
  const userProfile = await prisma.user.findUnique({
    where: { id: user.id },
    select: {
      id: true,
      email: true,
      phone: true,
      role: true,
      isVerified: true,
      createdAt: true,
      // Conditionally include the full profile based on the user's role
      patientProfile: user.role === 'PATIENT' ? { include: { insuranceCompany: true } } : false,
      doctorProfile: user.role === 'DOCTOR' ? { include: { hospital: true } } : false,
      pharmacistProfile: user.role === 'PHARMACIST' ? { include: { pharmacy: true } } : false,
      insurerProfile: user.role === 'INSURER' ? { include: { insuranceCompany: true } } : false,
    },
  });

  if (!userProfile) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'User profile could not be found.');
  }

  // This cleans up the response by removing the keys for the other profiles, which will be `false`.
  const profileKey = `${user.role.toLowerCase()}Profile` as keyof typeof userProfile;
  const finalProfile: any = { ...userProfile };
  if (user.role !== 'ADMIN') {
    finalProfile.profile = finalProfile[profileKey];
  }
  
  delete finalProfile.patientProfile;
  delete finalProfile.doctorProfile;
  delete finalProfile.pharmacistProfile;
  delete finalProfile.insurerProfile;

  return finalProfile;
};

/**
 * Updates the profile of the currently authenticated user.
 * @param user The authenticated user object.
 * @param input The validated data to update.
 * @returns The newly updated full profile.
 */
export const updateMyProfile = async (user: User, input: UpdateMyProfileInput) => {
  const { fullName, email, phone, ...profileSpecificInput } = input;

  // Use a transaction to update both the base user and their profile atomically
  await prisma.$transaction(async (tx) => {
    // 1. Update the base User model (email, phone)
    if (email || phone) {
      await tx.user.update({
        where: { id: user.id },
        data: { email, phone },
      });
    }

    // 2. Update the role-specific profile model if the role is not ADMIN
    if (user.role !== 'ADMIN') {
      const profileTableName = `${user.role.toLowerCase()}Profile` as keyof typeof tx;
      const profileModel = tx[profileTableName] as any;
      
      if (profileModel) {
        await profileModel.update({
          where: { userId: user.id },
          data: { fullName, ...profileSpecificInput },
        });
      }
    }
  });

  // Return the newly updated profile by calling the get function
  return getMyProfile(user);
};
