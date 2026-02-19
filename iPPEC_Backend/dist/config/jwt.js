import { env } from './environment.js';
export const jwtConfig = {
    secret: env.JWT_SECRET,
    accessExpirationMinutes: env.JWT_ACCESS_EXPIRATION_MINUTES,
    refreshExpirationDays: env.JWT_REFRESH_EXPIRATION_DAYS,
};
//# sourceMappingURL=jwt.js.map