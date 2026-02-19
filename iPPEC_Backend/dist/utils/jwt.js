import jwt from 'jsonwebtoken';
import { config, logger } from '../config/index.js';
import { ApiError } from './ApiError.js';
import { StatusCodes } from 'http-status-codes';
/**
 * Generates a JWT access token.
 * @param payload The data to include in the token (user ID and role).
 * @returns The generated JWT string.
 */
export const generateToken = (payload) => {
    const secret = config.jwt.secret;
    if (!secret) {
        logger.error('JWT secret is not defined in the environment variables.');
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Server configuration error: JWT secret is missing.');
    }
    const options = {
        expiresIn: `${config.jwt.accessExpirationMinutes}m`,
    };
    return jwt.sign(payload, secret, options);
};
/**
 * Verifies a JWT and returns its payload if valid.
 * @param token The JWT string to verify.
 * @returns The decoded payload of the token.
 */
export const verifyToken = (token) => {
    const secret = config.jwt.secret;
    if (!secret) {
        logger.error('JWT secret is not defined in the environment variables.');
        // --- THIS IS THE FIX ---
        // Removed the extra "new" and the "()" at the end.
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Server configuration error: JWT secret is missing.');
    }
    return jwt.verify(token, secret);
};
//# sourceMappingURL=jwt.js.map