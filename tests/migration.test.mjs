import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import Database from "better-sqlite3";

const currentDirectory = path.dirname(fileURLToPath(import.meta.url));
const migrationsDirectory = path.resolve(currentDirectory, "../drizzle");

test("as migracoes criam as tabelas do dominio e o registro idempotente", () => {
  const database = new Database(":memory:");
  const migrations = fs
    .readdirSync(migrationsDirectory)
    .filter((file) => file.endsWith(".sql"))
    .sort();

  assert.ok(migrations.length > 0, "A primeira migracao deve existir.");

  for (const migration of migrations) {
    database.exec(
      fs.readFileSync(path.join(migrationsDirectory, migration), "utf8"),
    );
  }

  const tables = database
    .prepare(
      "select name from sqlite_master where type = 'table' order by name",
    )
    .all()
    .map((row) => row.name);

  assert.deepEqual(tables, [
    "event_reports",
    "events",
    "message_cues",
    "stage_commands",
    "stage_states",
    "time_blocks",
  ]);

  database
    .prepare(
      `insert into events (
        id, title, scheduled_at, display_mode, status, created_at, updated_at
      ) values ('evento', 'Evento', 0, 'timer', 'draft', 0, 0)`,
    )
    .run();
  database
    .prepare(
      `insert into stage_commands (
        event_id, command_id, command_type, result_version, snapshot_json, created_at
      ) values ('evento', 'comando', 'start', 1, '{}', 0)`,
    )
    .run();

  assert.throws(
    () =>
      database
        .prepare(
          `insert into stage_commands (
            event_id, command_id, command_type, result_version, snapshot_json, created_at
          ) values ('evento', 'comando', 'start', 1, '{}', 0)`,
        )
        .run(),
    /UNIQUE constraint failed/,
  );
});
