-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "fullname" VARCHAR(255) NOT NULL,
    "username" VARCHAR(100) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "phone" VARCHAR(15),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "lastLogin" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "icon" VARCHAR(255),
    "slug" VARCHAR(100) NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PackageTour" (
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

    CONSTRAINT "PackageTour_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PackageTourCategory" (
    "categoryId" INTEGER NOT NULL,
    "packageTourId" INTEGER NOT NULL,

    CONSTRAINT "PackageTourCategory_pkey" PRIMARY KEY ("categoryId","packageTourId")
);

-- CreateTable
CREATE TABLE "PackagePhoto" (
    "id" SERIAL NOT NULL,
    "packageTourId" INTEGER NOT NULL,
    "photo" VARCHAR(255) NOT NULL,

    CONSTRAINT "PackagePhoto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PackageBank" (
    "id" SERIAL NOT NULL,
    "bankName" VARCHAR(100) NOT NULL,
    "bankAccountName" VARCHAR(255) NOT NULL,
    "bankAccountNumber" VARCHAR(20) NOT NULL,
    "bankLogo" VARCHAR(255),

    CONSTRAINT "PackageBank_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PackageBooking" (
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

    CONSTRAINT "PackageBooking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Role" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" VARCHAR(255),

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Permission" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "action" VARCHAR(100) NOT NULL,
    "subject" VARCHAR(100) NOT NULL,
    "conditions" VARCHAR(255),
    "inverted" BOOLEAN NOT NULL DEFAULT false,
    "reason" VARCHAR(255),

    CONSTRAINT "Permission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserRole" (
    "userId" INTEGER NOT NULL,
    "roleId" INTEGER NOT NULL,

    CONSTRAINT "UserRole_pkey" PRIMARY KEY ("userId","roleId")
);

-- CreateTable
CREATE TABLE "RolePermission" (
    "roleId" INTEGER NOT NULL,
    "permissionId" INTEGER NOT NULL,

    CONSTRAINT "RolePermission_pkey" PRIMARY KEY ("roleId","permissionId")
);

-- CreateTable
CREATE TABLE "PackageReview" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "packageTourId" INTEGER NOT NULL,
    "Rating scale: 1-5" INTEGER NOT NULL,
    "comment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PackageReview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TransactionAuditTrail" (
    "id" SERIAL NOT NULL,
    "packageBookingId" INTEGER NOT NULL,
    "action" VARCHAR(50) NOT NULL,
    "performedBy" INTEGER,
    "performedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "details" TEXT,

    CONSTRAINT "TransactionAuditTrail_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Category_slug_key" ON "Category"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "PackageTour_slug_key" ON "PackageTour"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "PackageReview_userId_packageTourId_key" ON "PackageReview"("userId", "packageTourId");

-- AddForeignKey
ALTER TABLE "PackageTour" ADD CONSTRAINT "PackageTour_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PackageTour" ADD CONSTRAINT "PackageTour_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PackageTourCategory" ADD CONSTRAINT "PackageTourCategory_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PackageTourCategory" ADD CONSTRAINT "PackageTourCategory_packageTourId_fkey" FOREIGN KEY ("packageTourId") REFERENCES "PackageTour"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PackagePhoto" ADD CONSTRAINT "PackagePhoto_packageTourId_fkey" FOREIGN KEY ("packageTourId") REFERENCES "PackageTour"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PackageBooking" ADD CONSTRAINT "PackageBooking_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PackageBooking" ADD CONSTRAINT "PackageBooking_packageTourId_fkey" FOREIGN KEY ("packageTourId") REFERENCES "PackageTour"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PackageBooking" ADD CONSTRAINT "PackageBooking_packageBankId_fkey" FOREIGN KEY ("packageBankId") REFERENCES "PackageBank"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRole" ADD CONSTRAINT "UserRole_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRole" ADD CONSTRAINT "UserRole_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RolePermission" ADD CONSTRAINT "RolePermission_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RolePermission" ADD CONSTRAINT "RolePermission_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "Permission"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PackageReview" ADD CONSTRAINT "PackageReview_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PackageReview" ADD CONSTRAINT "PackageReview_packageTourId_fkey" FOREIGN KEY ("packageTourId") REFERENCES "PackageTour"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransactionAuditTrail" ADD CONSTRAINT "TransactionAuditTrail_packageBookingId_fkey" FOREIGN KEY ("packageBookingId") REFERENCES "PackageBooking"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransactionAuditTrail" ADD CONSTRAINT "TransactionAuditTrail_performedBy_fkey" FOREIGN KEY ("performedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
