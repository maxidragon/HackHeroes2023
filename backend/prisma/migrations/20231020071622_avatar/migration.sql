-- AlterTable
ALTER TABLE `User` ADD COLUMN `avatar` LONGBLOB NULL,
    ADD COLUMN `banner` LONGBLOB NULL,
    ADD COLUMN `description` VARCHAR(191) NULL;
