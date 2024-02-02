-- AlterTable
ALTER TABLE "Cliente" ADD COLUMN     "cod_actividad" TEXT,
ADD COLUMN     "desc_actividad" TEXT,
ADD COLUMN     "id_tipo_documento" INTEGER,
ADD COLUMN     "num_ducumento_identificacion" TEXT DEFAULT '';

-- AlterTable
ALTER TABLE "GeneralData" ADD COLUMN     "cod_actividad" TEXT,
ADD COLUMN     "desc_actividad" TEXT,
ADD COLUMN     "nombreComercial" TEXT;

-- AlterTable
ALTER TABLE "Sucursales" ADD COLUMN     "complemento" TEXT,
ADD COLUMN     "correo" TEXT,
ADD COLUMN     "id_municipio" INTEGER,
ADD COLUMN     "id_tipo_establecimiento" INTEGER,
ADD COLUMN     "telefono" TEXT;

-- CreateTable
CREATE TABLE "DTEActividadEconomica" (
    "id_actividad" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "estado" "Estado" NOT NULL DEFAULT 'ACTIVO',

    CONSTRAINT "DTEActividadEconomica_pkey" PRIMARY KEY ("id_actividad")
);

-- CreateTable
CREATE TABLE "DTETipoEstablecimiento" (
    "id_tipo_establecimiento" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "estado" "Estado" NOT NULL DEFAULT 'ACTIVO',

    CONSTRAINT "DTETipoEstablecimiento_pkey" PRIMARY KEY ("id_tipo_establecimiento")
);

-- CreateTable
CREATE TABLE "DTETipoDocumentoIdentificacion" (
    "id_tipo_documento" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "estado" "Estado" NOT NULL DEFAULT 'ACTIVO',

    CONSTRAINT "DTETipoDocumentoIdentificacion_pkey" PRIMARY KEY ("id_tipo_documento")
);

-- AddForeignKey
ALTER TABLE "Sucursales" ADD CONSTRAINT "fk_sucursal_municipio" FOREIGN KEY ("id_municipio") REFERENCES "Municipios"("id_municipio") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Sucursales" ADD CONSTRAINT "fk_sucursal_tipo_establecimiento" FOREIGN KEY ("id_tipo_establecimiento") REFERENCES "DTETipoEstablecimiento"("id_tipo_establecimiento") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Cliente" ADD CONSTRAINT "fk_cliente_tipo_documento" FOREIGN KEY ("id_tipo_documento") REFERENCES "DTETipoDocumentoIdentificacion"("id_tipo_documento") ON DELETE NO ACTION ON UPDATE NO ACTION;
