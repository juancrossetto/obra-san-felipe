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

export const formatNumber = (number: number) => new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
}).format(number);

export const fetcher = (url: string) => fetch(url).then((res) => res.json());

export const generateColors = (count: number) => {
  const colors = [];
  const hueStep = 360 / count;

  for (let i = 0; i < count; i++) {
    const hue = Math.round(i * hueStep);
    const saturation = 70 + Math.random() * 20;
    const lightness = 50 + Math.random() * 10;

    colors.push(`hsl(${hue}, ${saturation}%, ${lightness}%)`);
  }

  return colors;
}