-- AlterTable
ALTER TABLE "Usuarios" ADD COLUMN     "id_tipo_documento" INTEGER;

-- AddForeignKey
ALTER TABLE "Usuarios" ADD CONSTRAINT "fk_usuario_tipo_documento" FOREIGN KEY ("id_tipo_documento") REFERENCES "DTETipoDocumentoIdentificacion"("id_tipo_documento") ON DELETE NO ACTION ON UPDATE NO ACTION;
