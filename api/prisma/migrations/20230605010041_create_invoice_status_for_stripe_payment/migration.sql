-- CreateEnum
CREATE TYPE "InvoiceStatus" AS ENUM ('PENDING', 'COMPLETED');

-- AlterTable
ALTER TABLE "Invoice" ADD COLUMN     "status" "InvoiceStatus" NOT NULL DEFAULT 'PENDING';
