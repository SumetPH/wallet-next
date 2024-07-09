import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function amountColor(amount: string) {
  if (amount === "0") {
    return "text-gray-600";
  }
  if (amount.includes("-")) {
    return "text-red-600";
  }
  return "text-green-600";
}
