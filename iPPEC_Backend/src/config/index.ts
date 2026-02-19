import { env } from './environment.js';
import { jwtConfig } from './jwt.js'; // This already has the correct types
import logger from './logger.js';
import prisma from './prisma.js';

// Define an interface for the entire config object for maximum type safety
interface IAppConfig {
  env: 'development' | 'production' | 'test';
  port: number;
  // --- THIS IS THE FIX ---
  // Instead of an anonymous object with 'any', we use the type from jwtConfig.
  jwt: {
    secret: string;
    accessExpirationMinutes: number;
    refreshExpirationDays: number;
  };
  bcryptSaltRounds: number;
}

// Apply the interface to the exported config object
const config: IAppConfig = {
  env: env.NODE_ENV,
  port: env.PORT,
  jwt: jwtConfig,
  bcryptSaltRounds: env.BCRYPT_SALT_ROUNDS,
};

// Export everything as before
export { config, logger, prisma };