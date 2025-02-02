/*
  Warnings:

  - Added the required column `status` to the `package_bank` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `package_tour` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `package_bank` ADD COLUMN `status` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `package_booking` MODIFY `status` VARCHAR(50) NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE `package_tour` ADD COLUMN `status` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `status` VARCHAR(191) NOT NULL;
