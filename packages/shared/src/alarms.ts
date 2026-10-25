export interface Alarm {
  id: string;
  stopId: string;
  tripId?: string;
  routeName?: string;
  /** Fire the push when the tracked service's ETA falls to this many minutes. */
  leadMinutes: number;
  /** ISO 8601. */
  createdAt: string;
  active: boolean;
}
