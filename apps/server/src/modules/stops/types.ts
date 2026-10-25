/** Raw TfNSW stop_finder shapes this module depends on (subset). */
export interface StopFinderResponse {
  locations?: StopFinderLocation[];
}

export interface StopFinderLocation {
  id: string;
  name: string;
  disassembledName?: string;
  type: string;
  /** TfNSW returns [lat, lon]. */
  coord?: [number, number];
}
