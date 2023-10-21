-- AlterTable
ALTER TABLE `User` MODIFY `fingerprint` LONGTEXT NULL,
    MODIFY `privateKey` LONGTEXT NULL,
    MODIFY `firebaseToken` LONGTEXT NULL;
