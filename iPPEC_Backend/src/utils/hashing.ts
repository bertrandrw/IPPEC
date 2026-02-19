import bcrypt from 'bcryptjs';
import { config } from '../config/index.js';

/**
 * Hashes a plaintext password using bcrypt.
 * @param password The plaintext password.
 * @returns A promise that resolves to the hashed password.
 */
export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, config.bcryptSaltRounds);
};

/**
 * Compares a plaintext password with a hash.
 * @param password The plaintext password to check.
 * @param hash The stored hash from the database.
 * @returns A promise that resolves to true if the passwords match, false otherwise.
 */
export const comparePassword = async (
  password: string,
  hash: string,
): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};