"use client";

import { useEffect, useState } from "react";

import {
  useStageSnapshot,
  type StageConnection,
} from "@/features/stage/use-stage-snapshot";
import type { StageCommandType, StageSnapshot } from "@/features/stage/stage-state";

const connectionLabels: Record<StageConnection, string> = {
  connecting: "conectando",
  connected: "sincronizado",
  reconnecting: "reconectando",
  offline: "offline",
};

export function SyncLabClient() {
  const [eventId, setEventId] = useState<string | null>(null);
  const { connection, error, snapshot, setSnapshot } = useStageSnapshot(eventId);

  useEffect(() => {
    void fetch("/api/sync-lab", { method: "POST" })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error();
        }
        return (await response.json()) as StageSnapshot;
      })
      .then((initialSnapshot) => {
        setSnapshot(initialSnapshot);
        setEventId(initialSnapshot.eventId);
      });
  }, [setSnapshot]);

  const sendCommand = async (type: StageCommandType) => {
    if (!snapshot) {
      return;
    }

    const response = await fetch(`/api/events/${snapshot.eventId}/stage/commands`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        commandId: crypto.randomUUID(),
        expectedVersion: snapshot.version,
        type,
      }),
    });

    if (response.ok) {
      setSnapshot((await response.json()) as StageSnapshot);
    }
  };

  return (
    <main className="sync-lab-shell">
      <p className="eyebrow">DIAGNOSTICO TECNICO</p>
      <h1>Sincronia do palco</h1>
      <p className="sync-lab-copy">
        Abra esta rota em duas janelas. Um comando em uma delas deve aparecer na outra sem recarregar.
      </p>
      <section className="sync-lab-state" aria-live="polite">
        <span>estado</span>
        <strong>{snapshot?.mode ?? "carregando"}</strong>
        <span>versao {snapshot?.version ?? "-"}</span>
        <span className={`connection connection-${connection}`}>
          {connectionLabels[connection]}
        </span>
      </section>
      <div className="sync-lab-actions">
        {(["start", "pause", "resume", "clear"] as const).map((type) => (
          <button key={type} onClick={() => void sendCommand(type)} type="button">
            {type}
          </button>
        ))}
      </div>
      {error ? <p className="sync-lab-error">{error}</p> : null}
    </main>
  );
}
