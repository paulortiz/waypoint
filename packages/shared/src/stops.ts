export type TransitMode =
  | "train"
  | "metro"
  | "bus"
  | "ferry"
  | "lightrail"
  | "coach"
  | "school";

export interface Stop {
  /** Provider stop id (e.g. a TfNSW global stop id). */
  id: string;
  name: string;
  lat?: number;
  lon?: number;
  modes?: TransitMode[];
}
