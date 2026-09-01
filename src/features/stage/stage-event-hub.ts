import type { StageSnapshot } from "@/features/stage/stage-state";

type Subscriber = (snapshot: StageSnapshot) => void;

class StageEventHub {
  private readonly subscribers = new Map<string, Set<Subscriber>>();

  publish(snapshot: StageSnapshot) {
    for (const subscriber of this.subscribers.get(snapshot.eventId) ?? []) {
      subscriber(snapshot);
    }
  }

  subscribe(eventId: string, subscriber: Subscriber) {
    const listeners = this.subscribers.get(eventId) ?? new Set<Subscriber>();
    listeners.add(subscriber);
    this.subscribers.set(eventId, listeners);

    return () => {
      listeners.delete(subscriber);
      if (listeners.size === 0) {
        this.subscribers.delete(eventId);
      }
    };
  }
}

const globalWithStageEventHub = globalThis as typeof globalThis & {
  stageEventHub?: StageEventHub;
};

export const stageEventHub =
  globalWithStageEventHub.stageEventHub ?? new StageEventHub();

if (process.env.NODE_ENV !== "production") {
  globalWithStageEventHub.stageEventHub = stageEventHub;
}
