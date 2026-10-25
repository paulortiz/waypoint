import type { TransitMode } from "./stops";

export interface VehiclePosition {
  vehicleId: string;
  tripId?: string;
  routeName?: string;
  mode: TransitMode;
  lat: number;
  lon: number;
  /** Degrees, 0 = north. */
  bearing?: number;
  /** Metres per second. */
  speed?: number;
  /** Feed timestamp, ISO 8601. */
  timestamp: string;
}
