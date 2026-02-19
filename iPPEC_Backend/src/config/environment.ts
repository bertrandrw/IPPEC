import dotenv from 'dotenv';
import { z } from 'zod';
import path from 'path';

// Load .env file based on NODE_ENV
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

// Define the schema for environment variables
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(3000),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  
  // JWT Configuration
  JWT_SECRET: z.string().min(1, 'JWT_SECRET is required'),
  JWT_ACCESS_EXPIRATION_MINUTES: z.coerce.number().default(60),
  JWT_REFRESH_EXPIRATION_DAYS: z.coerce.number().default(30),

  // Hashing Configuration
  BCRYPT_SALT_ROUNDS: z.coerce.number().default(10),


  //CLOUDINARY Configuration
  CLOUDINARY_CLOUD_NAME: z.string().min(4, 'CLOUDINARY_CLOUD_NAME is required'),
  CLOUDINARY_API_KEY: z.string().min(4, 'CLOUDINARY_API_KEY is required'),
  CLOUDINARY_API_SECRET: z.string().min(4, 'CLOUDINARY_API_SECRET is required'),
});

// Validate process.env against the schema
const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error(
    '❌ Invalid environment variables:',
    parsedEnv.error.flatten().fieldErrors,
  );
  throw new Error('Invalid environment variables.');
}

// Export the validated and typed environment variables
export const env = parsedEnv.data;