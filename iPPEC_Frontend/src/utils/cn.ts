import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merges class names using clsx and tailwind-merge.
 * This utility helps combine multiple class names and resolves Tailwind CSS conflicts.
 * @param inputs - Class names to merge
 * @returns Merged class names string
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Also export as default for compatibility
export default cn;

// Common alias
export const classNames = cn;
