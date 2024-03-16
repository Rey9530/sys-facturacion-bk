-- AlterTable
ALTER TABLE "Facturas" ADD COLUMN     "recintoFiscal" TEXT DEFAULT '',
ADD COLUMN     "regimen" TEXT DEFAULT '',
ADD COLUMN     "tipoItemExpor" INTEGER DEFAULT 0;
