/*
  Warnings:

  - You are about to drop the `Category` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PackageBank` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PackageBooking` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PackagePhoto` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PackageReview` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PackageTour` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PackageTourCategory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Permission` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Role` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RolePermission` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserRole` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "PackageBooking" DROP CONSTRAINT "PackageBooking_packageBankId_fkey";

-- DropForeignKey
ALTER TABLE "PackageBooking" DROP CONSTRAINT "PackageBooking_packageTourId_fkey";

-- DropForeignKey
ALTER TABLE "PackageBooking" DROP CONSTRAINT "PackageBooking_userId_fkey";

-- DropForeignKey
ALTER TABLE "PackagePhoto" DROP CONSTRAINT "PackagePhoto_packageTourId_fkey";

-- DropForeignKey
ALTER TABLE "PackageReview" DROP CONSTRAINT "PackageReview_packageTourId_fkey";

-- DropForeignKey
ALTER TABLE "PackageReview" DROP CONSTRAINT "PackageReview_userId_fkey";

-- DropForeignKey
ALTER TABLE "PackageTour" DROP CONSTRAINT "PackageTour_createdBy_fkey";

-- DropForeignKey
ALTER TABLE "PackageTour" DROP CONSTRAINT "PackageTour_updatedBy_fkey";

-- DropForeignKey
ALTER TABLE "PackageTourCategory" DROP CONSTRAINT "PackageTourCategory_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "PackageTourCategory" DROP CONSTRAINT "PackageTourCategory_packageTourId_fkey";

-- DropForeignKey
ALTER TABLE "RolePermission" DROP CONSTRAINT "RolePermission_permissionId_fkey";

-- DropForeignKey
ALTER TABLE "RolePermission" DROP CONSTRAINT "RolePermission_roleId_fkey";

-- DropForeignKey
ALTER TABLE "TransactionAuditTrail" DROP CONSTRAINT "TransactionAuditTrail_packageBookingId_fkey";

-- DropForeignKey
ALTER TABLE "TransactionAuditTrail" DROP CONSTRAINT "TransactionAuditTrail_performedBy_fkey";

-- DropForeignKey
ALTER TABLE "UserRole" DROP CONSTRAINT "UserRole_roleId_fkey";

-- DropForeignKey
ALTER TABLE "UserRole" DROP CONSTRAINT "UserRole_userId_fkey";

-- DropTable
DROP TABLE "Category";

-- DropTable
DROP TABLE "PackageBank";

-- DropTable
DROP TABLE "PackageBooking";

-- DropTable
DROP TABLE "PackagePhoto";

-- DropTable
DROP TABLE "PackageReview";

-- DropTable
DROP TABLE "PackageTour";

-- DropTable
DROP TABLE "PackageTourCategory";

-- DropTable
DROP TABLE "Permission";

-- DropTable
DROP TABLE "Role";

-- DropTable
DROP TABLE "RolePermission";

-- DropTable
DROP TABLE "User";

-- DropTable
DROP TABLE "UserRole";

-- CreateTable
CREATE TABLE "Users" (
    "id" SERIAL NOT NULL,
    "avatar" TEXT NOT NULL,
    "fullName" VARCHAR(255) NOT NULL,
    "username" VARCHAR(100) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "phone" VARCHAR(15),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "lastLogin" TIMESTAMP(3),

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Categories" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "icon" VARCHAR(255),
    "slug" VARCHAR(100) NOT NULL,

    CONSTRAINT "Categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PackageTours" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "slug" VARCHAR(100) NOT NULL,
    "thumbnail" VARCHAR(255),
    "price" DECIMAL(10,2) NOT NULL,
    "days" INTEGER NOT NULL,
    "isRecommended" BOOLEAN NOT NULL DEFAULT false,
    "city" VARCHAR(100),
    "province" VARCHAR(100),
    "country" VARCHAR(100),
    "about" TEXT,
    "createdBy" INTEGER NOT NULL,
    "updatedBy" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "rating" DECIMAL(2,1) NOT NULL DEFAULT 0.0,

    CONSTRAINT "PackageTours_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PackageTourCategories" (
    "categoryId" INTEGER NOT NULL,
    "packageTourId" INTEGER NOT NULL,

    CONSTRAINT "PackageTourCategories_pkey" PRIMARY KEY ("categoryId","packageTourId")
);

-- CreateTable
CREATE TABLE "PackagePhotos" (
    "id" SERIAL NOT NULL,
    "packageTourId" INTEGER NOT NULL,
    "photo" VARCHAR(255) NOT NULL,

    CONSTRAINT "PackagePhotos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PackageBanks" (
    "id" SERIAL NOT NULL,
    "bankName" VARCHAR(100) NOT NULL,
    "bankAccountName" VARCHAR(255) NOT NULL,
    "bankAccountNumber" VARCHAR(20) NOT NULL,
    "bankLogo" VARCHAR(255),

    CONSTRAINT "PackageBanks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PackageBookings" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "packageTourId" INTEGER NOT NULL,
    "packageBankId" INTEGER,
    "quantity" INTEGER NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "isPaid" BOOLEAN NOT NULL DEFAULT false,
    "totalAmount" DECIMAL(10,2) NOT NULL,
    "paymentProof" VARCHAR(255),
    "subTotal" DECIMAL(10,2) NOT NULL,
    "insurance" DECIMAL(10,2) NOT NULL,
    "tax" DECIMAL(10,2) NOT NULL,
    "status" VARCHAR(50) NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "confirmedPaidAt" TIMESTAMP(3),

    CONSTRAINT "PackageBookings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Roles" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" VARCHAR(255),

    CONSTRAINT "Roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Permissions" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "action" VARCHAR(100) NOT NULL,
    "subject" VARCHAR(100) NOT NULL,
    "conditions" VARCHAR(255),
    "inverted" BOOLEAN NOT NULL DEFAULT false,
    "reason" VARCHAR(255),

    CONSTRAINT "Permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserRoles" (
    "userId" INTEGER NOT NULL,
    "roleId" INTEGER NOT NULL,

    CONSTRAINT "UserRoles_pkey" PRIMARY KEY ("userId","roleId")
);

-- CreateTable
CREATE TABLE "RolePermissions" (
    "roleId" INTEGER NOT NULL,
    "permissionId" INTEGER NOT NULL,

    CONSTRAINT "RolePermissions_pkey" PRIMARY KEY ("roleId","permissionId")
);

-- CreateTable
CREATE TABLE "PackageReviews" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "packageTourId" INTEGER NOT NULL,
    "Rating scale: 1-5" INTEGER NOT NULL,
    "comment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PackageReviews_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_username_key" ON "Users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Categories_slug_key" ON "Categories"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "PackageTours_slug_key" ON "PackageTours"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "PackageReviews_userId_packageTourId_key" ON "PackageReviews"("userId", "packageTourId");

-- AddForeignKey
ALTER TABLE "PackageTours" ADD CONSTRAINT "PackageTours_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PackageTours" ADD CONSTRAINT "PackageTours_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "Users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PackageTourCategories" ADD CONSTRAINT "PackageTourCategories_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PackageTourCategories" ADD CONSTRAINT "PackageTourCategories_packageTourId_fkey" FOREIGN KEY ("packageTourId") REFERENCES "PackageTours"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PackagePhotos" ADD CONSTRAINT "PackagePhotos_packageTourId_fkey" FOREIGN KEY ("packageTourId") REFERENCES "PackageTours"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PackageBookings" ADD CONSTRAINT "PackageBookings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PackageBookings" ADD CONSTRAINT "PackageBookings_packageTourId_fkey" FOREIGN KEY ("packageTourId") REFERENCES "PackageTours"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PackageBookings" ADD CONSTRAINT "PackageBookings_packageBankId_fkey" FOREIGN KEY ("packageBankId") REFERENCES "PackageBanks"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRoles" ADD CONSTRAINT "UserRoles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRoles" ADD CONSTRAINT "UserRoles_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RolePermissions" ADD CONSTRAINT "RolePermissions_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RolePermissions" ADD CONSTRAINT "RolePermissions_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "Permissions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PackageReviews" ADD CONSTRAINT "PackageReviews_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PackageReviews" ADD CONSTRAINT "PackageReviews_packageTourId_fkey" FOREIGN KEY ("packageTourId") REFERENCES "PackageTours"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransactionAuditTrail" ADD CONSTRAINT "TransactionAuditTrail_packageBookingId_fkey" FOREIGN KEY ("packageBookingId") REFERENCES "PackageBookings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransactionAuditTrail" ADD CONSTRAINT "TransactionAuditTrail_performedBy_fkey" FOREIGN KEY ("performedBy") REFERENCES "Users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
