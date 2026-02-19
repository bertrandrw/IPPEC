import jwt, { SignOptions } from 'jsonwebtoken';
import { Role } from '@prisma/client';
import { config, logger } from '../config/index.js';
import { JwtPayloadWithId } from '../types/jwt.payload.js';
import { ApiError } from './ApiError.js';
import { StatusCodes } from 'http-status-codes';

interface TokenPayload {
  id: string;
  role: Role;
}

/**
 * Generates a JWT access token.
 * @param payload The data to include in the token (user ID and role).
 * @returns The generated JWT string.
 */
export const generateToken = (payload: TokenPayload): string => {
  const secret = config.jwt.secret;

  if (!secret) {
    logger.error('JWT secret is not defined in the environment variables.');
    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      'Server configuration error: JWT secret is missing.',
    );
  }

  const options: SignOptions = {
    expiresIn: `${config.jwt.accessExpirationMinutes}m`,
  };

  return jwt.sign(payload, secret, options);
};

/**
 * Verifies a JWT and returns its payload if valid.
 * @param token The JWT string to verify.
 * @returns The decoded payload of the token.
 */
export const verifyToken = (token: string): JwtPayloadWithId => {
  const secret = config.jwt.secret;

  if (!secret) {
    logger.error('JWT secret is not defined in the environment variables.');
    // --- THIS IS THE FIX ---
    // Removed the extra "new" and the "()" at the end.
    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      'Server configuration error: JWT secret is missing.',
    );
  }

  return jwt.verify(token, secret) as JwtPayloadWithId;
};
