import type {
  DomainEvent,
  DomainEventType,
  DomainEventOf,
} from "./events";

type AnyHandler = (event: DomainEvent) => void;

/**
 * A tiny typed, synchronous, in-process publish/subscribe bus. This is the
 * backbone of the event-driven backend: modules publish domain events and
 * other modules react, without direct references to each other.
 */
export class EventBus {
  private readonly handlers = new Map<DomainEventType, Set<AnyHandler>>();

  publish(event: DomainEvent): void {
    const set = this.handlers.get(event.type);
    if (!set) return;
    for (const handler of set) handler(event);
  }

  subscribe<T extends DomainEventType>(
    type: T,
    handler: (event: DomainEventOf<T>) => void,
  ): () => void {
    let set = this.handlers.get(type);
    if (!set) {
      set = new Set();
      this.handlers.set(type, set);
    }
    set.add(handler as AnyHandler);
    return () => {
      this.handlers.get(type)?.delete(handler as AnyHandler);
    };
  }
}
