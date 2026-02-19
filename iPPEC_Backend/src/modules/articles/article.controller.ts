// src/modules/articles/article.controller.ts

import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { IAuthRequest } from '../../types/custom.d.js';
import { catchAsync } from '../../utils/catchAsync.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import * as articleService from './article.service.js';
import { ApiError } from '../../utils/ApiError.js'; // Ensure ApiError is imported

/**
 * A reusable helper function to format and send paginated API responses.
 */
const paginatedResponse = (res: Response, result: { data: any[], totalCount: number }, page: number, limit: number) => {
  const { data, totalCount } = result;
  const totalPages = Math.ceil(totalCount / limit);
  const meta = {
    totalRecords: totalCount,
    currentPage: page,
    totalPages,
    limit,
  };
  res.status(StatusCodes.OK).json(new ApiResponse(StatusCodes.OK, { data, meta }));
};


// ====================================================================
// SECTION: Doctor-Specific Controllers
// ====================================================================

export const createArticleController = catchAsync(async (req: IAuthRequest, res: Response) => {
  const doctorUser = req.user!;
  const article = await articleService.createArticle(doctorUser, req.body);
  res.status(StatusCodes.CREATED).json(new ApiResponse(StatusCodes.CREATED, article, 'Article created.'));
});

export const updateMyArticleController = catchAsync(async (req: IAuthRequest, res: Response) => {
  const doctorUser = req.user!;
  const { id } = req.params;

  // --- THIS IS THE FIX ---
  if (!id) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Article ID is required in the URL.');
  }
  
  const article = await articleService.updateMyArticle(doctorUser, id, req.body);
  res.status(StatusCodes.OK).json(new ApiResponse(StatusCodes.OK, article, 'Article updated successfully.'));
});

export const deleteMyArticleController = catchAsync(async (req: IAuthRequest, res: Response) => {
  const doctorUser = req.user!;
  const { id } = req.params;

  // --- THIS IS THE FIX ---
  if (!id) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Article ID is required in the URL.');
  }
  
  const result = await articleService.deleteMyArticle(doctorUser, id);
  res.status(StatusCodes.OK).json(new ApiResponse(StatusCodes.OK, result));
});

export const listMyArticlesController = catchAsync(async (req: IAuthRequest, res: Response) => {
  const doctorUser = req.user!;
  const { page, limit, search } = req.query as unknown as { page: number; limit: number; search?: string; };
  const result = await articleService.listMyArticles(doctorUser, { page, limit, search });
  paginatedResponse(res, result, page, limit);
});


// ====================================================================
// SECTION: Public Read Controllers (for any authenticated user)
// ====================================================================

export const listPublishedArticlesController = catchAsync(async (req: IAuthRequest, res: Response) => {
  const { page, limit, search } = req.query as unknown as { page: number; limit: number; search?: string; };
  const result = await articleService.listPublishedArticles({ page, limit, search });
  paginatedResponse(res, result, page, limit);
});

export const getPublishedArticleByIdController = catchAsync(async (req: IAuthRequest, res: Response) => {
  const { id } = req.params;
  
  // --- THIS IS THE FIX ---
  if (!id) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Article ID is required in the URL.');
  }

  const article = await articleService.getPublishedArticleById(id);
  res.status(StatusCodes.OK).json(new ApiResponse(StatusCodes.OK, article));
});

export const getMyArticleByIdController = catchAsync(async (req: IAuthRequest, res: Response) => {
  const doctorUser = req.user!;
  const { id } = req.params;

  if (!id) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Article ID is required in the URL.');
  }

  const article = await articleService.getMyArticleById(doctorUser, id);

  res.status(StatusCodes.OK).json(new ApiResponse(StatusCodes.OK, article));
});
