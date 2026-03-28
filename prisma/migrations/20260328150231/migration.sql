/*
  Warnings:

  - The `entitySelector` column on the `AuditEvent` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "AuditEvent" DROP COLUMN "entitySelector",
ADD COLUMN     "entitySelector" JSONB;
