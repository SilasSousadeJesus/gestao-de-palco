import fs from "node:fs";
import path from "node:path";

import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";

const configuredPath = process.env.DATABASE_URL ?? "./data/gestao-de-palco.db";
const databasePath = path.isAbsolute(configuredPath)
  ? configuredPath
  : path.resolve(/* turbopackIgnore: true */ process.cwd(), configuredPath);

fs.mkdirSync(path.dirname(databasePath), { recursive: true });

const sqlite = new Database(databasePath);

sqlite.pragma("foreign_keys = ON");
sqlite.pragma("journal_mode = WAL");

export const db = drizzle({ client: sqlite });
export { databasePath, sqlite };
