// src/middleware/role.middleware.ts
import { StatusCodes } from 'http-status-codes';
import { ApiError } from '../utils/ApiError.js';
export const roleMiddleware = (requiredRoles) => 
// --- CHANGE 3: Use IAuthRequest instead of Request ---
(req, res, next) => {
    // Now TypeScript knows req.user exists
    if (!req.user) {
        return next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'User not found on request object. Ensure authMiddleware runs first.'));
    }
    if (!requiredRoles.includes(req.user.role)) {
        return next(new ApiError(StatusCodes.FORBIDDEN, 'Forbidden: You do not have permission to perform this action'));
    }
    next();
};
//# sourceMappingURL=role.middleware.js.map