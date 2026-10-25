import type { Stop, TransitMode } from "./stops";

export interface TripLeg {
  mode: TransitMode | "walk";
  routeName?: string;
  from: Stop;
  to: Stop;
  /** ISO 8601. */
  departure: string;
  /** ISO 8601. */
  arrival: string;
}

export interface TripPlan {
  legs: TripLeg[];
  /** ISO 8601. */
  departure: string;
  /** ISO 8601. */
  arrival: string;
  durationMinutes: number;
}
