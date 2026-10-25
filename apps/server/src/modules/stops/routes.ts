import type { FastifyInstance } from "fastify";
import type { ApiError, StopsQuery } from "@waypoint/shared";
import type { Config } from "../../core/config";
import { TfnswClient } from "../../core/providers/tfnsw/client";
import { searchStops } from "./stops";

export function registerStopsRoutes(app: FastifyInstance, config: Config): void {
  const client = new TfnswClient(config.tfnsw);

  app.get<{ Querystring: StopsQuery }>("/stops", async (request, reply) => {
    const q = (request.query.q ?? "").trim();
    if (!q) {
      reply.code(400);
      return { error: "query parameter 'q' is required" } satisfies ApiError;
    }
    return searchStops(client, q);
  });
}
