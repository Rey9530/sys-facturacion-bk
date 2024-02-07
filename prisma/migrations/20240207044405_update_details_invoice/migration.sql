/*
  Warnings:

  - You are about to drop the `DTECodigoDeActividadEconomica` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "MovimientoDetalleFactura" AS ENUM ('GRABADO', 'EXENTA', 'NOSUJETO');

-- AlterTable
ALTER TABLE "FacturasDetalle" ADD COLUMN     "precio_unitario" DOUBLE PRECISION DEFAULT 0,
ADD COLUMN     "tipo_detalle" "MovimientoDetalleFactura" NOT NULL DEFAULT 'GRABADO',
ADD COLUMN     "venta_exenta" DOUBLE PRECISION DEFAULT 0,
ADD COLUMN     "venta_grabada" DOUBLE PRECISION DEFAULT 0,
ADD COLUMN     "venta_nosujeto" DOUBLE PRECISION DEFAULT 0;

-- DropTable
DROP TABLE "DTECodigoDeActividadEconomica";
