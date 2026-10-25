import type { FastifyPluginAsync } from "fastify";
import type { EventBus } from "../../core/events/bus";

export interface VehiclesModuleOptions {
  bus: EventBus;
}

/**
 * Live-map feature. Streams `vehicle.position.updated` events to the browser
 * over Server-Sent Events. The frontend map subscribes here; a poller (vehicles
 * milestone) will publish positions to the bus, and every open stream receives
 * them. Event producer and this consumer share the API process.
 */
export const vehiclesModule: FastifyPluginAsync<VehiclesModuleOptions> = async (
  app,
  opts,
) => {
  app.get("/vehicles/stream", (request, reply) => {
    reply.hijack();
    reply.raw.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    });

    const unsubscribe = opts.bus.subscribe(
      "vehicle.position.updated",
      (event) => {
        reply.raw.write(
          `event: ${event.type}\ndata: ${JSON.stringify(event.payload)}\n\n`,
        );
      },
    );

    request.raw.on("close", unsubscribe);
  });
};
