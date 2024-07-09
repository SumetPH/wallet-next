import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function amountColor(amount: string, accountTypeId: string) {
  // 3 = บัตรเครดิต
  if (Number(amount) === 0) {
    return "text-gray-600";
  }
  if (amount.includes("-") || ["3", "4"].includes(accountTypeId)) {
    return "text-red-600";
  }
  return "text-green-600";
}
