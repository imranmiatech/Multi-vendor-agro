-- CreateEnum
CREATE TYPE "CATEGORY" AS ENUM ('NEW_ITEM', 'VINTAGE_ITEM');

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "sku" INTEGER,
    "material" TEXT,
    "location" TEXT,
    "condition" TEXT,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "image" TEXT[],
    "price" DOUBLE PRECISION,
    "specialPrice" DOUBLE PRECISION,
    "specialPriceFrom" TIMESTAMP(3),
    "specialPriceTo" TIMESTAMP(3),
    "stockQuantity" INTEGER,
    "allowedCurrency" TEXT[],
    "length" DOUBLE PRECISION,
    "height" DOUBLE PRECISION,
    "width" DOUBLE PRECISION,
    "weight" DOUBLE PRECISION,
    "description" TEXT,
    "story" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
