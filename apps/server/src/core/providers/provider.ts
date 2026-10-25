import type {
  Stop,
  Departure,
  VehiclePosition,
  TripPlan,
} from "@waypoint/shared";

export interface DeparturesParams {
  stopId: string;
  limit?: number;
}

export interface VehiclesParams {
  mode?: string;
  routeName?: string;
  tripId?: string;
}

export interface TripParams {
  fromStopId: string;
  toStopId: string;
  when?: Date;
  arriveBy?: boolean;
}

/**
 * The modular seam. One transport network = one provider. Feature modules map
 * a provider's raw responses into the shared types below; the frontend only
 * ever sees the normalised shapes, so adding a city means adding a provider,
 * not touching the frontend.
 *
 * TfNSW is the first (and currently only) provider. Each feature module owns
 * the mapping for its slice (see modules/<feature>/tfnsw.ts); this interface
 * documents the full contract they collectively satisfy.
 */
export interface TransportProvider {
  readonly id: string;
  searchStops(query: string): Promise<Stop[]>;
  getDepartures(params: DeparturesParams): Promise<Departure[]>;
  getVehicles(params: VehiclesParams): Promise<VehiclePosition[]>;
  planTrip(params: TripParams): Promise<TripPlan[]>;
}
