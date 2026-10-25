export interface TrackArrivalInput {
  alarmId: string;
  stopId: string;
  routeName?: string;
  tripId?: string;
  /** Fire the push once the service's ETA falls to this many minutes. */
  leadMinutes: number;
}

export interface ArrivalStatus {
  etaMinutes: number;
}

export interface TrackArrivalResult {
  notified: boolean;
  finalEtaMinutes?: number;
}
