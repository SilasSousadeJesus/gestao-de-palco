import {
  integer,
  primaryKey,
  sqliteTable,
  text,
} from "drizzle-orm/sqlite-core";

export const events = sqliteTable("events", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  scheduledAt: integer("scheduled_at", { mode: "timestamp_ms" }).notNull(),
  displayMode: text("display_mode").notNull(),
  status: text("status").notNull().default("draft"),
  notes: text("notes"),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull(),
});

export const timeBlocks = sqliteTable("time_blocks", {
  id: text("id").primaryKey(),
  eventId: text("event_id")
    .notNull()
    .references(() => events.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  durationSeconds: integer("duration_seconds").notNull(),
  actualSeconds: integer("actual_seconds"),
  finishedAt: integer("finished_at", { mode: "timestamp_ms" }),
  position: integer("position").notNull(),
  isSequential: integer("is_sequential", { mode: "boolean" })
    .notNull()
    .default(false),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull(),
});

export const messageCues = sqliteTable("message_cues", {
  id: text("id").primaryKey(),
  eventId: text("event_id")
    .notNull()
    .references(() => events.id, { onDelete: "cascade" }),
  blockId: text("block_id").references(() => timeBlocks.id, {
    onDelete: "set null",
  }),
  content: text("content").notNull(),
  kind: text("kind").notNull(),
  triggerType: text("trigger_type").notNull(),
  triggerOffsetSeconds: integer("trigger_offset_seconds"),
  durationSeconds: integer("duration_seconds"),
  position: integer("position").notNull().default(0),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull(),
});

export const stageStates = sqliteTable("stage_states", {
  eventId: text("event_id")
    .primaryKey()
    .references(() => events.id, { onDelete: "cascade" }),
  version: integer("version").notNull().default(0),
  eventElapsedSeconds: integer("event_elapsed_seconds").notNull().default(0),
  activeBlockId: text("active_block_id").references(() => timeBlocks.id, {
    onDelete: "set null",
  }),
  activeMessageId: text("active_message_id").references(() => messageCues.id, {
    onDelete: "set null",
  }),
  activeMessageContent: text("active_message_content"),
  messageExpiresAt: integer("message_expires_at", { mode: "timestamp_ms" }),
  mode: text("mode").notNull().default("idle"),
  startedAt: integer("started_at", { mode: "timestamp_ms" }),
  pausedAt: integer("paused_at", { mode: "timestamp_ms" }),
  pausedElapsedSeconds: integer("paused_elapsed_seconds"),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull(),
});

export const stageCommands = sqliteTable(
  "stage_commands",
  {
    eventId: text("event_id")
      .notNull()
      .references(() => events.id, { onDelete: "cascade" }),
    commandId: text("command_id").notNull(),
    commandType: text("command_type").notNull(),
    resultVersion: integer("result_version").notNull(),
    snapshotJson: text("snapshot_json").notNull(),
    createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
  },
  (table) => [primaryKey({ columns: [table.eventId, table.commandId] })],
);

export const eventReports = sqliteTable("event_reports", {
  eventId: text("event_id")
    .primaryKey()
    .references(() => events.id, { onDelete: "cascade" }),
  content: text("content").notNull().default(""),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull(),
});
