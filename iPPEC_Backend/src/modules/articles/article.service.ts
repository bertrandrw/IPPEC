// src/modules/articles/article.service.ts

import { Prisma, User } from '@prisma/client';
import { StatusCodes } from 'http-status-codes';
import { prisma } from '../../config/index.js';
import { ApiError } from '../../utils/ApiError.js';
import { z } from 'zod';
import { createArticleDto } from './dto/create-article.dto.js';
import { updateArticleDto } from './dto/update-article.dto.js';

// Define types from DTOs for use in service functions
type CreateArticleInput = z.infer<typeof createArticleDto>['body'];
type UpdateArticleInput = z.infer<typeof updateArticleDto>['body'];
interface ListParams {
  page: number;
  limit: number;
  search?: string;
  category?: string; // Changed from 'tag' to 'category'
}

/**
 * Helper function to get the Doctor's Profile ID from a User object.
 */
const getDoctorProfileId = async (doctorUser: User): Promise<string> => {
  const doctorProfile = await prisma.doctorProfile.findUnique({ where: { userId: doctorUser.id } });
  if (!doctorProfile) {
    throw new ApiError(StatusCodes.FORBIDDEN, 'User does not have a valid doctor profile.');
  }
  return doctorProfile.id;
};

// ====================================================================
// SECTION: Doctor-Specific Write/Management Services
// ====================================================================

/**
 * Creates a new article authored by the logged-in doctor.
 */
export const createArticle = async (doctorUser: User, input: CreateArticleInput) => {
  const authorId = await getDoctorProfileId(doctorUser);
  // The 'input' object now correctly includes the optional 'category' field.
  return prisma.article.create({
    data: { ...input, authorId },
  });
};

/**
 * Updates an article. Only the original author can perform this action.
 */
export const updateMyArticle = async (doctorUser: User, articleId: string, input: UpdateArticleInput) => {
  const authorId = await getDoctorProfileId(doctorUser);

  const article = await prisma.article.findUnique({ where: { id: articleId } });
  if (!article) throw new ApiError(StatusCodes.NOT_FOUND, 'Article not found.');
  if (article.authorId !== authorId) throw new ApiError(StatusCodes.FORBIDDEN, 'You are not authorized to edit this article.');

  // The 'input' object now correctly includes the optional 'category' field.
  return prisma.article.update({
    where: { id: articleId },
    data: input,
  });
};

/**
 * "Deletes" an article by changing its status to ARCHIVED (soft delete).
 */
export const deleteMyArticle = async (doctorUser: User, articleId: string) => {
  const authorId = await getDoctorProfileId(doctorUser);
  const article = await prisma.article.findUnique({ where: { id: articleId } });

  if (!article) throw new ApiError(StatusCodes.NOT_FOUND, 'Article not found.');
  if (article.authorId !== authorId) throw new ApiError(StatusCodes.FORBIDDEN, 'You are not authorized to delete this article.');

  await prisma.article.update({
    where: { id: articleId },
    data: { status: 'ARCHIVED' },
  });

  return { message: 'Article has been archived successfully.' };
};

// ====================================================================
// SECTION: Read Services
// ====================================================================

/**
 * Retrieves a paginated and searchable list of articles written by the logged-in doctor.
 */
export const listMyArticles = async (doctorUser: User, { page, limit, search, category }: ListParams) => {
  const authorId = await getDoctorProfileId(doctorUser);
  const skip = (page - 1) * limit;

  // --- THIS IS THE CORRECTED 'where' CLAUSE ---
  const where: Prisma.ArticleWhereInput = {
    authorId,
    // Add a condition to exclude ARCHIVED articles
    status: {
      not: 'ARCHIVED',
    },
    ...(search && {
      OR: [
        { title: { contains: search, } },
        { content: { contains: search, } },
      ],
    }),
    ...(category && {
      category: { equals: category, },
    }),
  };

  // The rest of the function remains the same
  const [articles, totalCount] = await prisma.$transaction([
    prisma.article.findMany({ 
      where, 
      skip, 
      take: limit, 
      orderBy: { updatedAt: 'desc' },
      select: { id: true, title: true, status: true, featuredImageUrl: true, category: true, updatedAt: true } 
    }),
    prisma.article.count({ where }),
  ]);

  return { data: articles, totalCount };
};

