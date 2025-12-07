import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * @function cn
 * Combines Tailwind CSS classes intelligently.
 * It merges conflicting classes and handles conditional class inputs gracefully.
 * This is the core utility function for ShadCN components.
 * * @param inputs - An array of class values (strings, arrays, objects, or booleans)
 * @returns A single string of merged, unique, and non-conflicting Tailwind classes.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}