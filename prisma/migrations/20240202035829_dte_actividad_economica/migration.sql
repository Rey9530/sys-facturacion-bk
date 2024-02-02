/*
  Warnings:

  - You are about to drop the column `cod_actividad` on the `Cliente` table. All the data in the column will be lost.
  - You are about to drop the column `desc_actividad` on the `Cliente` table. All the data in the column will be lost.
  - You are about to drop the column `num_ducumento_identificacion` on the `Cliente` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Cliente" DROP COLUMN "cod_actividad",
DROP COLUMN "desc_actividad",
DROP COLUMN "num_ducumento_identificacion",
ADD COLUMN     "id_actividad_economica" INTEGER;

-- AddForeignKey
ALTER TABLE "Cliente" ADD CONSTRAINT "fk_cliente_actividad_economica" FOREIGN KEY ("id_actividad_economica") REFERENCES "DTEActividadEconomica"("id_actividad") ON DELETE NO ACTION ON UPDATE NO ACTION;
