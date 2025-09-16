import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Utility function to merge Tailwind CSS classes intelligently
 * 
 * Why we need this:
 * - Combines multiple class strings
 * - Resolves conflicts (e.g., "px-4 px-6" becomes "px-6")
 * - Handles conditional classes
 * 
 * Example usage:
 * cn("px-4", condition && "bg-blue-500", "hover:bg-blue-600")
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