/**
 * Retrieves a paginated and searchable list of all PUBLISHED articles for any authenticated user.
 */
export const listPublishedArticles = async ({ page, limit, search, category }: ListParams) => {
  const skip = (page - 1) * limit;
  const where: Prisma.ArticleWhereInput = {
    status: 'PUBLISHED',
    ...(search && {
      OR: [
        { title: { contains: search,  } },
        { content: { contains: search,  } },
      ],
    }),
    // --- THIS IS THE CORRECTED FILTER ---
    // Simple equality filter on the 'category' string field.
    ...(category && {
      category: {
        equals: category,
         // Make the category filter case-insensitive
      },
    }),
  };

  const [articles, totalCount] = await prisma.$transaction([
    prisma.article.findMany({
      where, 
      skip, 
      take: limit, 
      orderBy: { createdAt: 'desc' },
      select: { 
        id: true, 
        title: true, 
        featuredImageUrl: true, 
        category: true, // Also return the category in the list view
        createdAt: true, 
        author: { select: { fullName: true, specialty: true } } 
      },
    }),
    prisma.article.count({ where }),
  ]);

  return { data: articles, totalCount };
};

/**
 * Retrieves a single PUBLISHED article by its ID for any authenticated user.
 */
export const getPublishedArticleById = async (articleId: string) => {
  const article = await prisma.article.findFirst({
    where: { id: articleId, status: 'PUBLISHED' },
    include: {
      author: { select: { fullName: true, specialty: true, credentials: true } },
    },
  });
  
  if (!article) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Published article with this ID not found.');
  }
  return article;
};

/**
 * Retrieves the full details of a single article authored by the logged-in doctor.
 * This allows a doctor to view their own articles regardless of status.
 * @param doctorUser The authenticated doctor user.
 * @param articleId The ID of the article to retrieve.
 */
export const getMyArticleById = async (doctorUser: User, articleId: string) => {
  const authorId = await getDoctorProfileId(doctorUser);

  // Find the article by its ID
  const article = await prisma.article.findUnique({
    where: { id: articleId },
  });

  // --- SECURITY & OWNERSHIP CHECK ---
  if (!article) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Article not found.');
  }
  // This is the crucial check: the article's author must be the logged-in doctor.
  if (article.authorId !== authorId) {
    throw new ApiError(StatusCodes.FORBIDDEN, 'You are not authorized to view this article.');
  }

  // If the checks pass, return the full article object
  return article;
};



































// import { Prisma, User } from '@prisma/client';
// import { StatusCodes } from 'http-status-codes';
// import { prisma } from '../../config/index.js';
// import { ApiError } from '../../utils/ApiError.js';
// import { z } from 'zod';
// import { createArticleDto } from './dto/create-article.dto.js';
// import { updateArticleDto } from './dto/update-article.dto.js';

// // Define types from DTOs for use in service functions
// type CreateArticleInput = z.infer<typeof createArticleDto>['body'];
// type UpdateArticleInput = z.infer<typeof updateArticleDto>['body'];
// interface ListParams {
//   page: number;
//   limit: number;
//   search?: string;
// }

// /**
//  * Helper function to get the Doctor's Profile ID from a User object.
//  * Throws an error if the user is not a valid doctor.
//  * @param doctorUser The authenticated user object.
//  * @returns The CUID of the doctor's profile.
//  */
// const getDoctorProfileId = async (doctorUser: User): Promise<string> => {
//   const doctorProfile = await prisma.doctorProfile.findUnique({ where: { userId: doctorUser.id } });
//   if (!doctorProfile) {
//     throw new ApiError(StatusCodes.FORBIDDEN, 'User does not have a valid doctor profile.');
//   }
//   return doctorProfile.id;
// };

// // ====================================================================
// // SECTION: Doctor-Specific Write/Management Services
// // ====================================================================

// /**
//  * Creates a new article authored by the logged-in doctor.
//  * The article is created with a 'PRIVATE' status by default.
//  */
// export const createArticle = async (doctorUser: User, input: CreateArticleInput) => {
//   const authorId = await getDoctorProfileId(doctorUser);
//   return prisma.article.create({
//     data: {
//       title: input.title,
//       content: input.content,
//       featuredImageUrl: input.featuredImageUrl,
//       authorId: authorId,
//     },
//   });
// };

