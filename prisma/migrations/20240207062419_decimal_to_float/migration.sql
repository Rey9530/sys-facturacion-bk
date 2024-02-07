/*
  Warnings:

  - You are about to alter the column `precio_sin_iva` on the `Catalogo` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - You are about to alter the column `precio_con_iva` on the `Catalogo` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - You are about to alter the column `venta_bruta` on the `CierresDiarios` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - You are about to alter the column `para_llevar` on the `CierresDiarios` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - You are about to alter the column `tarjeta_credomatic` on the `CierresDiarios` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - You are about to alter the column `tarjeta_serfinza` on the `CierresDiarios` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - You are about to alter the column `tarjeta_promerica` on the `CierresDiarios` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - You are about to alter the column `bitcoin` on the `CierresDiarios` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - You are about to alter the column `syke` on the `CierresDiarios` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - You are about to alter the column `total_restante` on the `CierresDiarios` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - You are about to alter the column `propina` on the `CierresDiarios` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - You are about to alter the column `venta_nota_sin_iva` on the `CierresDiarios` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - You are about to alter the column `cortecia` on the `CierresDiarios` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - You are about to alter the column `anti_cobrados` on the `CierresDiarios` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - You are about to alter the column `anti_reservas` on the `CierresDiarios` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - You are about to alter the column `certificado_regalo` on the `CierresDiarios` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - You are about to alter the column `hugo_app` on the `CierresDiarios` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - You are about to alter the column `pedidos_ya` on the `CierresDiarios` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - You are about to alter the column `compras` on the `CierresDiarios` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - You are about to alter the column `entrega_efectivo` on the `CierresDiarios` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - You are about to alter the column `subtotal` on the `Compras` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - You are about to alter the column `descuento` on the `Compras` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - You are about to alter the column `cesc` on the `Compras` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - You are about to alter the column `fovial` on the `Compras` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - You are about to alter the column `cotrans` on the `Compras` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - You are about to alter the column `iva` on the `Compras` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - You are about to alter the column `iva_retenido` on the `Compras` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - You are about to alter the column `iva_percivido` on the `Compras` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - You are about to alter the column `total` on the `Compras` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - You are about to alter the column `costo_unitario` on the `ComprasDetalle` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - You are about to alter the column `cantidad` on the `ComprasDetalle` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - You are about to alter the column `subtotal` on the `ComprasDetalle` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - You are about to alter the column `descuento_porcentaje` on the `ComprasDetalle` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - You are about to alter the column `descuento_monto` on the `ComprasDetalle` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - You are about to alter the column `iva` on the `ComprasDetalle` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - You are about to alter the column `total` on the `ComprasDetalle` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - You are about to alter the column `efectivo` on the `Facturas` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,4)` to `DoublePrecision`.
  - You are about to alter the column `tarjeta` on the `Facturas` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,4)` to `DoublePrecision`.
  - You are about to alter the column `cheque` on the `Facturas` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,4)` to `DoublePrecision`.
  - You are about to alter the column `transferencia` on the `Facturas` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,4)` to `DoublePrecision`.
  - You are about to alter the column `credito` on the `Facturas` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,4)` to `DoublePrecision`.
  - You are about to alter the column `subtotal` on the `Facturas` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,4)` to `DoublePrecision`.
  - You are about to alter the column `descuento` on the `Facturas` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,4)` to `DoublePrecision`.
  - You are about to alter the column `iva` on the `Facturas` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,4)` to `DoublePrecision`.
  - You are about to alter the column `iva_retenido` on the `Facturas` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,4)` to `DoublePrecision`.
  - You are about to alter the column `iva_percivido` on the `Facturas` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,4)` to `DoublePrecision`.
  - You are about to alter the column `total` on the `Facturas` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,4)` to `DoublePrecision`.
  - You are about to alter the column `descuExenta` on the `Facturas` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,4)` to `DoublePrecision`.
  - You are about to alter the column `descuGravada` on the `Facturas` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,4)` to `DoublePrecision`.
  - You are about to alter the column `descuNoSuj` on the `Facturas` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,4)` to `DoublePrecision`.
  - You are about to alter the column `totalExenta` on the `Facturas` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,4)` to `DoublePrecision`.
  - You are about to alter the column `totalGravada` on the `Facturas` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,4)` to `DoublePrecision`.
  - You are about to alter the column `totalNoGravado` on the `Facturas` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,4)` to `DoublePrecision`.
  - You are about to alter the column `totalNoSuj` on the `Facturas` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,4)` to `DoublePrecision`.
  - You are about to alter the column `precio_sin_iva` on the `FacturasDetalle` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,4)` to `DoublePrecision`.
  - You are about to alter the column `precio_con_iva` on the `FacturasDetalle` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,4)` to `DoublePrecision`.
  - You are about to alter the column `cantidad` on the `FacturasDetalle` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,4)` to `DoublePrecision`.
  - You are about to alter the column `subtotal` on the `FacturasDetalle` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,4)` to `DoublePrecision`.
  - You are about to alter the column `descuento` on the `FacturasDetalle` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,4)` to `DoublePrecision`.
  - You are about to alter the column `iva` on the `FacturasDetalle` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,4)` to `DoublePrecision`.
  - You are about to alter the column `total` on the `FacturasDetalle` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,4)` to `DoublePrecision`.
  - You are about to alter the column `precio_unitario` on the `FacturasDetalle` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,4)` to `DoublePrecision`.
  - You are about to alter the column `venta_exenta` on the `FacturasDetalle` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,4)` to `DoublePrecision`.
  - You are about to alter the column `venta_grabada` on the `FacturasDetalle` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,4)` to `DoublePrecision`.
  - You are about to alter the column `venta_nosujeto` on the `FacturasDetalle` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,4)` to `DoublePrecision`.
  - You are about to alter the column `impuesto` on the `GeneralData` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - You are about to alter the column `costo_unitario` on the `Inventario` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - You are about to alter the column `costo_total` on the `Inventario` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - You are about to alter the column `costo` on the `Kardex` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - You are about to alter the column `cantidad` on the `Kardex` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - You are about to alter the column `subtotal` on the `Kardex` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - You are about to alter the column `costo_promedio` on the `Kardex` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - You are about to alter the column `inventario` on the `Kardex` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - You are about to alter the column `total` on the `Kardex` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - You are about to alter the column `costo_unitario` on the `OrdenDeSalidaDetalle` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - You are about to alter the column `cantidad` on the `OrdenDeSalidaDetalle` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - You are about to alter the column `total` on the `OrdenDeSalidaDetalle` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.

*/
-- AlterTable
ALTER TABLE "Catalogo" ALTER COLUMN "precio_sin_iva" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "precio_con_iva" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "CierresDiarios" ALTER COLUMN "venta_bruta" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "para_llevar" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "tarjeta_credomatic" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "tarjeta_serfinza" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "tarjeta_promerica" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "bitcoin" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "syke" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "total_restante" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "propina" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "venta_nota_sin_iva" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "cortecia" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "anti_cobrados" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "anti_reservas" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "certificado_regalo" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "hugo_app" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "pedidos_ya" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "compras" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "entrega_efectivo" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "Compras" ALTER COLUMN "subtotal" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "descuento" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "cesc" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "fovial" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "cotrans" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "iva" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "iva_retenido" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "iva_percivido" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "total" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "ComprasDetalle" ALTER COLUMN "costo_unitario" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "cantidad" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "subtotal" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "descuento_porcentaje" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "descuento_monto" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "iva" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "total" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "Facturas" ALTER COLUMN "efectivo" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "tarjeta" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "cheque" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "transferencia" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "credito" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "subtotal" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "descuento" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "iva" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "iva_retenido" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "iva_percivido" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "total" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "descuExenta" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "descuGravada" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "descuNoSuj" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "totalExenta" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "totalGravada" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "totalNoGravado" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "totalNoSuj" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "FacturasDetalle" ALTER COLUMN "precio_sin_iva" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "precio_con_iva" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "cantidad" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "subtotal" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "descuento" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "iva" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "total" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "precio_unitario" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "venta_exenta" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "venta_grabada" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "venta_nosujeto" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "GeneralData" ALTER COLUMN "impuesto" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "Inventario" ALTER COLUMN "costo_unitario" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "costo_total" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "Kardex" ALTER COLUMN "costo" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "cantidad" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "subtotal" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "costo_promedio" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "inventario" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "total" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "OrdenDeSalidaDetalle" ALTER COLUMN "costo_unitario" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "cantidad" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "total" SET DATA TYPE DOUBLE PRECISION;
