-- CreateEnum
CREATE TYPE "EstadoResponse" AS ENUM ('RECHAZADO', 'ACEPTADO');

-- CreateTable
CREATE TABLE "Contingencias" (
    "id_contingencia" SERIAL NOT NULL,
    "fecha_inicio" TEXT NOT NULL,
    "hora_inicio" TEXT NOT NULL,
    "fecha_fin" TEXT NOT NULL,
    "hora_fin" TEXT NOT NULL,
    "motivo" TEXT NOT NULL,
    "tipo" INTEGER NOT NULL,
    "json_response" TEXT NOT NULL,
    "fecha_creacion" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "estado" "EstadoResponse" NOT NULL DEFAULT 'ACEPTADO',

    CONSTRAINT "Contingencias_pkey" PRIMARY KEY ("id_contingencia")
);

-- CreateTable
CREATE TABLE "ContingenciasDetalle" (
    "id_contingencia_detalle" SERIAL NOT NULL,
    "codigoGeneracion" TEXT NOT NULL,
    "tipoDoc" TEXT NOT NULL,
    "estado" "Estado" NOT NULL DEFAULT 'ACTIVO',

    CONSTRAINT "ContingenciasDetalle_pkey" PRIMARY KEY ("id_contingencia_detalle")
);
