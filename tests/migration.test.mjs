import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import Database from "better-sqlite3";

const currentDirectory = path.dirname(fileURLToPath(import.meta.url));
const migrationsDirectory = path.resolve(currentDirectory, "../drizzle");

test("a migracao inicial cria as tabelas do dominio", () => {
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
    "stage_states",
    "time_blocks",
  ]);
});
