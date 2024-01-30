-- AlterTable
ALTER TABLE "CatalogoCategorias" ADD COLUMN     "id_categoria_padre" INTEGER;

-- AddForeignKey
ALTER TABLE "CatalogoCategorias" ADD CONSTRAINT "categoria_padre_fk" FOREIGN KEY ("id_categoria_padre") REFERENCES "CatalogoCategorias"("id_categoria") ON DELETE NO ACTION ON UPDATE NO ACTION;
