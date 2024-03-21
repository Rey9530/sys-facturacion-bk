-- AlterTable
ALTER TABLE "Facturas" ADD COLUMN     "iva_retenido_dte_json" TEXT DEFAULT '',
ADD COLUMN     "iva_retenido_fecha" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "iva_retenido_resp_dte_json" TEXT DEFAULT '';
