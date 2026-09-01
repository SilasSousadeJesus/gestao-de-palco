import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import Database from "better-sqlite3";

import {
  applyStageCommand,
  readStageSnapshot,
  StageStateError,
} from "../src/features/stage/stage-state.ts";

const currentDirectory = path.dirname(fileURLToPath(import.meta.url));
const migrationsDirectory = path.resolve(currentDirectory, "../drizzle");

function createDatabase() {
  const database = new Database(":memory:");
  database.pragma("foreign_keys = ON");

  for (const migration of fs.readdirSync(migrationsDirectory).sort()) {
    if (migration.endsWith(".sql")) {
      database.exec(fs.readFileSync(path.join(migrationsDirectory, migration), "utf8"));
    }
  }

  database
    .prepare(
      `insert into events (
        id, title, scheduled_at, display_mode, status, created_at, updated_at
      ) values ('evento', 'Evento', 0, 'timer', 'draft', 0, 0)`,
    )
    .run();
  database
    .prepare(
      `insert into stage_states (event_id, version, mode, updated_at)
       values ('evento', 0, 'idle', 0)`,
    )
    .run();
  database
    .prepare(
      `insert into time_blocks (
        id, event_id, title, duration_seconds, position, is_sequential, created_at, updated_at
      ) values ('bloco', 'evento', 'Bloco', 60, 0, 0, 0, 0)`,
    )
    .run();

  return database;
}

test("comandos de palco persistem versao e sao idempotentes", () => {
  const database = createDatabase();
  const first = applyStageCommand(
    database,
    "evento",
    { blockId: "bloco", commandId: "inicio", expectedVersion: 0, type: "start" },
    1_000,
  );
  const replay = applyStageCommand(
    database,
    "evento",
    { blockId: "bloco", commandId: "inicio", expectedVersion: 0, type: "start" },
    2_000,
  );

  assert.deepEqual(first, {
    eventId: "evento",
    version: 1,
    eventElapsedSeconds: 0,
    activeBlockId: "bloco",
    mode: "running",
    startedAt: 1_000,
    pausedAt: null,
    pausedElapsedSeconds: null,
    updatedAt: 1_000,
  });
  assert.deepEqual(replay, first);
  assert.deepEqual(readStageSnapshot(database, "evento"), first);
  const commandCount = database
    .prepare("select count(*) as count from stage_commands")
    .get() as { count: number };

  assert.equal(commandCount.count, 1);
});

test("comandos com versao desatualizada nao alteram o palco", () => {
  const database = createDatabase();
  applyStageCommand(
    database,
    "evento",
    { blockId: "bloco", commandId: "inicio", expectedVersion: 0, type: "start" },
    1_000,
  );

  assert.throws(
    () =>
      applyStageCommand(
        database,
        "evento",
        { commandId: "pausa", expectedVersion: 0, type: "pause" },
        2_000,
      ),
    (error: unknown) =>
      error instanceof StageStateError && error.code === "version_conflict",
  );
  assert.equal(readStageSnapshot(database, "evento").version, 1);
});
