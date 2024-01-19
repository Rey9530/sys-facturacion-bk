-- CreateEnum
CREATE TYPE "Estado" AS ENUM ('ACTIVO', 'INACTIVO');

-- CreateEnum
CREATE TYPE "EstadoFactura" AS ENUM ('ACTIVO', 'ANULADA');

-- CreateEnum
CREATE TYPE "FacturaTiposDescuentos" AS ENUM ('ITEM', 'GLOBAL', 'AMBOS', 'INACTIVO');

-- CreateEnum
CREATE TYPE "TipoInventario" AS ENUM ('MP', 'CI');

-- CreateEnum
CREATE TYPE "EstadoPago" AS ENUM ('PENDIENTE', 'ENCHEQUE', 'PAGADO');

-- CreateEnum
CREATE TYPE "TipoPago" AS ENUM ('CONTADO', 'CREDITO', 'TARJETCREDITO');

-- CreateEnum
CREATE TYPE "TipoCompra" AS ENUM ('INTERNA', 'IMPORTACION');

-- CreateEnum
CREATE TYPE "TipoCompraFact" AS ENUM ('GRABADO', 'EXCENTO');

-- CreateEnum
CREATE TYPE "ClaseFactura" AS ENUM ('IMPRENTAOTICKETS', 'FROMUNICO', 'FACELECTRONICA');

-- CreateEnum
CREATE TYPE "Turnos" AS ENUM ('DESAYUNO', 'ALMUERZO', 'CENA');

-- CreateEnum
CREATE TYPE "EstadoAgenda" AS ENUM ('PENDIENTE', 'CONFIRMADA', 'COMPLETADA', 'CANCELADA');

