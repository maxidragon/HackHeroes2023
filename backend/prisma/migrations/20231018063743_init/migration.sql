-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `username` VARCHAR(191) NULL,
    `password` VARCHAR(191) NOT NULL,
    `restURLId` INTEGER NULL,
    `certificate` VARCHAR(191) NULL,
    `fingerprint` VARCHAR(191) NULL,
    `privateKey` VARCHAR(191) NULL,
    `firebaseToken` VARCHAR(191) NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RestURL` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `url` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `RestURL_url_key`(`url`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_restURLId_fkey` FOREIGN KEY (`restURLId`) REFERENCES `RestURL`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
