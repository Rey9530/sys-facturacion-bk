-- DropIndex
DROP INDEX "Usuarios_foto_key";

-- CreateTable
CREATE TABLE "DTETipoContingencia" (
    "id_tipo_contingencia" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "estado" "Estado" NOT NULL DEFAULT 'ACTIVO',

    CONSTRAINT "DTETipoContingencia_pkey" PRIMARY KEY ("id_tipo_contingencia")
);

-- CreateTable
CREATE TABLE "DTERetencionIvaMh" (
    "id_dte_retencion_iva_mh" SERIAL NOT NULL,
    "codigo" TEXT NOT NULL,
    "valor" TEXT NOT NULL,

    CONSTRAINT "DTERetencionIvaMh_pkey" PRIMARY KEY ("id_dte_retencion_iva_mh")
);

-- CreateTable
CREATE TABLE "DTETipoGeneracionDocumento" (
    "id_dte_tipo_generacion_documento" SERIAL NOT NULL,
    "codigo" INTEGER NOT NULL,
    "valor" TEXT NOT NULL,

    CONSTRAINT "DTETipoGeneracionDocumento_pkey" PRIMARY KEY ("id_dte_tipo_generacion_documento")
);

-- CreateTable
CREATE TABLE "DTETipoServicioMedico" (
    "id_dte_tipo_servicio_medico" SERIAL NOT NULL,
    "codigo" INTEGER NOT NULL,
    "valor" TEXT NOT NULL,

    CONSTRAINT "DTETipoServicioMedico_pkey" PRIMARY KEY ("id_dte_tipo_servicio_medico")
);

-- CreateTable
CREATE TABLE "DTETipoItem" (
    "id_dte_tipo_item" SERIAL NOT NULL,
    "codigo" INTEGER NOT NULL,
    "valor" TEXT NOT NULL,

    CONSTRAINT "DTETipoItem_pkey" PRIMARY KEY ("id_dte_tipo_item")
);

-- CreateTable
CREATE TABLE "DTEUnidadDeMedida" (
    "id_unidad_de_medida" SERIAL NOT NULL,
    "codigo" TEXT NOT NULL,
    "valor" TEXT NOT NULL,

    CONSTRAINT "DTEUnidadDeMedida_pkey" PRIMARY KEY ("id_unidad_de_medida")
);

-- CreateTable
CREATE TABLE "DTETributosAplicadosPorItem" (
    "id_tributos_aplicados_por_item" SERIAL NOT NULL,
    "codigo" TEXT NOT NULL,
    "valor" TEXT NOT NULL,

    CONSTRAINT "DTETributosAplicadosPorItem_pkey" PRIMARY KEY ("id_tributos_aplicados_por_item")
);

-- CreateTable
CREATE TABLE "DTETributosAplicadosPorItemCuerpo" (
    "id_tributos_aplicados_por_item_cuerpo" SERIAL NOT NULL,
    "codigo" TEXT NOT NULL,
    "valor" TEXT NOT NULL,

    CONSTRAINT "DTETributosAplicadosPorItemCuerpo_pkey" PRIMARY KEY ("id_tributos_aplicados_por_item_cuerpo")
);

-- CreateTable
CREATE TABLE "DTEImpuestosAdValoremAplicadosPorItem" (
    "id_impuestos_ad_valorem_aplicados_por_item" SERIAL NOT NULL,
    "codigo" TEXT NOT NULL,
    "valor" TEXT NOT NULL,

    CONSTRAINT "DTEImpuestosAdValoremAplicadosPorItem_pkey" PRIMARY KEY ("id_impuestos_ad_valorem_aplicados_por_item")
);

-- CreateTable
CREATE TABLE "DTECondicionDeLaOperacion" (
    "id_condicion_de_la_operacion" SERIAL NOT NULL,
    "codigo" INTEGER NOT NULL,
    "valor" TEXT NOT NULL,

    CONSTRAINT "DTECondicionDeLaOperacion_pkey" PRIMARY KEY ("id_condicion_de_la_operacion")
);

-- CreateTable
CREATE TABLE "DTEPlazo" (
    "id_plazo" SERIAL NOT NULL,
    "codigo" TEXT NOT NULL,
    "valor" TEXT NOT NULL,

    CONSTRAINT "DTEPlazo_pkey" PRIMARY KEY ("id_plazo")
);

