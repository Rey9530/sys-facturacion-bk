/*
  Warnings:

  - The `version` column on the `FacturasTipos` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "FacturasTipos" DROP COLUMN "version",
ADD COLUMN     "version" INTEGER;
