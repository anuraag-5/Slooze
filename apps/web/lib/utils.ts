import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { america, india, butterChicken, cheeseburger, paneerTikka, pepproniPizza } from "./contants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getDescription = (country: "INDIA" | "AMERICA") => {
    return country === "AMERICA" ? america : india;
};

export const getDescriptionForMenu = (itemName: string) => {
  const normalizedName = itemName.toLowerCase().replace(/\s+/g, '');
  
  switch (normalizedName) {
    case 'butterchicken':
      return butterChicken;
    case 'cheeseburger':
      return cheeseburger;
    case 'paneertikka':
      return paneerTikka;
    case 'pepperonipizza':
      return pepproniPizza;
    default:
      return '';
  }
}