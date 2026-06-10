CREATE TABLE `posts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`content` text NOT NULL,
	`dateOriginal` timestamp NOT NULL,
	`datePublished` timestamp NOT NULL DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `posts_id` PRIMARY KEY(`id`)
);
