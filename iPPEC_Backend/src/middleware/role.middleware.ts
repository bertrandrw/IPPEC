// src/middleware/role.middleware.ts

// --- CHANGE 1: Import Response and NextFunction separately ---
import { Response, NextFunction } from 'express';
// --- CHANGE 2: Import our custom request type ---
import { IAuthRequest } from '../types/custom.d.js';

import { StatusCodes } from 'http-status-codes';
import { ApiError } from '../utils/ApiError.js';

export const roleMiddleware =
  (requiredRoles: string[]) =>
  // --- CHANGE 3: Use IAuthRequest instead of Request ---
  (req: IAuthRequest, res: Response, next: NextFunction) => {
    // Now TypeScript knows req.user exists
    if (!req.user) {
      return next(
        new ApiError(
          StatusCodes.INTERNAL_SERVER_ERROR,
          'User not found on request object. Ensure authMiddleware runs first.',
        ),
      );
    }

    if (!requiredRoles.includes(req.user.role)) {
      return next(
        new ApiError(
          StatusCodes.FORBIDDEN,
          'Forbidden: You do not have permission to perform this action',
        ),
      );
    }

    next();
  };