// /**
//  * Updates an article. Only the original author can perform this action.
//  */
// export const updateMyArticle = async (doctorUser: User, articleId: string, input: UpdateArticleInput) => {
//   const authorId = await getDoctorProfileId(doctorUser);

//   const article = await prisma.article.findUnique({ where: { id: articleId } });
//   if (!article) {
//     throw new ApiError(StatusCodes.NOT_FOUND, 'Article not found.');
//   }
//   if (article.authorId !== authorId) {
//     throw new ApiError(StatusCodes.FORBIDDEN, 'You are not authorized to edit this article.');
//   }

//   return prisma.article.update({
//     where: { id: articleId },
//     data: input,
//   });
// };

// /**
//  * "Deletes" an article by changing its status to ARCHIVED (soft delete).
//  * Only the original author can perform this action.
//  */
// export const deleteMyArticle = async (doctorUser: User, articleId: string) => {
//   const authorId = await getDoctorProfileId(doctorUser);
//   const article = await prisma.article.findUnique({ where: { id: articleId } });

//   if (!article) {
//     throw new ApiError(StatusCodes.NOT_FOUND, 'Article not found.');
//   }
//   if (article.authorId !== authorId) {
//     throw new ApiError(StatusCodes.FORBIDDEN, 'You are not authorized to delete this article.');
//   }

//   await prisma.article.update({
//     where: { id: articleId },
//     data: { status: 'ARCHIVED' },
//   });

//   return { message: 'Article has been archived successfully.' };
// };

// // ====================================================================
// // SECTION: Read Services
// // ====================================================================

// /**
//  * Retrieves a paginated and searchable list of articles written by the logged-in doctor.
//  */
// export const listMyArticles = async (doctorUser: User, { page, limit, search }: ListParams) => {
//   const authorId = await getDoctorProfileId(doctorUser);
//   const skip = (page - 1) * limit;

//   const where: Prisma.ArticleWhereInput = {
//     authorId,
//     ...(search && {
//       OR: [
//         { title: { contains: search, mode: 'insensitive' } },
//         { content: { contains: search, mode: 'insensitive' } },
//       ],
//     }),
//   };

//   const [articles, totalCount] = await prisma.$transaction([
//     prisma.article.findMany({ 
//       where, 
//       skip, 
//       take: limit, 
//       orderBy: { updatedAt: 'desc' },
//       select: { id: true, title: true, status: true, featuredImageUrl: true, updatedAt: true } 
//     }),
//     prisma.article.count({ where }),
//   ]);

//   return { data: articles, totalCount };
// };

// /**
//  * Retrieves a paginated and searchable list of all PUBLISHED articles for any authenticated user.
//  */
// export const listPublishedArticles = async ({ page, limit, search }: ListParams) => {
//   const skip = (page - 1) * limit;
//   const where: Prisma.ArticleWhereInput = {
//     status: 'PUBLISHED',
//     ...(search && {
//       OR: [
//         { title: { contains: search, mode: 'insensitive' } },
//         { content: { contains: search, mode: 'insensitive' } },
//       ],
//     }),
//   };

//   const [articles, totalCount] = await prisma.$transaction([
//     prisma.article.findMany({
//       where, 
//       skip, 
//       take: limit, 
//       orderBy: { createdAt: 'desc' },
//       select: { 
//         id: true, 
//         title: true, 
//         featuredImageUrl: true, 
//         createdAt: true, 
//         author: { select: { fullName: true, specialty: true } } 
//       },
//     }),
//     prisma.article.count({ where }),
//   ]);

//   return { data: articles, totalCount };
// };

// /**
//  * Retrieves a single PUBLISHED article by its ID for any authenticated user.
//  */
// export const getPublishedArticleById = async (articleId: string) => {
//   const article = await prisma.article.findFirst({
//     where: { id: articleId, status: 'PUBLISHED' },
//     include: {
//       author: { select: { fullName: true, specialty: true, credentials: true } },
//     },
//   });
  
//   if (!article) {
//     throw new ApiError(StatusCodes.NOT_FOUND, 'Published article with this ID not found.');
//   }
//   return article;
// };
