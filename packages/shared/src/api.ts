import type { Stop } from "./stops";
import type { Departure } from "./departures";
import type { VehiclePosition } from "./vehicles";
import type { TripPlan } from "./trips";
import type { Alarm } from "./alarms";

/** Uniform error body returned by every endpoint on failure. */
export interface ApiError {
  error: string;
  detail?: string;
}

export interface HealthResponse {
  status: "ok";
  name: string;
  version: string;
  /** ISO 8601. */
  time: string;
}

export interface StopsQuery {
  q: string;
}
export type StopsResponse = Stop[];

export interface DeparturesQuery {
  stopId: string;
  limit?: number;
}
export type DeparturesResponse = Departure[];

export interface VehiclesQuery {
  mode?: string;
  routeName?: string;
  tripId?: string;
}
export type VehiclesResponse = VehiclePosition[];

export interface TripsQuery {
  fromStopId: string;
  toStopId: string;
  /** ISO 8601; defaults to now on the server. */
  when?: string;
  arriveBy?: boolean;
}
export type TripsResponse = TripPlan[];

export interface CreateAlarmBody {
  stopId: string;
  tripId?: string;
  routeName?: string;
  leadMinutes: number;
}
export type AlarmsResponse = Alarm[];
