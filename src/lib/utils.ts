import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const parseDate = (dateString: string) => {
  const [day, month, year] = dateString.split('/').map(Number);
  return new Date(year, month - 1, day); // Meses son base 0 en JavaScript
};

export const capitalizeText = (text: string) => String(text[0]).toUpperCase() + String(text).slice(1);
