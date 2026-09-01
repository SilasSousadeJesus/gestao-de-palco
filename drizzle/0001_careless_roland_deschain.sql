CREATE TABLE `stage_commands` (
	`event_id` text NOT NULL,
	`command_id` text NOT NULL,
	`command_type` text NOT NULL,
	`result_version` integer NOT NULL,
	`snapshot_json` text NOT NULL,
	`created_at` integer NOT NULL,
	PRIMARY KEY(`event_id`, `command_id`),
	FOREIGN KEY (`event_id`) REFERENCES `events`(`id`) ON UPDATE no action ON DELETE cascade
);
