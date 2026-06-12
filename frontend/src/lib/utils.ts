import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 }).format(value);
}

export function historyToPrediction(item: import("../types/api").HistoryItem) {
  return {
    cement: item.predicted_cement,
    blast_furnace_slag: item.predicted_blast_furnace_slag,
    fly_ash: item.predicted_fly_ash,
    water: item.predicted_water,
    superplasticizer: item.predicted_superplasticizer,
    coarse_aggregate: item.predicted_coarse_aggregate,
    fine_aggregate: item.predicted_fine_aggregate,
  };
}
