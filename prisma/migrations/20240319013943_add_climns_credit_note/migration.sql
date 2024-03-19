-- AlterTable
ALTER TABLE "Facturas" ADD COLUMN     "notadebito_dte_json" TEXT DEFAULT '',
ADD COLUMN     "notadebito_fecha" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "notadebito_resp_dte_json" TEXT DEFAULT '';
