import type { TransitMode } from "./stops";

export interface Departure {
  stopId: string;
  /** Short public route name, e.g. "T1" or "333". */
  routeName: string;
  mode: TransitMode;
  /** Destination shown to the rider. */
  headsign: string;
  /** Scheduled departure, ISO 8601. */
  scheduled: string;
  /** Real-time estimate when the feed provides one, ISO 8601. */
  estimated?: string;
  /** Positive = running late, negative = early. */
  delaySeconds?: number;
  tripId?: string;
  vehicleId?: string;
}
