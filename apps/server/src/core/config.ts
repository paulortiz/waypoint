/**
 * Environment-backed configuration. Loaded once at boot and passed to modules;
 * modules never read `process.env` directly.
 */
export interface Config {
  port: number;
  tfnsw: {
    apiKey: string | undefined;
    baseUrl: string;
  };
  ntfy: {
    topic: string | undefined;
    baseUrl: string;
  };
  database: {
    url: string;
  };
  workflow: {
    /** Stable id shared by the API and worker so they share workflow state. */
    namespaceId: string;
  };
}

export function loadConfig(): Config {
  return {
    port: Number(process.env.PORT ?? 8787),
    tfnsw: {
      apiKey: process.env.TFNSW_API_KEY,
      baseUrl: process.env.TFNSW_BASE_URL ?? "https://api.transport.nsw.gov.au",
    },
    ntfy: {
      topic: process.env.NTFY_TOPIC,
      baseUrl: process.env.NTFY_BASE_URL ?? "https://ntfy.sh",
    },
    database: {
      url:
        process.env.DATABASE_URL ??
        "postgresql://waypoint:waypoint@localhost:5432/waypoint",
    },
    workflow: {
      namespaceId:
        process.env.OW_NAMESPACE_ID ?? "00000000-0000-4000-8000-000000000001",
    },
  };
}
