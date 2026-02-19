import { StatusCodes } from 'http-status-codes';
import { Prisma } from '@prisma/client';
import { config, logger } from '../config/index.js';
import { ApiError } from '../utils/ApiError.js';
export const errorMiddleware = (err, req, res, 
// eslint-disable-next-line @typescript-eslint/no-unused-vars
next) => {
    let { statusCode, message } = err;
    // If the error is not an instance of our custom ApiError, it's an unexpected error
    if (!(err instanceof ApiError)) {
        // Handle Prisma's specific known request errors
        if (err instanceof Prisma.PrismaClientKnownRequestError) {
            switch (err.code) {
                case 'P2002': // Unique constraint violation
                    statusCode = StatusCodes.CONFLICT;
                    message = `A record with this value already exists. Fields: ${err.meta?.target}`;
                    break;
                case 'P2025': // Record to update/delete not found
                    statusCode = StatusCodes.NOT_FOUND;
                    message = 'The requested record was not found.';
                    break;
                default:
                    statusCode = StatusCodes.BAD_REQUEST;
                    message = 'Database request failed.';
            }
        }
        else {
            // For all other errors, treat as a server error
            statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
            message = 'An unexpected error occurred.';
        }
    }
    // Log the original error for debugging purposes
    logger.error(err);
    const response = {
        code: statusCode,
        message,
        // Only include stack trace in development environment
        ...(config.env === 'development' && { stack: err.stack }),
    };
    res.status(statusCode).send(response);
};
//# sourceMappingURL=error.middleware.js.map