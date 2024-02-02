/*
  Warnings:

  - You are about to drop the column `nombreComercial` on the `GeneralData` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "GeneralData" DROP COLUMN "nombreComercial",
ADD COLUMN     "nombre_comercial" TEXT;
