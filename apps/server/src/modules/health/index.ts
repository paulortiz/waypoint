import type { FastifyPluginAsync } from "fastify";
import type { HealthResponse } from "@waypoint/shared";

/** Minimal reference module: a single route, no provider calls. */
export const healthModule: FastifyPluginAsync = async (app) => {
  app.get("/health", async (): Promise<HealthResponse> => {
    return {
      status: "ok",
      name: "waypoint-server",
      version: "0.0.0",
      time: new Date().toISOString(),
    };
  });
};
