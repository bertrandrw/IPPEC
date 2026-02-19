// src/middleware/auth.middleware.ts

// --- CHANGE 1: Import Response and NextFunction separately ---
import { Response, NextFunction } from 'express';
// --- CHANGE 2: Import our custom request type ---
import { IAuthRequest } from '../types/custom.d.js';

import jwt from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';
import { config, prisma } from '../config/index.js';
import { ApiError } from '../utils/ApiError.js';
import { catchAsync } from '../utils/catchAsync.js';

export const authMiddleware = catchAsync(
  // --- CHANGE 3: Use IAuthRequest instead of Request ---
  async (req: IAuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new ApiError(
        StatusCodes.UNAUTHORIZED,
        'Unauthorized: Authentication scheme is not "Bearer" or token is not provided.',
      );
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      throw new ApiError(
        StatusCodes.UNAUTHORIZED,
        'Unauthorized: Token is missing or malformed.',
      );
    }

    const decoded = jwt.verify(token, config.jwt.secret);

    if (typeof decoded !== 'object' || !('id' in decoded)) {
      throw new ApiError(
        StatusCodes.UNAUTHORIZED,
        'Unauthorized: Invalid token payload.',
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user) {
      throw new ApiError(
        StatusCodes.UNAUTHORIZED,
        'Unauthorized: User associated with this token no longer exists.',
      );
    }

    // --- The Error is Gone! ---
    // TypeScript now knows that `req` is of type IAuthRequest, which has a 'user' property.
    req.user = user;
    next();
  },
);