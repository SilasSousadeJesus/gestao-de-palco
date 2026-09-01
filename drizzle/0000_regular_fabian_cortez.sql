CREATE TABLE `event_reports` (
	`event_id` text PRIMARY KEY NOT NULL,
	`content` text DEFAULT '' NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`event_id`) REFERENCES `events`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `events` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`scheduled_at` integer NOT NULL,
	`display_mode` text NOT NULL,
	`status` text DEFAULT 'draft' NOT NULL,
	`notes` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `message_cues` (
	`id` text PRIMARY KEY NOT NULL,
	`event_id` text NOT NULL,
	`block_id` text,
	`content` text NOT NULL,
	`kind` text NOT NULL,
	`trigger_type` text NOT NULL,
	`trigger_offset_seconds` integer,
	`duration_seconds` integer,
	`position` integer DEFAULT 0 NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`event_id`) REFERENCES `events`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`block_id`) REFERENCES `time_blocks`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE TABLE `stage_states` (
	`event_id` text PRIMARY KEY NOT NULL,
	`version` integer DEFAULT 0 NOT NULL,
	`active_block_id` text,
	`active_message_id` text,
	`mode` text DEFAULT 'idle' NOT NULL,
	`started_at` integer,
	`paused_at` integer,
	`paused_elapsed_seconds` integer,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`event_id`) REFERENCES `events`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`active_block_id`) REFERENCES `time_blocks`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`active_message_id`) REFERENCES `message_cues`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE TABLE `time_blocks` (
	`id` text PRIMARY KEY NOT NULL,
	`event_id` text NOT NULL,
	`title` text NOT NULL,
	`duration_seconds` integer NOT NULL,
	`position` integer NOT NULL,
	`is_sequential` integer DEFAULT false NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`event_id`) REFERENCES `events`(`id`) ON UPDATE no action ON DELETE cascade
);
