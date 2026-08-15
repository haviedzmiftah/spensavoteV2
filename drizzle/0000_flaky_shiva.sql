CREATE TABLE `candidates` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`candidate_number` int NOT NULL,
	`chairman_name` varchar(255) NOT NULL,
	`vice_chairman_name` varchar(255) NOT NULL,
	`vision` text NOT NULL,
	`mission` text NOT NULL,
	`photo_url` varchar(500),
	CONSTRAINT `candidates_id` PRIMARY KEY(`id`),
	CONSTRAINT `candidates_candidate_number_unique` UNIQUE(`candidate_number`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`username` varchar(255) NOT NULL,
	`password` varchar(255) NOT NULL,
	`role` varchar(50) NOT NULL DEFAULT 'voters',
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_username_unique` UNIQUE(`username`)
);
--> statement-breakpoint
CREATE TABLE `votes` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`candidate_id` int NOT NULL,
	`vote_date` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `votes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `votes` ADD CONSTRAINT `votes_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `votes` ADD CONSTRAINT `votes_candidate_id_candidates_id_fk` FOREIGN KEY (`candidate_id`) REFERENCES `candidates`(`id`) ON DELETE cascade ON UPDATE no action;