-- CreateTable
CREATE TABLE "DTEFormaPago" (
    "id" SERIAL NOT NULL,
    "codigo" TEXT NOT NULL,
    "valor" TEXT NOT NULL,

    CONSTRAINT "DTEFormaPago_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DTECodigoDeActividadEconomica" (
    "id_codigo_de_actividad_economica" SERIAL NOT NULL,
    "codigo" TEXT NOT NULL,
    "valor" TEXT NOT NULL,

    CONSTRAINT "DTECodigoDeActividadEconomica_pkey" PRIMARY KEY ("id_codigo_de_actividad_economica")
);

-- CreateTable
CREATE TABLE "DTEPais" (
    "id_pais" SERIAL NOT NULL,
    "codigo" TEXT NOT NULL,
    "valor" TEXT NOT NULL,

    CONSTRAINT "DTEPais_pkey" PRIMARY KEY ("id_pais")
);

-- CreateTable
CREATE TABLE "DTEOtrosDocumentosAsociados" (
    "id_otros_documentos_asociados" SERIAL NOT NULL,
    "codigo" INTEGER NOT NULL,
    "valor" TEXT NOT NULL,

    CONSTRAINT "DTEOtrosDocumentosAsociados_pkey" PRIMARY KEY ("id_otros_documentos_asociados")
);

-- CreateTable
CREATE TABLE "DTETiposDeDocumentosEnContingencia" (
    "id_tipos_de_documentos_en_contingencia" SERIAL NOT NULL,
    "codigo" TEXT NOT NULL,
    "valor" TEXT NOT NULL,

    CONSTRAINT "DTETiposDeDocumentosEnContingencia_pkey" PRIMARY KEY ("id_tipos_de_documentos_en_contingencia")
);

-- CreateTable
CREATE TABLE "DTETituloAQueSeRemiteLosBienes" (
    "id_titulo_a_que_se_remite_los_bienes" SERIAL NOT NULL,
    "codigo" TEXT NOT NULL,
    "valor" TEXT NOT NULL,

    CONSTRAINT "DTETituloAQueSeRemiteLosBienes_pkey" PRIMARY KEY ("id_titulo_a_que_se_remite_los_bienes")
);

-- CreateTable
CREATE TABLE "DTECategoriaDeBienYServicio" (
    "id_categoria" SERIAL NOT NULL,
    "codigo" INTEGER NOT NULL,
    "valor" TEXT NOT NULL,

    CONSTRAINT "DTECategoriaDeBienYServicio_pkey" PRIMARY KEY ("id_categoria")
);

-- CreateTable
CREATE TABLE "DTERecintoFiscal" (
    "id_recinto_fiscal" SERIAL NOT NULL,
    "codigo" TEXT NOT NULL,
    "valor" TEXT NOT NULL,

    CONSTRAINT "DTERecintoFiscal_pkey" PRIMARY KEY ("id_recinto_fiscal")
);

-- CreateTable
CREATE TABLE "DTERegimen" (
    "id_regimen" SERIAL NOT NULL,
    "codigo" TEXT NOT NULL,
    "valor" TEXT NOT NULL,

    CONSTRAINT "DTERegimen_pkey" PRIMARY KEY ("id_regimen")
);

-- CreateTable
CREATE TABLE "DTETipoDePersona" (
    "id_tipoDePersona" SERIAL NOT NULL,
    "codigo" INTEGER NOT NULL,
    "valor" TEXT NOT NULL,

    CONSTRAINT "DTETipoDePersona_pkey" PRIMARY KEY ("id_tipoDePersona")
);

-- CreateTable
CREATE TABLE "DTETransporte" (
    "id_transporte" SERIAL NOT NULL,
    "codigo" INTEGER NOT NULL,
    "valor" TEXT NOT NULL,

    CONSTRAINT "DTETransporte_pkey" PRIMARY KEY ("id_transporte")
);

-- CreateTable
CREATE TABLE "DTEIncoterms" (
    "id_incoterms" SERIAL NOT NULL,
    "codigo" TEXT NOT NULL,
    "valor" TEXT NOT NULL,

    CONSTRAINT "DTEIncoterms_pkey" PRIMARY KEY ("id_incoterms")
);

-- CreateTable
CREATE TABLE "DTEDomicilioFiscal" (
    "id_domicilioFiscal" SERIAL NOT NULL,
    "codigo" INTEGER NOT NULL,
    "valor" TEXT NOT NULL,

    CONSTRAINT "DTEDomicilioFiscal_pkey" PRIMARY KEY ("id_domicilioFiscal")
);
