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
    activeMessageContent: null,
    messageExpiresAt: null,
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

test("tempo decorrido persiste corretamente apos um ciclo de pausa e retomada", () => {
  const database = createDatabase();
  applyStageCommand(
    database,
    "evento",
    { blockId: "bloco", commandId: "inicio", expectedVersion: 0, type: "start" },
    0,
  );

  const paused = applyStageCommand(
    database,
    "evento",
    { commandId: "pausa", expectedVersion: 1, type: "pause" },
    10_000,
  );

  assert.equal(paused.mode, "paused");
  assert.equal(paused.eventElapsedSeconds, 10);
  assert.equal(paused.pausedElapsedSeconds, 10);

  const resumed = applyStageCommand(
    database,
    "evento",
    { commandId: "retomada", expectedVersion: 2, type: "resume" },
    15_000,
  );

  assert.equal(resumed.mode, "running");
  assert.equal(resumed.eventElapsedSeconds, 0);
  assert.equal(resumed.startedAt, 5_000);

  const pausedAgain = applyStageCommand(
    database,
    "evento",
    { commandId: "pausa-2", expectedVersion: 3, type: "pause" },
    25_000,
  );

  assert.equal(pausedAgain.mode, "paused");
  assert.equal(pausedAgain.eventElapsedSeconds, 20);
});

test("limpar palco preserva o tempo decorrido por padrao, mas zera quando resetElapsed e pedido", () => {
  const database = createDatabase();
  applyStageCommand(
    database,
    "evento",
    { blockId: "bloco", commandId: "inicio", expectedVersion: 0, type: "start" },
    0,
  );

  const clearedWithoutReset = applyStageCommand(
    database,
    "evento",
    { commandId: "limpar-1", expectedVersion: 1, type: "clear" },
    10_000,
  );

  assert.equal(clearedWithoutReset.mode, "idle");
  assert.equal(clearedWithoutReset.activeBlockId, null);
  assert.equal(clearedWithoutReset.eventElapsedSeconds, 10);

  applyStageCommand(
    database,
    "evento",
    { blockId: "bloco", commandId: "inicio-2", expectedVersion: 2, type: "start" },
    12_000,
  );

  const clearedWithReset = applyStageCommand(
    database,
    "evento",
    { commandId: "limpar-2", expectedVersion: 3, type: "clear", resetElapsed: true },
    20_000,
  );

  assert.equal(clearedWithReset.mode, "idle");
  assert.equal(clearedWithReset.eventElapsedSeconds, 0);
});

test("trocar de bloco acumula actual_seconds do bloco anterior; limpar palco com resetElapsed zera todos os blocos", () => {
  const database = createDatabase();
  database
    .prepare(
      `insert into time_blocks (
        id, event_id, title, duration_seconds, position, is_sequential, created_at, updated_at
      ) values ('bloco-2', 'evento', 'Bloco 2', 120, 1, 0, 0, 0)`,
    )
    .run();

  const actualSecondsOf = (blockId: string) =>
    (database.prepare("select actual_seconds as actualSeconds from time_blocks where id = ?").get(blockId) as { actualSeconds: number | null })
      .actualSeconds;

  applyStageCommand(
    database,
    "evento",
    { blockId: "bloco", commandId: "inicio", expectedVersion: 0, type: "start" },
    0,
  );

  applyStageCommand(
    database,
    "evento",
    { blockId: "bloco-2", commandId: "troca", expectedVersion: 1, type: "start" },
    10_000,
  );

  assert.equal(actualSecondsOf("bloco"), 10);

  applyStageCommand(
    database,
    "evento",
    { commandId: "limpar-1", expectedVersion: 2, type: "clear" },
    15_000,
  );

  assert.equal(actualSecondsOf("bloco-2"), 5);
  assert.equal(actualSecondsOf("bloco"), 10);

  applyStageCommand(
    database,
    "evento",
    { blockId: "bloco", commandId: "inicio-2", expectedVersion: 3, type: "start" },
    16_000,
  );
  const finalSnapshot = applyStageCommand(
    database,
    "evento",
    { commandId: "limpar-2", expectedVersion: 4, type: "clear", resetElapsed: true },
    20_000,
  );

  assert.equal(actualSecondsOf("bloco"), null);
  assert.equal(actualSecondsOf("bloco-2"), null);
  assert.equal(finalSnapshot.eventElapsedSeconds, 0);
});

test("finalizar um bloco para o cronometro, marca finished_at e bloqueia iniciar ou finalizar de novo", () => {
  const database = createDatabase();

  const finishedAtOf = (blockId: string) =>
    (database.prepare("select finished_at as finishedAt from time_blocks where id = ?").get(blockId) as { finishedAt: number | null })
      .finishedAt;

  applyStageCommand(
    database,
    "evento",
    { blockId: "bloco", commandId: "inicio", expectedVersion: 0, type: "start" },
    0,
  );

  const finished = applyStageCommand(
    database,
    "evento",
    { blockId: "bloco", commandId: "finalizar", expectedVersion: 1, type: "finish" },
    8_000,
  );

  assert.equal(finished.mode, "idle");
  assert.equal(finished.activeBlockId, null);
  assert.equal(finished.eventElapsedSeconds, 8);
  assert.equal(finishedAtOf("bloco"), 8_000);

  assert.throws(
    () =>
      applyStageCommand(
        database,
        "evento",
        { blockId: "bloco", commandId: "reiniciar", expectedVersion: 2, type: "start" },
        9_000,
      ),
    (error: unknown) => error instanceof StageStateError && error.code === "invalid_state",
  );

  assert.throws(
    () =>
      applyStageCommand(
        database,
        "evento",
        { blockId: "bloco", commandId: "finalizar-de-novo", expectedVersion: 2, type: "finish" },
        9_000,
      ),
    (error: unknown) => error instanceof StageStateError && error.code === "invalid_state",
  );

  assert.equal(readStageSnapshot(database, "evento").version, 2);
});
