"use client";

import { useEffect, useState } from "react";

import type { StageSnapshot } from "@/features/stage/stage-state";

export type StageConnection = "connecting" | "connected" | "reconnecting" | "offline";

async function fetchSnapshot(eventId: string) {
  const response = await fetch(`/api/events/${eventId}/stage`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Nao foi possivel obter o estado do palco.");
  }

  return (await response.json()) as StageSnapshot;
}

export function useStageSnapshot(eventId: string | null) {
  const [snapshot, setSnapshot] = useState<StageSnapshot | null>(null);
  const [connection, setConnection] = useState<StageConnection>("connecting");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!eventId) {
      return;
    }

    let isCurrent = true;
    let retryTimer: ReturnType<typeof setTimeout> | undefined;

    const acceptSnapshot = (incoming: StageSnapshot) => {
      setSnapshot((current) =>
        !current || incoming.version >= current.version ? incoming : current,
      );
    };

    const refresh = async () => {
      try {
        const incoming = await fetchSnapshot(eventId);
        if (isCurrent) {
          acceptSnapshot(incoming);
          setError(null);
        }
      } catch {
        if (isCurrent) {
          setError("Aguardando o servidor local do palco.");
        }
      }
    };

    void refresh();
    const source = new EventSource(`/api/events/${eventId}/stage/stream`);

    source.onopen = () => {
      if (isCurrent) {
        setConnection("connected");
        void refresh();
      }
    };

    source.addEventListener("snapshot", (event) => {
      if (!isCurrent) {
        return;
      }

      acceptSnapshot(JSON.parse(event.data) as StageSnapshot);
      setConnection("connected");
      setError(null);
    });

    source.onerror = () => {
      if (!isCurrent) {
        return;
      }

      setConnection("reconnecting");
      retryTimer = setTimeout(() => {
        void refresh();
      }, 1000);
    };

    return () => {
      isCurrent = false;
      if (retryTimer) {
        clearTimeout(retryTimer);
      }
      source.close();
    };
  }, [eventId]);

  return { connection, error, snapshot, setSnapshot };
}
