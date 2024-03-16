-- AlterTable
ALTER TABLE "Cliente" ADD COLUMN     "id_pais" INTEGER;

-- AddForeignKey
ALTER TABLE "Cliente" ADD CONSTRAINT "fk_cliente_pais" FOREIGN KEY ("id_pais") REFERENCES "DTEPais"("id_pais") ON DELETE NO ACTION ON UPDATE NO ACTION;
