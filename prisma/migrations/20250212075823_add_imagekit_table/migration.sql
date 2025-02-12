/*
  Warnings:

  - You are about to drop the column `icon` on the `category` table. All the data in the column will be lost.
  - You are about to drop the column `bankLogo` on the `package_bank` table. All the data in the column will be lost.
  - You are about to drop the column `paymentProof` on the `package_booking` table. All the data in the column will be lost.
  - You are about to drop the column `photo` on the `package_photo` table. All the data in the column will be lost.
  - You are about to drop the column `thumbnail` on the `package_tour` table. All the data in the column will be lost.
  - You are about to drop the column `avatar` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `category` DROP COLUMN `icon`;

-- AlterTable
ALTER TABLE `package_bank` DROP COLUMN `bankLogo`;

-- AlterTable
ALTER TABLE `package_booking` DROP COLUMN `paymentProof`;

-- AlterTable
ALTER TABLE `package_photo` DROP COLUMN `photo`;

-- AlterTable
ALTER TABLE `package_tour` DROP COLUMN `thumbnail`,
    MODIFY `thumbnailId` VARCHAR(255) NULL;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `avatar`;

-- CreateTable
CREATE TABLE `ImageKit` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `fileId` VARCHAR(191) NOT NULL,
    `fileName` VARCHAR(191) NULL,
    `filePath` VARCHAR(191) NOT NULL,
    `url` VARCHAR(191) NOT NULL,
    `width` INTEGER NULL,
    `height` INTEGER NULL,
    `format` VARCHAR(191) NULL,
    `size` INTEGER NULL,
    `type` VARCHAR(191) NOT NULL,
    `relatedId` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `ImageKit_fileId_key`(`fileId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
