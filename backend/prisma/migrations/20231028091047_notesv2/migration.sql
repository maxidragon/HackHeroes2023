/*
  Warnings:

  - You are about to drop the column `categoryId` on the `Note` table. All the data in the column will be lost.
  - You are about to drop the `NoteCategory` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `category` to the `Note` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Note` DROP FOREIGN KEY `Note_categoryId_fkey`;

-- DropForeignKey
ALTER TABLE `NoteCategory` DROP FOREIGN KEY `NoteCategory_userId_fkey`;

-- AlterTable
ALTER TABLE `Note` DROP COLUMN `categoryId`,
    ADD COLUMN `Publicity` ENUM('PUBLIC', 'PRIVATE', 'CLASS') NOT NULL DEFAULT 'PRIVATE',
    ADD COLUMN `category` ENUM('MATH', 'ENGLISH', 'GERMAN', 'FRENCH', 'BIOLOGY', 'CHEMISTRY', 'PHYSICS', 'HISTORY', 'GEOGRAPHY', 'POLITICS', 'ECONOMICS', 'PHILOSOPHY', 'RELIGION', 'SPORT', 'MUSIC', 'ART', 'COMPUTER_SCIENCE', 'OTHER') NOT NULL,
    ADD COLUMN `isMd` BOOLEAN NOT NULL DEFAULT false;

-- DropTable
DROP TABLE `NoteCategory`;
