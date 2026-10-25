import type { Config } from "../../config";

/**
 * Shared transport for all TfNSW Open Data calls: holds the base URL and the
 * API key, and attaches the `Authorization: apikey <key>` header. Feature
 * modules build on this rather than calling `fetch` with the key themselves,
 * so auth and base URL live in exactly one place.
 */
export class TfnswClient {
  constructor(private readonly config: Config["tfnsw"]) {}

  private authHeader(): string {
    if (!this.config.apiKey) {
      throw new Error(
        "TFNSW_API_KEY is not set — see AGENTS.md -> TfNSW API key setup.",
      );
    }
    return `apikey ${this.config.apiKey}`;
  }

  /** JSON endpoints (Trip Planner family: stop_finder, departure_mon, trip). */
  async getJson<T>(path: string, params?: Record<string, string>): Promise<T> {
    const url = new URL(path, this.config.baseUrl);
    if (params) {
      for (const [key, value] of Object.entries(params)) {
        url.searchParams.set(key, value);
      }
    }
    const res = await fetch(url, {
      headers: { Authorization: this.authHeader(), Accept: "application/json" },
    });
    if (!res.ok) {
      throw new Error(`TfNSW ${path} failed: ${res.status} ${res.statusText}`);
    }
    return (await res.json()) as T;
  }

  /** GTFS-Realtime endpoints return protobuf; decode with gtfs-rt.ts. */
  async getProtobuf(path: string): Promise<ArrayBuffer> {
    const url = new URL(path, this.config.baseUrl);
    const res = await fetch(url, {
      headers: { Authorization: this.authHeader() },
    });
    if (!res.ok) {
      throw new Error(`TfNSW realtime ${path} failed: ${res.status}`);
    }
    return res.arrayBuffer();
  }
}
