import { customAlphabet } from 'nanoid';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// 1. Tailwind Helper (We will need this for the UI Phase)
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// 2. Strict Alphanumeric Generator (No underscores, no dashes)
//    This ensures we strictly follow the [A-Za-z0-9] rule
const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
const generate = customAlphabet(alphabet, 6); 

export function generateShortCode(): string {
  return generate();
}

export function isValidShortCode(code: string): boolean {
  // Regex: 6 to 8 alphanumeric characters only
  const regex = /^[A-Za-z0-9]{6,8}$/;
  return regex.test(code);
}

export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}