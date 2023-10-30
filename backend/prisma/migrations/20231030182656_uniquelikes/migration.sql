/*
  Warnings:

  - A unique constraint covering the columns `[noteId,userId]` on the table `NoteLike` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `NoteLike_noteId_userId_key` ON `NoteLike`(`noteId`, `userId`);
