/*
  Warnings:

  - You are about to drop the `TransactionAuditTrail` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "TransactionAuditTrail" DROP CONSTRAINT "TransactionAuditTrail_packageBookingId_fkey";

-- DropForeignKey
ALTER TABLE "TransactionAuditTrail" DROP CONSTRAINT "TransactionAuditTrail_performedBy_fkey";

-- DropTable
DROP TABLE "TransactionAuditTrail";

-- CreateTable
CREATE TABLE "TransactionAuditTrails" (
    "id" SERIAL NOT NULL,
    "packageBookingId" INTEGER NOT NULL,
    "action" VARCHAR(50) NOT NULL,
    "performedBy" INTEGER,
    "performedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "details" TEXT,

    CONSTRAINT "TransactionAuditTrails_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TransactionAuditTrails" ADD CONSTRAINT "TransactionAuditTrails_packageBookingId_fkey" FOREIGN KEY ("packageBookingId") REFERENCES "PackageBookings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransactionAuditTrails" ADD CONSTRAINT "TransactionAuditTrails_performedBy_fkey" FOREIGN KEY ("performedBy") REFERENCES "Users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
