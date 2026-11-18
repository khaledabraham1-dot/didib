import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export const roman = (n: number) => ["", "I", "II", "III", "IV", "V", "VI", "VII"][n] ?? String(n);
