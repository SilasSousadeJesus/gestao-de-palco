import { randomUUID } from "node:crypto";

import type Database from "better-sqlite3";

export type EventSummary = {
  id: string;
  title: string;
  scheduledAt: number;
  displayMode: "timer" | "messages";
  status: "draft" | "active" | "closed";
  notes: string | null;
  plannedSeconds: number;
};

export type TimeBlock = {
  id: string;
  eventId: string;
  title: string;
  durationSeconds: number;
  actualSeconds: number | null;
  finishedAt: number | null;
  position: number;
  isSequential: boolean;
};

function listBlocks(database: Database.Database, eventId: string) {
  return database
    .prepare(
      `select id, event_id as eventId, title, duration_seconds as durationSeconds,
        actual_seconds as actualSeconds, finished_at as finishedAt, position, is_sequential as isSequential from time_blocks
       where event_id = ? order by position, created_at`,
    )
    .all(eventId) as TimeBlock[];
}

export function listEvents(database: Database.Database): EventSummary[] {
  return database
    .prepare(
      `select e.id, e.title, e.scheduled_at as scheduledAt, e.display_mode as displayMode,
        e.status, e.notes, coalesce(sum(b.duration_seconds), 0) as plannedSeconds
       from events e left join time_blocks b on b.event_id = e.id
       group by e.id order by e.scheduled_at desc`,
    )
    .all() as EventSummary[];
}

export function getEvent(database: Database.Database, eventId: string) {
  const event = listEvents(database).find((item) => item.id === eventId);
  return event ? { ...event, blocks: listBlocks(database, eventId) } : null;
}

const EVENT_TITLE_MAX_LENGTH = 20;

export function createEvent(
  database: Database.Database,
  input: { title: string; scheduledAt?: number; displayMode?: "timer" | "messages" },
) {
  const id = randomUUID();
  const now = Date.now();
  const title = input.title.trim();
  if (!title) throw new Error("Informe o nome do evento.");
  if (title.length > EVENT_TITLE_MAX_LENGTH) throw new Error(`Nome do evento deve ter no maximo ${EVENT_TITLE_MAX_LENGTH} caracteres.`);
  database.transaction(() => {
    database.prepare(`insert into events (id, title, scheduled_at, display_mode, status, created_at, updated_at) values (?, ?, ?, ?, 'draft', ?, ?)`)
      .run(id, title, input.scheduledAt ?? now, input.displayMode ?? "timer", now, now);
    database.prepare("insert into stage_states (event_id, version, mode, updated_at) values (?, 0, 'idle', ?)")
      .run(id, now);
  })();
  return getEvent(database, id)!;
}

export function updateEventStatus(database: Database.Database, eventId: string, status: "draft" | "active" | "closed") {
  const result = database.prepare("update events set status = ?, updated_at = ? where id = ?").run(status, Date.now(), eventId);
  return result.changes ? getEvent(database, eventId) : null;
}

export function updateEventTitle(database: Database.Database, eventId: string, title: string) {
  const trimmed = title.trim();
  if (!trimmed) throw new Error("Informe o nome do evento.");
  if (trimmed.length > EVENT_TITLE_MAX_LENGTH) throw new Error(`Nome do evento deve ter no maximo ${EVENT_TITLE_MAX_LENGTH} caracteres.`);
  const result = database.prepare("update events set title = ?, updated_at = ? where id = ?").run(trimmed, Date.now(), eventId);
  return result.changes ? getEvent(database, eventId) : null;
}

export function deleteEvent(database: Database.Database, eventId: string) {
  const result = database.prepare("delete from events where id = ?").run(eventId);
  return result.changes > 0;
}

export function createBlock(database: Database.Database, eventId: string, input: { title: string; durationSeconds: number }) {
  const title = input.title.trim();
  if (!title || !Number.isInteger(input.durationSeconds) || input.durationSeconds < 1) throw new Error("Bloco invalido.");
  if (!getEvent(database, eventId)) return null;
  const position = (database.prepare("select count(*) as count from time_blocks where event_id = ?").get(eventId) as { count: number }).count;
  const now = Date.now();
  const block: TimeBlock = { id: randomUUID(), eventId, title, durationSeconds: input.durationSeconds, actualSeconds: null, finishedAt: null, position, isSequential: false };
  database.prepare(`insert into time_blocks (id, event_id, title, duration_seconds, position, is_sequential, created_at, updated_at) values (?, ?, ?, ?, ?, 0, ?, ?)`)
    .run(block.id, eventId, title, block.durationSeconds, position, now, now);
  return block;
}

export function deleteBlock(database: Database.Database, eventId: string, blockId: string) {
  const result = database.prepare("delete from time_blocks where id = ? and event_id = ?").run(blockId, eventId);
  return result.changes > 0;
}

export function updateBlock(
  database: Database.Database,
  eventId: string,
  blockId: string,
  input: { title?: string; durationSeconds?: number },
) {
  const current = listBlocks(database, eventId).find((block) => block.id === blockId);
  if (!current) return null;
  const title = input.title !== undefined ? input.title.trim() : current.title;
  const durationSeconds = input.durationSeconds ?? current.durationSeconds;
  if (!title || !Number.isInteger(durationSeconds) || durationSeconds < 1) throw new Error("Bloco invalido.");
  database.prepare("update time_blocks set title = ?, duration_seconds = ?, updated_at = ? where id = ? and event_id = ?")
    .run(title, durationSeconds, Date.now(), blockId, eventId);
  return { ...current, title, durationSeconds };
}
