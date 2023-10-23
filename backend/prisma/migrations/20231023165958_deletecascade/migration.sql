-- DropForeignKey
ALTER TABLE `FlashCard` DROP FOREIGN KEY `FlashCard_setId_fkey`;

-- DropForeignKey
ALTER TABLE `Note` DROP FOREIGN KEY `Note_categoryId_fkey`;

-- AddForeignKey
ALTER TABLE `FlashCard` ADD CONSTRAINT `FlashCard_setId_fkey` FOREIGN KEY (`setId`) REFERENCES `FlashCardSet`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Note` ADD CONSTRAINT `Note_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `NoteCategory`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
