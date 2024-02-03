-- AlterTable
ALTER TABLE "Facturas" ADD COLUMN     "dte_errores" TEXT,
ADD COLUMN     "dte_procesado" BOOLEAN NOT NULL DEFAULT false;
