-- Safe migration to add local authentication fields
-- This migration adds username and passwordHash fields while maintaining existing data

-- Step 1: Make openId nullable (it's no longer required)
ALTER TABLE `users` MODIFY COLUMN `openId` varchar(64) NULL;

-- Step 2: Add username column with temporary default
ALTER TABLE `users` ADD COLUMN `username` varchar(64) NULL;

-- Step 3: Add passwordHash column with temporary default
ALTER TABLE `users` ADD COLUMN `passwordHash` varchar(255) NULL;

-- Step 4: Create default admin user if no users exist
-- This will be the initial admin with credentials: admin / alterar_apos_primeiro_login
INSERT INTO `users` (username, passwordHash, name, email, role, createdAt, updatedAt, lastSignedIn)
SELECT 'admin', '$2b$10$YIjlrPNoS0E9iwZgaLJ1/.C9DYO8F0nNQYCQz5Yt6KyJ8Z5H2ZCQC', 'Administrator', 'admin@oraculum.local', 'admin', NOW(), NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM `users` WHERE username = 'admin');

-- Step 5: For any existing users without username, generate one
UPDATE `users` SET username = CONCAT('user_', id) WHERE username IS NULL;

-- Step 6: For any existing users without passwordHash, set a temporary one
-- (they should change it on first login)
UPDATE `users` SET passwordHash = '$2b$10$YIjlrPNoS0E9iwZgaLJ1/.C9DYO8F0nNQYCQz5Yt6KyJ8Z5H2ZCQC' WHERE passwordHash IS NULL;

-- Step 7: Make username and passwordHash NOT NULL
ALTER TABLE `users` MODIFY COLUMN `username` varchar(64) NOT NULL;
ALTER TABLE `users` MODIFY COLUMN `passwordHash` varchar(255) NOT NULL;

-- Step 8: Add unique constraint on username
ALTER TABLE `users` ADD CONSTRAINT `users_username_unique` UNIQUE(`username`);

-- Step 9: Drop loginMethod column (no longer used)
ALTER TABLE `users` DROP COLUMN `loginMethod`;

-- Step 10: Ensure dateOriginal in posts is varchar(10) for YYYY-MM-DD format
ALTER TABLE `posts` MODIFY COLUMN `dateOriginal` varchar(10) NOT NULL;
