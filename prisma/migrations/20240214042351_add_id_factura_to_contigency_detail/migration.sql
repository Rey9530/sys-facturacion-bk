-- AddForeignKey
ALTER TABLE "ContingenciasDetalle" ADD CONSTRAINT "fk_contoigencia_factura" FOREIGN KEY ("id_factura") REFERENCES "Facturas"("id_factura") ON DELETE NO ACTION ON UPDATE NO ACTION;
