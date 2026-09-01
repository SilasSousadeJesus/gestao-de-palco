import type Database from "better-sqlite3";

export const stageCommandTypes = ["start", "pause", "resume", "clear"] as const;

export type StageCommandType = (typeof stageCommandTypes)[number];

export type StageSnapshot = {
  eventId: string;
  version: number;
  mode: "idle" | "running" | "paused";
  startedAt: number | null;
  pausedAt: number | null;
  pausedElapsedSeconds: number | null;
  updatedAt: number;
};

export type StageCommand = {
  commandId: string;
  type: StageCommandType;
  expectedVersion?: number;
};

type StageStateRow = {
  event_id: string;
  version: number;
  mode: StageSnapshot["mode"];
  started_at: number | null;
  paused_at: number | null;
  paused_elapsed_seconds: number | null;
  updated_at: number;
};

type StoredCommandRow = {
  snapshot_json: string;
};

export class StageStateError extends Error {
  public readonly code: "not_found" | "version_conflict" | "invalid_state";

  constructor(
    code: "not_found" | "version_conflict" | "invalid_state",
    message: string,
  ) {
    super(message);
    this.code = code;
  }
}

function toSnapshot(row: StageStateRow): StageSnapshot {
  return {
    eventId: row.event_id,
    version: row.version,
    mode: row.mode,
    startedAt: row.started_at,
    pausedAt: row.paused_at,
    pausedElapsedSeconds: row.paused_elapsed_seconds,
    updatedAt: row.updated_at,
  };
}

function getSnapshot(database: Database.Database, eventId: string): StageSnapshot {
  const row = database
    .prepare(
      `select event_id, version, mode, started_at, paused_at,
        paused_elapsed_seconds, updated_at
       from stage_states where event_id = ?`,
    )
    .get(eventId) as StageStateRow | undefined;

  if (!row) {
    throw new StageStateError("not_found", "Estado de palco nao encontrado.");
  }

  return toSnapshot(row);
}

function nextSnapshot(
  current: StageSnapshot,
  type: StageCommandType,
  now: number,
): Omit<StageSnapshot, "eventId" | "version"> {
  switch (type) {
    case "start":
      return {
        mode: "running",
        startedAt: now,
        pausedAt: null,
        pausedElapsedSeconds: null,
        updatedAt: now,
      };
    case "pause": {
      if (current.mode !== "running" || current.startedAt === null) {
        throw new StageStateError("invalid_state", "O palco nao esta em execucao.");
      }

      return {
        mode: "paused",
        startedAt: current.startedAt,
        pausedAt: now,
        pausedElapsedSeconds: Math.max(0, Math.floor((now - current.startedAt) / 1000)),
        updatedAt: now,
      };
    }
    case "resume":
      if (current.mode !== "paused" || current.pausedElapsedSeconds === null) {
        throw new StageStateError("invalid_state", "O palco nao esta pausado.");
      }

      return {
        mode: "running",
        startedAt: now - current.pausedElapsedSeconds * 1000,
        pausedAt: null,
        pausedElapsedSeconds: current.pausedElapsedSeconds,
        updatedAt: now,
      };
    case "clear":
      return {
        mode: "idle",
        startedAt: null,
        pausedAt: null,
        pausedElapsedSeconds: null,
        updatedAt: now,
      };
  }
}

export function readStageSnapshot(
  database: Database.Database,
  eventId: string,
): StageSnapshot {
  return getSnapshot(database, eventId);
}

export function applyStageCommand(
  database: Database.Database,
  eventId: string,
  command: StageCommand,
  now = Date.now(),
): StageSnapshot {
  return database.transaction(() => {
    const storedCommand = database
      .prepare(
        `select snapshot_json from stage_commands
         where event_id = ? and command_id = ?`,
      )
      .get(eventId, command.commandId) as StoredCommandRow | undefined;

    if (storedCommand) {
      return JSON.parse(storedCommand.snapshot_json) as StageSnapshot;
    }

    const current = getSnapshot(database, eventId);

    if (
      command.expectedVersion !== undefined &&
      command.expectedVersion !== current.version
    ) {
      throw new StageStateError(
        "version_conflict",
        "O estado do palco mudou antes deste comando ser aplicado.",
      );
    }

    const changed = nextSnapshot(current, command.type, now);
    const snapshot: StageSnapshot = {
      eventId,
      version: current.version + 1,
      ...changed,
    };

    database
      .prepare(
        `update stage_states
         set version = ?, mode = ?, started_at = ?, paused_at = ?,
             paused_elapsed_seconds = ?, updated_at = ?
         where event_id = ?`,
      )
      .run(
        snapshot.version,
        snapshot.mode,
        snapshot.startedAt,
        snapshot.pausedAt,
        snapshot.pausedElapsedSeconds,
        snapshot.updatedAt,
        eventId,
      );

    database
      .prepare(
        `insert into stage_commands (
          event_id, command_id, command_type, result_version, snapshot_json, created_at
        ) values (?, ?, ?, ?, ?, ?)`,
      )
      .run(
        eventId,
        command.commandId,
        command.type,
        snapshot.version,
        JSON.stringify(snapshot),
        now,
      );

    return snapshot;
  })();
}

export function ensureSyncLabEvent(database: Database.Database): StageSnapshot {
  const eventId = "sync-lab";
  const existing = database
    .prepare("select 1 from stage_states where event_id = ?")
    .get(eventId);

  if (!existing) {
    const now = Date.now();
    database.transaction(() => {
      database
        .prepare(
          `insert or ignore into events (
            id, title, scheduled_at, display_mode, status, created_at, updated_at
          ) values (?, ?, ?, ?, ?, ?, ?)`,
        )
        .run(eventId, "Diagnostico de sincronia", now, "timer", "draft", now, now);
      database
        .prepare(
          `insert or ignore into stage_states (
            event_id, version, mode, updated_at
          ) values (?, 0, 'idle', ?)`,
        )
        .run(eventId, now);
    })();
  }

  return getSnapshot(database, eventId);
}
