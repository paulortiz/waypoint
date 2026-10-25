import type { Departure, VehiclePosition } from "@waypoint/shared";

/**
 * The backend's domain-event catalogue. Producers publish these to the
 * in-process EventBus; consumers (e.g. the live-map SSE stream) subscribe.
 *
 * Note: the bus is in-process. Producer and consumer of a given event must
 * live in the same process. Cross-process delivery (API <-> worker) would need
 * a transport such as Kafka or Postgres LISTEN/NOTIFY — intentionally not added
 * yet (see AGENTS.md).
 */
export type DomainEvent =
  | { type: "vehicle.position.updated"; at: string; payload: VehiclePosition }
  | {
      type: "departure.polled";
      at: string;
      payload: { stopId: string; departures: Departure[] };
    }
  | {
      type: "trip.tracked";
      at: string;
      payload: { alarmId: string; stopId: string; routeName?: string };
    }
  | {
      type: "arrival.imminent";
      at: string;
      payload: { alarmId: string; etaMinutes: number };
    }
  | { type: "alarm.sent"; at: string; payload: { alarmId: string } };

export type DomainEventType = DomainEvent["type"];

export type DomainEventOf<T extends DomainEventType> = Extract<
  DomainEvent,
  { type: T }
>;
