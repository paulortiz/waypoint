import { randomUUID } from "node:crypto";
import type { FastifyInstance } from "fastify";
import type { ApiError, CreateAlarmBody } from "@waypoint/shared";
import type { WorkflowRegistry } from "../../core/workflow/registry";

/**
 * POST /api/alarms — start tracking a service. This enqueues a durable
 * `track-arrival` workflow run; the worker process drives the countdown and
 * pushes the alarm. Returns immediately with the alarm id.
 */
export function registerAlarmsRoutes(
  app: FastifyInstance,
  workflows: WorkflowRegistry,
): void {
  app.post<{ Body: CreateAlarmBody }>("/alarms", async (request, reply) => {
    const body = request.body;
    if (!body?.stopId || typeof body.leadMinutes !== "number") {
      reply.code(400);
      return {
        error: "stopId and leadMinutes are required",
      } satisfies ApiError;
    }

    const alarmId = randomUUID();
    await workflows.trackArrival.run({
      alarmId,
      stopId: body.stopId,
      leadMinutes: body.leadMinutes,
      routeName: body.routeName,
      tripId: body.tripId,
    });

    reply.code(202);
    return { alarmId, status: "tracking" as const };
  });
}
