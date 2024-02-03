/*
  Warnings:

  - The primary key for the `DTETipoInvalidacion` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id_tipo_establecimiento` on the `DTETipoInvalidacion` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "DTETipoInvalidacion" DROP CONSTRAINT "DTETipoInvalidacion_pkey",
DROP COLUMN "id_tipo_establecimiento",
ADD COLUMN     "id_tipo_invalidacion" SERIAL NOT NULL,
ADD CONSTRAINT "DTETipoInvalidacion_pkey" PRIMARY KEY ("id_tipo_invalidacion");
