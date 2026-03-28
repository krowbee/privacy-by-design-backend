/*
  Warnings:

  - You are about to drop the column `entityId` on the `AuditEvent` table. All the data in the column will be lost.
  - Added the required column `category` to the `AuditEvent` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "EventCategories" AS ENUM ('SECURITY', 'CRUD', 'ERROR');

-- AlterTable
ALTER TABLE "AuditEvent" DROP COLUMN "entityId",
ADD COLUMN     "category" "EventCategories" NOT NULL,
ADD COLUMN     "entitySelector" TEXT;
