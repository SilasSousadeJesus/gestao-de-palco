import type Database from "better-sqlite3";

export const stageCommandTypes = ["start", "pause", "resume", "clear"] as const;

export type StageCommandType = (typeof stageCommandTypes)[number];

export type StageSnapshot = {
  eventId: string;
  version: number;
  eventElapsedSeconds: number;
  activeBlockId: string | null;
  mode: "idle" | "running" | "paused";
  startedAt: number | null;
  pausedAt: number | null;
  pausedElapsedSeconds: number | null;
  updatedAt: number;
};

export type StageCommand = {
  commandId: string;
  type: StageCommandType;
  blockId?: string;
  expectedVersion?: number;
};

type StageStateRow = {
  event_id: string;
  version: number;
  event_elapsed_seconds: number;
  active_block_id: string | null;
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
    eventElapsedSeconds: row.event_elapsed_seconds,
    activeBlockId: row.active_block_id,
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
      `select event_id, version, event_elapsed_seconds, active_block_id, mode, started_at, paused_at,
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
  command: StageCommand,
  now: number,
): Omit<StageSnapshot, "eventId" | "version"> {
  const runningSeconds = current.mode === "running" && current.startedAt !== null
    ? Math.max(0, Math.floor((now - current.startedAt) / 1000))
    : 0;
  const accumulated = current.eventElapsedSeconds + runningSeconds;
  switch (command.type) {
    case "start":
      if (!command.blockId) {
        throw new StageStateError("invalid_state", "Selecione um bloco antes de iniciar.");
      }
      return {
        eventElapsedSeconds: accumulated,
        activeBlockId: command.blockId,
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
        eventElapsedSeconds: accumulated,
        activeBlockId: current.activeBlockId,
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
        eventElapsedSeconds: current.eventElapsedSeconds,
        activeBlockId: current.activeBlockId,
        mode: "running",
        startedAt: now - current.pausedElapsedSeconds * 1000,
        pausedAt: null,
        pausedElapsedSeconds: current.pausedElapsedSeconds,
        updatedAt: now,
      };
    case "clear":
      return {
        eventElapsedSeconds: accumulated,
        activeBlockId: null,
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

    if (command.blockId) {
      const block = database
        .prepare("select 1 from time_blocks where id = ? and event_id = ?")
        .get(command.blockId, eventId);
      if (!block) {
        throw new StageStateError("invalid_state", "O bloco nao pertence a este evento.");
      }
    }

    if (command.type === "start") {
      database
        .prepare(
          `update stage_states set active_block_id = null, mode = 'idle', started_at = null,
           paused_at = null, paused_elapsed_seconds = null, version = version + 1, updated_at = ?
           where event_id <> ? and mode in ('running', 'paused')`,
        )
        .run(now, eventId);
    }

    const changed = nextSnapshot(current, command, now);
    const snapshot: StageSnapshot = {
      eventId,
      version: current.version + 1,
      ...changed,
    };

    database
      .prepare(
        `update stage_states
         set version = ?, event_elapsed_seconds = ?, active_block_id = ?, mode = ?, started_at = ?, paused_at = ?,
             paused_elapsed_seconds = ?, updated_at = ?
         where event_id = ?`,
      )
      .run(
        snapshot.version,
        snapshot.eventElapsedSeconds,
        snapshot.activeBlockId,
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
