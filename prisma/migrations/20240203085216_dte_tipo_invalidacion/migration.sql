-- CreateTable
CREATE TABLE "DTETipoInvalidacion" (
    "id_tipo_establecimiento" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "estado" "Estado" NOT NULL DEFAULT 'ACTIVO',

    CONSTRAINT "DTETipoInvalidacion_pkey" PRIMARY KEY ("id_tipo_establecimiento")
);
