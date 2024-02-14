-- AlterTable
ALTER TABLE "Contingencias" ADD COLUMN     "id_usuario" INTEGER;

-- AlterTable
ALTER TABLE "ContingenciasDetalle" ADD COLUMN     "id_contingencia" INTEGER;

-- AddForeignKey
ALTER TABLE "Contingencias" ADD CONSTRAINT "fk_contingencia_usuario" FOREIGN KEY ("id_usuario") REFERENCES "Usuarios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ContingenciasDetalle" ADD CONSTRAINT "fk_contoigencia_detalle_contingencia" FOREIGN KEY ("id_contingencia") REFERENCES "Contingencias"("id_contingencia") ON DELETE NO ACTION ON UPDATE NO ACTION;
