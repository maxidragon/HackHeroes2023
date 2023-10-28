/*
  Warnings:

  - You are about to drop the column `Publicity` on the `Note` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Note` DROP COLUMN `Publicity`,
    ADD COLUMN `publicity` ENUM('PUBLIC', 'PRIVATE', 'CLASS') NOT NULL DEFAULT 'PRIVATE';