-- CreateTable
CREATE TABLE "Usuarios" (
    "id" SERIAL NOT NULL,
    "usuario" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "nombres" TEXT NOT NULL,
    "apellidos" TEXT NOT NULL,
    "dui" TEXT,
    "foto" TEXT,
    "estado" "Estado" NOT NULL DEFAULT 'ACTIVO',
    "fecha_creacion" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id_rol" INTEGER NOT NULL,
    "id_sucursal" INTEGER NOT NULL,
    "id_sucursal_reser" INTEGER,

    CONSTRAINT "Usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GeneralData" (
    "id_general" SERIAL NOT NULL,
    "nombre_sistema" TEXT NOT NULL,
    "direccion" TEXT,
    "razon" TEXT,
    "nit" TEXT,
    "nrc" TEXT,
    "contactos" TEXT,
    "impuesto" DOUBLE PRECISION DEFAULT 0.13,
    "id_tipo_contribuyente" INTEGER,

    CONSTRAINT "GeneralData_pkey" PRIMARY KEY ("id_general")
);

-- CreateTable
CREATE TABLE "Roles" (
    "id_rol" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "Estado" "Estado" NOT NULL DEFAULT 'ACTIVO',

    CONSTRAINT "Roles_pkey" PRIMARY KEY ("id_rol")
);

-- CreateTable
CREATE TABLE "Bancos" (
    "id_banco" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "Estado" "Estado" NOT NULL DEFAULT 'ACTIVO',

    CONSTRAINT "Bancos_pkey" PRIMARY KEY ("id_banco")
);

-- CreateTable
CREATE TABLE "Sucursales" (
    "id_sucursal" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "color" TEXT,
    "estado" "Estado" NOT NULL DEFAULT 'ACTIVO',

    CONSTRAINT "Sucursales_pkey" PRIMARY KEY ("id_sucursal")
);

-- CreateTable
CREATE TABLE "Bodegas" (
    "id_bodega" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "es_principal" INTEGER NOT NULL DEFAULT 0,
    "estado" "Estado" NOT NULL DEFAULT 'ACTIVO',
    "id_sucursal" INTEGER NOT NULL,

    CONSTRAINT "Bodegas_pkey" PRIMARY KEY ("id_bodega")
);

-- CreateTable
CREATE TABLE "CatalogoCategorias" (
    "id_categoria" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "estado" "Estado" NOT NULL DEFAULT 'ACTIVO',

    CONSTRAINT "CatalogoCategorias_pkey" PRIMARY KEY ("id_categoria")
);

-- CreateTable
CREATE TABLE "CatalogoTipo" (
    "id_tipo" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "estado" "Estado" NOT NULL DEFAULT 'ACTIVO',

    CONSTRAINT "CatalogoTipo_pkey" PRIMARY KEY ("id_tipo")
);

-- CreateTable
CREATE TABLE "Catalogo" (
    "id_catalogo" SERIAL NOT NULL,
    "id_tipo" INTEGER NOT NULL,
    "id_categoria" INTEGER NOT NULL,
    "codigo" TEXT,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "precio_sin_iva" DOUBLE PRECISION DEFAULT 0,
    "precio_con_iva" DOUBLE PRECISION DEFAULT 0,
    "existencias_minimas" INTEGER DEFAULT 0,
    "existencias_maximas" INTEGER DEFAULT 0,
    "estado" "Estado" NOT NULL DEFAULT 'ACTIVO',
    "fecha_creacion" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Catalogo_pkey" PRIMARY KEY ("id_catalogo")
);

-- CreateTable
CREATE TABLE "FacturasTipos" (
    "id_tipo_factura" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "codigo" TEXT,
    "estado" "Estado" NOT NULL DEFAULT 'ACTIVO',

    CONSTRAINT "FacturasTipos_pkey" PRIMARY KEY ("id_tipo_factura")
);

-- CreateTable
CREATE TABLE "FacturasMetodosDePago" (
    "id_metodo_pago" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "estado" "Estado" NOT NULL DEFAULT 'ACTIVO',

    CONSTRAINT "FacturasMetodosDePago_pkey" PRIMARY KEY ("id_metodo_pago")
);

-- CreateTable
CREATE TABLE "FacturasDescuentos" (
    "id_descuento" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "porcentaje" INTEGER NOT NULL,
    "isItem" "FacturaTiposDescuentos" NOT NULL DEFAULT 'AMBOS',
    "estado" "Estado" NOT NULL DEFAULT 'ACTIVO',

    CONSTRAINT "FacturasDescuentos_pkey" PRIMARY KEY ("id_descuento")
);

-- CreateTable
CREATE TABLE "FacturasBloques" (
    "id_bloque" SERIAL NOT NULL,
    "tira" TEXT NOT NULL,
    "autorizacion" TEXT NOT NULL DEFAULT '',
    "resolucion" TEXT DEFAULT '',
    "desde" INTEGER NOT NULL,
    "hasta" INTEGER NOT NULL,
    "actual" INTEGER NOT NULL,
    "serie" TEXT NOT NULL,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id_tipo_factura" INTEGER NOT NULL DEFAULT 0,
    "id_sucursal" INTEGER,
    "estado" "Estado" NOT NULL DEFAULT 'ACTIVO',

    CONSTRAINT "FacturasBloques_pkey" PRIMARY KEY ("id_bloque")
);

-- CreateTable
CREATE TABLE "Departamentos" (
    "id_departamento" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "codigo_iso" TEXT NOT NULL,
    "estado" "Estado" NOT NULL DEFAULT 'ACTIVO',

    CONSTRAINT "Departamentos_pkey" PRIMARY KEY ("id_departamento")
);

-- CreateTable
CREATE TABLE "Municipios" (
    "id_municipio" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "estado" "Estado" NOT NULL DEFAULT 'ACTIVO',
    "id_departamento" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Municipios_pkey" PRIMARY KEY ("id_municipio")
);

-- CreateTable
CREATE TABLE "TiposCliente" (
    "id_tipo_cliente" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "estado" "Estado" NOT NULL DEFAULT 'ACTIVO',

    CONSTRAINT "TiposCliente_pkey" PRIMARY KEY ("id_tipo_cliente")
);

-- CreateTable
CREATE TABLE "Cliente" (
    "id_cliente" SERIAL NOT NULL,
    "nombre" TEXT DEFAULT '',
    "giro" TEXT DEFAULT '',
    "razon_social" TEXT DEFAULT '',
    "registro_nrc" TEXT DEFAULT '',
    "nit" TEXT DEFAULT '',
    "id_municipio" INTEGER DEFAULT 0,
    "direccion" TEXT DEFAULT '',
    "telefono" TEXT DEFAULT '',
    "correo" TEXT DEFAULT '',
    "dui" TEXT DEFAULT '',
    "foto_url_nrc" TEXT DEFAULT '',
    "foto_obj_nrc" TEXT,
    "estado" "Estado" NOT NULL DEFAULT 'ACTIVO',
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id_sucursal" INTEGER,
    "id_tipo_cliente" INTEGER,

    CONSTRAINT "Cliente_pkey" PRIMARY KEY ("id_cliente")
);

-- CreateTable
CREATE TABLE "Facturas" (
    "id_factura" SERIAL NOT NULL,
    "numero_factura" TEXT NOT NULL DEFAULT '0',
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "cliente" TEXT NOT NULL DEFAULT '',
    "direccion" TEXT DEFAULT '',
    "no_registro" TEXT DEFAULT '',
    "nit" TEXT DEFAULT '',
    "giro" TEXT DEFAULT '',
    "id_municipio" INTEGER DEFAULT 0,
    "id_cliente" INTEGER,
    "id_bloque" INTEGER NOT NULL DEFAULT 0,
    "id_descuento" INTEGER DEFAULT 0,
    "id_metodo_pago" INTEGER NOT NULL DEFAULT 0,
    "id_usuario" INTEGER NOT NULL DEFAULT 0,
    "efectivo" DOUBLE PRECISION DEFAULT 0,
    "tarjeta" DOUBLE PRECISION DEFAULT 0,
    "cheque" DOUBLE PRECISION DEFAULT 0,
    "transferencia" DOUBLE PRECISION DEFAULT 0,
    "credito" DOUBLE PRECISION DEFAULT 0,
    "subtotal" DOUBLE PRECISION DEFAULT 0,
    "descuento" DOUBLE PRECISION DEFAULT 0,
    "iva" DOUBLE PRECISION DEFAULT 0,
    "iva_retenido" DOUBLE PRECISION DEFAULT 0,
    "iva_percivido" DOUBLE PRECISION DEFAULT 0,
    "total" DOUBLE PRECISION DEFAULT 0,
    "clase" INTEGER DEFAULT 1,
    "estado" "EstadoFactura" NOT NULL DEFAULT 'ACTIVO',
    "id_sucursal" INTEGER,

    CONSTRAINT "Facturas_pkey" PRIMARY KEY ("id_factura")
);

-- CreateTable
CREATE TABLE "FacturasDetalle" (
    "id_factura_detalle" SERIAL NOT NULL,
    "id_factura" INTEGER NOT NULL,
    "id_catalogo" INTEGER NOT NULL DEFAULT 0,
    "codigo" TEXT,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "precio_sin_iva" DOUBLE PRECISION DEFAULT 0,
    "precio_con_iva" DOUBLE PRECISION DEFAULT 0,
    "cantidad" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "subtotal" DOUBLE PRECISION DEFAULT 0,
    "descuento" DOUBLE PRECISION DEFAULT 0,
    "iva" DOUBLE PRECISION DEFAULT 0,
    "total" DOUBLE PRECISION DEFAULT 0,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id_descuento" INTEGER DEFAULT 0,

    CONSTRAINT "FacturasDetalle_pkey" PRIMARY KEY ("id_factura_detalle")
);

-- CreateTable
CREATE TABLE "Proveedores" (
    "id_proveedor" SERIAL NOT NULL,
    "nombre" TEXT DEFAULT '',
    "giro" TEXT DEFAULT '',
    "razon_social" TEXT DEFAULT '',
    "registro_nrc" TEXT DEFAULT '',
    "nit" TEXT DEFAULT '',
    "id_municipio" INTEGER DEFAULT 0,
    "direccion" TEXT DEFAULT '',
    "dui" TEXT DEFAULT '',
    "foto_url_nrc" TEXT DEFAULT '',
    "dias_credito" TEXT DEFAULT '0',
    "foto_obj_nrc" TEXT,
    "estado" "Estado" NOT NULL DEFAULT 'ACTIVO',
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "nombre_contac_1" TEXT DEFAULT '',
    "telefono_contac_1" TEXT DEFAULT '',
    "correo_contac_1" TEXT DEFAULT '',
    "nombre_contac_2" TEXT DEFAULT '',
    "telefono_contac_2" TEXT DEFAULT '',
    "correo_contac_2" TEXT DEFAULT '',
    "nombre_contac_3" TEXT DEFAULT '',
    "telefono_contac_3" TEXT DEFAULT '',
    "correo_contac_3" TEXT DEFAULT '',
    "no_cuenta" TEXT DEFAULT '',
    "tipo_cuenta" TEXT DEFAULT '',
    "id_banco" INTEGER DEFAULT 0,
    "id_usuario" INTEGER NOT NULL DEFAULT 0,
    "id_tipo_proveedor" INTEGER,

    CONSTRAINT "Proveedores_pkey" PRIMARY KEY ("id_proveedor")
);

-- CreateTable
CREATE TABLE "Compras" (
    "id_compras" SERIAL NOT NULL,
    "numero_factura" TEXT NOT NULL DEFAULT '0',
    "numero_quedan" TEXT DEFAULT '0',
    "tipo_inventario" "TipoInventario" DEFAULT 'MP',
    "detalle" TEXT,
    "id_proveedor" INTEGER,
    "nombre_proveedor" TEXT DEFAULT '',
    "dui_proveedor" TEXT DEFAULT '',
    "no_cheque" TEXT DEFAULT '',
    "tipo_pago" "TipoPago" NOT NULL DEFAULT 'CONTADO',
    "tipo_compra" "TipoCompra" NOT NULL DEFAULT 'INTERNA',
    "tipo_factura" "TipoCompraFact" NOT NULL DEFAULT 'GRABADO',
    "id_usuario" INTEGER NOT NULL DEFAULT 0,
    "dias_credito" INTEGER DEFAULT 0,
    "subtotal" DOUBLE PRECISION DEFAULT 0,
    "descuento" DOUBLE PRECISION DEFAULT 0,
    "cesc" DOUBLE PRECISION DEFAULT 0,
    "fovial" DOUBLE PRECISION DEFAULT 0,
    "cotrans" DOUBLE PRECISION DEFAULT 0,
    "iva" DOUBLE PRECISION DEFAULT 0,
    "iva_retenido" DOUBLE PRECISION DEFAULT 0,
    "iva_percivido" DOUBLE PRECISION DEFAULT 0,
    "total" DOUBLE PRECISION DEFAULT 0,
    "clase" "ClaseFactura" NOT NULL DEFAULT 'IMPRENTAOTICKETS',
    "estado" "EstadoFactura" NOT NULL DEFAULT 'ACTIVO',
    "id_sucursal" INTEGER,
    "id_bodega" INTEGER,
    "id_tipo_factura" INTEGER DEFAULT 2,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_actualizacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_factura" TIMESTAMP(3),
    "fecha_de_pago" TIMESTAMP(3),
    "estado_pago" "EstadoPago" NOT NULL DEFAULT 'PENDIENTE',

    CONSTRAINT "Compras_pkey" PRIMARY KEY ("id_compras")
);

-- CreateTable
CREATE TABLE "ComprasDetalle" (
    "id_compras_detalle" SERIAL NOT NULL,
    "id_compras" INTEGER NOT NULL,
    "id_catalogo" INTEGER,
    "codigo" TEXT,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "costo_unitario" DOUBLE PRECISION DEFAULT 0,
    "cantidad" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "subtotal" DOUBLE PRECISION DEFAULT 0,
    "descuento_porcentaje" DOUBLE PRECISION DEFAULT 0,
    "descuento_monto" DOUBLE PRECISION DEFAULT 0,
    "iva" DOUBLE PRECISION DEFAULT 0,
    "total" DOUBLE PRECISION DEFAULT 0,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ComprasDetalle_pkey" PRIMARY KEY ("id_compras_detalle")
);

-- CreateTable
CREATE TABLE "Inventario" (
    "id_inventario" SERIAL NOT NULL,
    "id_catalogo" INTEGER NOT NULL,
    "id_compras_detalle" INTEGER,
    "id_bodega" INTEGER,
    "costo_unitario" DOUBLE PRECISION DEFAULT 0,
    "existencia" INTEGER DEFAULT 0,
    "costo_total" DOUBLE PRECISION DEFAULT 0,

    CONSTRAINT "Inventario_pkey" PRIMARY KEY ("id_inventario")
);

-- CreateTable
CREATE TABLE "Kardex" (
    "id_kardex" SERIAL NOT NULL,
    "id_catalogo" INTEGER NOT NULL,
    "id_compras_detalle" INTEGER,
    "tipo_movimiento" INTEGER NOT NULL DEFAULT 1,
    "descripcion" TEXT,
    "costo" DOUBLE PRECISION DEFAULT 0,
    "cantidad" DOUBLE PRECISION DEFAULT 0,
    "subtotal" DOUBLE PRECISION DEFAULT 0,
    "costo_promedio" DOUBLE PRECISION DEFAULT 0,
    "inventario" DOUBLE PRECISION DEFAULT 0,
    "total" DOUBLE PRECISION DEFAULT 0,

    CONSTRAINT "Kardex_pkey" PRIMARY KEY ("id_kardex")
);

-- CreateTable
CREATE TABLE "Agenda" (
    "id_agenda" SERIAL NOT NULL,
    "zona" TEXT,
    "id_sucursal" INTEGER,
    "no_personas" TEXT,
    "nombre" TEXT,
    "telefono" TEXT,
    "turno" "Turnos",
    "inicio" TIMESTAMP(3) NOT NULL,
    "fin" TIMESTAMP(3) NOT NULL,
    "nota" TEXT,
    "id_usuario" INTEGER,
    "estado" "EstadoAgenda" NOT NULL DEFAULT 'PENDIENTE',
    "fecha_creacion" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Agenda_pkey" PRIMARY KEY ("id_agenda")
);

-- CreateTable
CREATE TABLE "MotivoSalida" (
    "id_motivo" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "estado" "Estado" NOT NULL DEFAULT 'ACTIVO',

    CONSTRAINT "MotivoSalida_pkey" PRIMARY KEY ("id_motivo")
);

-- CreateTable
CREATE TABLE "OrdenDeSalida" (
    "id_orden_salida" SERIAL NOT NULL,
    "id_bodega" INTEGER NOT NULL,
    "id_motivo" INTEGER NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "observacion" TEXT,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_actualizacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OrdenDeSalida_pkey" PRIMARY KEY ("id_orden_salida")
);

-- CreateTable
CREATE TABLE "OrdenDeSalidaDetalle" (
    "id_orden_detalle" SERIAL NOT NULL,
    "id_catalogo" INTEGER NOT NULL DEFAULT 0,
    "id_inventario" INTEGER NOT NULL DEFAULT 0,
    "costo_unitario" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "cantidad" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "total" DOUBLE PRECISION DEFAULT 0,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "estado" "Estado" NOT NULL DEFAULT 'ACTIVO',

    CONSTRAINT "OrdenDeSalidaDetalle_pkey" PRIMARY KEY ("id_orden_detalle")
);

-- CreateTable
CREATE TABLE "CierresDiarios" (
    "id_cierre" SERIAL NOT NULL,
    "venta_bruta" DOUBLE PRECISION DEFAULT 0,
    "para_llevar" DOUBLE PRECISION DEFAULT 0,
    "tarjeta_credomatic" DOUBLE PRECISION DEFAULT 0,
    "tarjeta_serfinza" DOUBLE PRECISION DEFAULT 0,
    "tarjeta_promerica" DOUBLE PRECISION DEFAULT 0,
    "bitcoin" DOUBLE PRECISION DEFAULT 0,
    "syke" DOUBLE PRECISION DEFAULT 0,
    "total_restante" DOUBLE PRECISION DEFAULT 0,
    "propina" DOUBLE PRECISION DEFAULT 0,
    "venta_nota_sin_iva" DOUBLE PRECISION DEFAULT 0,
    "cortecia" DOUBLE PRECISION DEFAULT 0,
    "anti_cobrados" DOUBLE PRECISION DEFAULT 0,
    "anti_reservas" DOUBLE PRECISION DEFAULT 0,
    "certificado_regalo" DOUBLE PRECISION DEFAULT 0,
    "hugo_app" DOUBLE PRECISION DEFAULT 0,
    "pedidos_ya" DOUBLE PRECISION DEFAULT 0,
    "compras" DOUBLE PRECISION DEFAULT 0,
    "entrega_efectivo" DOUBLE PRECISION DEFAULT 0,
    "fecha_creacion" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_cierre" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "observacion" TEXT,
    "id_usuario" INTEGER,
    "id_sucursal" INTEGER,

    CONSTRAINT "CierresDiarios_pkey" PRIMARY KEY ("id_cierre")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuarios_foto_key" ON "Usuarios"("foto");

-- CreateIndex
CREATE INDEX "fk_usuario_rol_id" ON "Usuarios"("id_rol");

-- CreateIndex
CREATE INDEX "fk_usuario_sucursal_id" ON "Usuarios"("id_sucursal");

-- CreateIndex
CREATE INDEX "fk_sistema_tipo_id" ON "GeneralData"("id_tipo_contribuyente");

-- CreateIndex
CREATE INDEX "fk_bodega_sucursal_id" ON "Bodegas"("id_sucursal");

-- CreateIndex
CREATE INDEX "fk_tipo_catalogo_id" ON "Catalogo"("id_tipo");

-- CreateIndex
CREATE INDEX "fk_categoria_sefvicio_id" ON "Catalogo"("id_categoria");

-- CreateIndex
CREATE INDEX "fk_fatura_bloque_sucursal_id" ON "FacturasBloques"("id_sucursal");

-- CreateIndex
CREATE INDEX "fk_fatura_bloque_tipo_id" ON "FacturasBloques"("id_tipo_factura");

-- CreateIndex
CREATE INDEX "fk_municipio_departamento_id" ON "Municipios"("id_departamento");

-- CreateIndex
CREATE INDEX "fk_cliente_tipo_id" ON "Cliente"("id_tipo_cliente");

-- CreateIndex
CREATE INDEX "fk_cliente_sucursal_id" ON "Cliente"("id_sucursal");

-- CreateIndex
CREATE INDEX "fk_cliente_municipio_id" ON "Cliente"("id_municipio");

-- CreateIndex
CREATE INDEX "fk_facturacion_sucursal_id" ON "Facturas"("id_sucursal");

-- CreateIndex
CREATE INDEX "fk_fatura_usuario_id" ON "Facturas"("id_usuario");

-- CreateIndex
CREATE INDEX "fk_fatura_cliente_id" ON "Facturas"("id_cliente");

-- CreateIndex
CREATE INDEX "fk_fatura_methodo_pago_id" ON "Facturas"("id_metodo_pago");

-- CreateIndex
CREATE INDEX "fk_fatura_descuento_id" ON "Facturas"("id_descuento");

-- CreateIndex
CREATE INDEX "fk_fatura_municipio_id" ON "Facturas"("id_municipio");

-- CreateIndex
CREATE INDEX "fk_fatura_bloque_id" ON "Facturas"("id_bloque");

-- CreateIndex
CREATE INDEX "fk_fatura_detalle_descuento_id" ON "FacturasDetalle"("id_descuento");

-- CreateIndex
CREATE INDEX "fk_fatura_detalle_id" ON "FacturasDetalle"("id_factura");

-- CreateIndex
CREATE INDEX "fk_factura_detalle_catalogo_id" ON "FacturasDetalle"("id_catalogo");

-- CreateIndex
CREATE INDEX "fk_proveedor_banco_id" ON "Proveedores"("id_banco");

-- CreateIndex
CREATE INDEX "fk_proveedor_tipo_id" ON "Proveedores"("id_tipo_proveedor");

-- CreateIndex
CREATE INDEX "fk_proveedor_municipio_id" ON "Proveedores"("id_municipio");

-- CreateIndex
CREATE INDEX "fk_proveedor_usuario_id" ON "Proveedores"("id_usuario");

-- CreateIndex
CREATE INDEX "fk_compras_tipo_factura_id" ON "Compras"("id_tipo_factura");

-- CreateIndex
CREATE INDEX "fk_compras_sucursal_id" ON "Compras"("id_sucursal");

-- CreateIndex
CREATE INDEX "fk_compras_bodega_id" ON "Compras"("id_bodega");

-- CreateIndex
CREATE INDEX "fk_compra_usuario_id" ON "Compras"("id_usuario");

-- CreateIndex
CREATE INDEX "fk_compras_proveedor_id" ON "Compras"("id_proveedor");

-- CreateIndex
CREATE INDEX "fk_compra_detalle_id" ON "ComprasDetalle"("id_compras");

-- CreateIndex
CREATE INDEX "fk_compras_detalle_catalogo_id" ON "ComprasDetalle"("id_catalogo");

-- CreateIndex
CREATE INDEX "fk_inventario_bodega_id" ON "Inventario"("id_bodega");

-- CreateIndex
CREATE INDEX "fk_inventario_catalogo_id" ON "Inventario"("id_catalogo");

-- CreateIndex
CREATE INDEX "fk_inventario_detalle_id" ON "Inventario"("id_compras_detalle");

-- CreateIndex
CREATE INDEX "fk_kardex_catalogo_id" ON "Kardex"("id_catalogo");

-- CreateIndex
CREATE INDEX "fk_kardex_detalle_id" ON "Kardex"("id_compras_detalle");

-- CreateIndex
CREATE INDEX "fk_agenda_sucursal_id" ON "Agenda"("id_sucursal");

-- CreateIndex
CREATE INDEX "fk_agenda_usuario_id" ON "Agenda"("id_usuario");

-- CreateIndex
CREATE INDEX "fk_salida_bodega_id" ON "OrdenDeSalida"("id_bodega");

-- CreateIndex
CREATE INDEX "fk_salida_motivo_id" ON "OrdenDeSalida"("id_motivo");

-- CreateIndex
CREATE INDEX "fk_salida_usuario_id" ON "OrdenDeSalida"("id_usuario");

-- CreateIndex
CREATE INDEX "fk_salida_detalle_catalogo_id" ON "OrdenDeSalidaDetalle"("id_catalogo");

-- CreateIndex
CREATE INDEX "fk_salida_inventario_id" ON "OrdenDeSalidaDetalle"("id_inventario");

-- CreateIndex
CREATE INDEX "fk_cierre_sucursal_id" ON "CierresDiarios"("id_sucursal");

-- CreateIndex
CREATE INDEX "fk_cierre_usuario_id" ON "CierresDiarios"("id_usuario");

-- AddForeignKey
ALTER TABLE "Usuarios" ADD CONSTRAINT "fk_usuario_rol" FOREIGN KEY ("id_rol") REFERENCES "Roles"("id_rol") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Usuarios" ADD CONSTRAINT "fk_usuario_sucursal" FOREIGN KEY ("id_sucursal") REFERENCES "Sucursales"("id_sucursal") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "GeneralData" ADD CONSTRAINT "fk_sistema_tipo" FOREIGN KEY ("id_tipo_contribuyente") REFERENCES "TiposCliente"("id_tipo_cliente") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Bodegas" ADD CONSTRAINT "fk_bodega_sucursal" FOREIGN KEY ("id_sucursal") REFERENCES "Sucursales"("id_sucursal") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Catalogo" ADD CONSTRAINT "fk_tipo_catalogo" FOREIGN KEY ("id_tipo") REFERENCES "CatalogoTipo"("id_tipo") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Catalogo" ADD CONSTRAINT "fk_categoria_sefvicio" FOREIGN KEY ("id_categoria") REFERENCES "CatalogoCategorias"("id_categoria") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "FacturasBloques" ADD CONSTRAINT "fk_fatura_bloque_tipo" FOREIGN KEY ("id_tipo_factura") REFERENCES "FacturasTipos"("id_tipo_factura") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "FacturasBloques" ADD CONSTRAINT "fk_fatura_bloque_sucursal" FOREIGN KEY ("id_sucursal") REFERENCES "Sucursales"("id_sucursal") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Municipios" ADD CONSTRAINT "fk_municipio_departamento" FOREIGN KEY ("id_departamento") REFERENCES "Departamentos"("id_departamento") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Cliente" ADD CONSTRAINT "fk_cliente_municipio" FOREIGN KEY ("id_municipio") REFERENCES "Municipios"("id_municipio") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Cliente" ADD CONSTRAINT "fk_cliente_sucursal" FOREIGN KEY ("id_sucursal") REFERENCES "Sucursales"("id_sucursal") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Cliente" ADD CONSTRAINT "fk_cliente_tipo" FOREIGN KEY ("id_tipo_cliente") REFERENCES "TiposCliente"("id_tipo_cliente") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Facturas" ADD CONSTRAINT "fk_fatura_municipio" FOREIGN KEY ("id_municipio") REFERENCES "Municipios"("id_municipio") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Facturas" ADD CONSTRAINT "fk_fatura_cliente" FOREIGN KEY ("id_cliente") REFERENCES "Cliente"("id_cliente") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Facturas" ADD CONSTRAINT "fk_fatura_bloque" FOREIGN KEY ("id_bloque") REFERENCES "FacturasBloques"("id_bloque") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Facturas" ADD CONSTRAINT "fk_fatura_descuento" FOREIGN KEY ("id_descuento") REFERENCES "FacturasDescuentos"("id_descuento") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Facturas" ADD CONSTRAINT "fk_fatura_methodo_pago" FOREIGN KEY ("id_metodo_pago") REFERENCES "FacturasMetodosDePago"("id_metodo_pago") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Facturas" ADD CONSTRAINT "fk_fatura_usuario" FOREIGN KEY ("id_usuario") REFERENCES "Usuarios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Facturas" ADD CONSTRAINT "fk_facturacion_sucursal" FOREIGN KEY ("id_sucursal") REFERENCES "Sucursales"("id_sucursal") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "FacturasDetalle" ADD CONSTRAINT "fk_fatura_detalle" FOREIGN KEY ("id_factura") REFERENCES "Facturas"("id_factura") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "FacturasDetalle" ADD CONSTRAINT "fk_factura_detalle_catalogo" FOREIGN KEY ("id_catalogo") REFERENCES "Catalogo"("id_catalogo") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "FacturasDetalle" ADD CONSTRAINT "fk_fatura_detalle_descuento" FOREIGN KEY ("id_descuento") REFERENCES "FacturasDescuentos"("id_descuento") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Proveedores" ADD CONSTRAINT "fk_proveedor_municipio" FOREIGN KEY ("id_municipio") REFERENCES "Municipios"("id_municipio") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Proveedores" ADD CONSTRAINT "fk_proveedor_banco" FOREIGN KEY ("id_banco") REFERENCES "Bancos"("id_banco") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Proveedores" ADD CONSTRAINT "fk_proveedor_usuario" FOREIGN KEY ("id_usuario") REFERENCES "Usuarios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Proveedores" ADD CONSTRAINT "fk_proveedor_tipo" FOREIGN KEY ("id_tipo_proveedor") REFERENCES "TiposCliente"("id_tipo_cliente") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Compras" ADD CONSTRAINT "fk_compras_proveedor" FOREIGN KEY ("id_proveedor") REFERENCES "Proveedores"("id_proveedor") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Compras" ADD CONSTRAINT "fk_compra_usuario" FOREIGN KEY ("id_usuario") REFERENCES "Usuarios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Compras" ADD CONSTRAINT "fk_compras_sucursal" FOREIGN KEY ("id_sucursal") REFERENCES "Sucursales"("id_sucursal") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Compras" ADD CONSTRAINT "fk_compras_bodega" FOREIGN KEY ("id_bodega") REFERENCES "Bodegas"("id_bodega") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Compras" ADD CONSTRAINT "fk_compras_tipo_factura" FOREIGN KEY ("id_tipo_factura") REFERENCES "FacturasTipos"("id_tipo_factura") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ComprasDetalle" ADD CONSTRAINT "fk_compra_detalle" FOREIGN KEY ("id_compras") REFERENCES "Compras"("id_compras") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ComprasDetalle" ADD CONSTRAINT "fk_compras_detalle_catalogo" FOREIGN KEY ("id_catalogo") REFERENCES "Catalogo"("id_catalogo") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Inventario" ADD CONSTRAINT "fk_inventario_catalogo" FOREIGN KEY ("id_catalogo") REFERENCES "Catalogo"("id_catalogo") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Inventario" ADD CONSTRAINT "fk_inventario_detalle" FOREIGN KEY ("id_compras_detalle") REFERENCES "ComprasDetalle"("id_compras_detalle") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Inventario" ADD CONSTRAINT "fk_inventario_bodega" FOREIGN KEY ("id_bodega") REFERENCES "Bodegas"("id_bodega") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Kardex" ADD CONSTRAINT "fk_kardex_catalogo" FOREIGN KEY ("id_catalogo") REFERENCES "Catalogo"("id_catalogo") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Kardex" ADD CONSTRAINT "fk_kardex_detalle" FOREIGN KEY ("id_compras_detalle") REFERENCES "ComprasDetalle"("id_compras_detalle") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Agenda" ADD CONSTRAINT "fk_agenda_sucursal" FOREIGN KEY ("id_sucursal") REFERENCES "Sucursales"("id_sucursal") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Agenda" ADD CONSTRAINT "fk_agenda_usuario" FOREIGN KEY ("id_usuario") REFERENCES "Usuarios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "OrdenDeSalida" ADD CONSTRAINT "fk_salida_bodega" FOREIGN KEY ("id_bodega") REFERENCES "Bodegas"("id_bodega") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "OrdenDeSalida" ADD CONSTRAINT "fk_salida_motivo" FOREIGN KEY ("id_motivo") REFERENCES "MotivoSalida"("id_motivo") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "OrdenDeSalida" ADD CONSTRAINT "fk_salida_usuario" FOREIGN KEY ("id_usuario") REFERENCES "Usuarios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "OrdenDeSalidaDetalle" ADD CONSTRAINT "fk_salida_detalle_catalogo" FOREIGN KEY ("id_catalogo") REFERENCES "Catalogo"("id_catalogo") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "OrdenDeSalidaDetalle" ADD CONSTRAINT "fk_salida_inventario" FOREIGN KEY ("id_inventario") REFERENCES "Inventario"("id_inventario") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "CierresDiarios" ADD CONSTRAINT "fk_cierre_usuario" FOREIGN KEY ("id_usuario") REFERENCES "Usuarios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "CierresDiarios" ADD CONSTRAINT "fk_cierre_sucursal" FOREIGN KEY ("id_sucursal") REFERENCES "Sucursales"("id_sucursal") ON DELETE NO ACTION ON UPDATE NO ACTION;
