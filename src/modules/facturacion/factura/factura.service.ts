import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/common/services';
import { Usuarios } from '@prisma/client';
import {
  CreateFacturaDto,
  UpdateFacturaDto,
  CierreManualTDO,
  BuscartCatalogoDto,
  FechasFacturaDto,
  ContingencyDto,
} from './dto';
import { ElectronicaService } from '../electronica/electronica.service';
import { formatNumberDecimal } from 'src/common/helpers';

@Injectable()
export class FacturaService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly serviceDTE: ElectronicaService,
  ) { }

  async createContingencia(contingency: ContingencyDto, user: Usuarios) {
    let {
      fecha_inicio = '',
      hora_inicio = '',
      fecha_fin = '',
      hora_fin = '',
      motivo = '',
      tipo = 0,
      facturas = [],
    }: any = contingency;
    let date1 = new Date(fecha_inicio + ' ' + hora_inicio);
    let date2 = new Date(fecha_fin + ' ' + hora_fin);
    if (date1.getTime() > date2.getTime()) {
      throw new InternalServerErrorException("La fecha de inicio no puede ser mayor a la fecha de fin");
    }
    try {
      const contingencia = await this.prisma.contingencias.create({
        data: {
          fecha_inicio,
          hora_inicio,
          fecha_fin,
          hora_fin,
          motivo,
          tipo,
          json_response: '',
          id_usuario: user.id,
        }
      });
      const facturas_list = await this.prisma.facturas.findMany({
        where: {
          id_factura: {
            in: facturas
          },
          estado: 'ACTIVO',
          dte_procesado: false,
        },
      });
      let arrayInsert = [];
      for (let factura of facturas_list) {
        var jsonDte = JSON.parse(factura.dte_json);
        arrayInsert.push({
          id_factura: factura.id_factura,
          codigoGeneracion: jsonDte.identificacion.codigoGeneracion,
          tipoDoc: jsonDte.identificacion.tipoDte,
          id_contingencia: contingencia.id_contingencia
        });
      }
      await this.prisma.contingenciasDetalle.createMany({
        data: arrayInsert
      });
      const respAPI = await this.serviceDTE.generarContingencia(contingencia.id_contingencia);
      // 

      // for (let factura of facturas_list) {
      //   this.resendDte(factura.id_factura, user);
      // }
      return respAPI;
    } catch (error) {
      if ((error.response.data == null) && error.response.message != null) {
        throw new InternalServerErrorException(error.response.message)
      }
      throw new InternalServerErrorException('Error inesperado reviosar log');
    }
  }
  async create(createFacturaDto: CreateFacturaDto, user: Usuarios) {
    let {
      cliente = '',
      direccion = '',
      no_registro = '',
      nit = '',
      giro = '',
      id_municipio = null,
      id_tipo_factura = 0,
      subtotal = 0,
      descuento = 0,
      iva = 0,
      iva_retenido = 0,
      iva_percivido = 0,
      total = 0,
      efectivo = 0,
      tarjeta = 0,
      cheque = 0,
      transferencia = 0,
      credito = 0,
      id_metodo_pago = 0,
      id_cliente = 0,
      flete = 0,
      seguro = 0,
      id_tipo_item = 0,
      incoterms = 0,
      recinto_fiscal = '',
      regimen = '',
      id_descuento = null,
      detalle_factura = [],
    } = createFacturaDto;
    let id_sucursal = Number(user.id_sucursal);

    const id_usuario = Number(user.id);
    if (detalle_factura == null || detalle_factura.length == 0) {
      throw new NotFoundException('La factura debe tener detalle');
    }
    efectivo = Number(efectivo);
    id_cliente = Number(id_cliente);
    tarjeta = Number(tarjeta);
    iva_retenido = Number(iva_retenido);
    iva_retenido = Number(iva_retenido);
    cheque = Number(cheque);
    transferencia = Number(transferencia);
    credito = Number(credito);
    id_municipio = Number(id_municipio);
    incoterms = Number(incoterms);
    id_tipo_factura = Number(id_tipo_factura);
    id_descuento = id_descuento > 0 ? id_descuento : null;
    id_municipio = id_municipio > 0 ? id_municipio : null;
    incoterms = incoterms > 0 ? incoterms : null;
    id_tipo_factura = id_tipo_factura > 0 ? id_tipo_factura : 0;

    const tipoFactura = await this.prisma.facturasTipos.findFirst({
      where: { id_tipo_factura },
      include: { Bloques: { where: { estado: 'ACTIVO' } } },
    });
    const clientedB = await this.prisma.cliente.findFirst({
      where: { id_cliente },
    });

    let error = '';
    if (!(id_usuario > 0)) {
      error = 'Error de token, no se detecta al usuario';
    } else if (clientedB == null) {
      // error = "Por favor seleccione un cliente";
      id_cliente = 1;
    } else if (tipoFactura == null) {
      error = 'El tipo de factura no existe';
    } else if (tipoFactura.Bloques.length == 0) {
      error = 'El tipo de factura no tiene un bloque activo asignado';
    } else if (tipoFactura.Bloques[0].actual > tipoFactura.Bloques[0].hasta) {
      error =
        'El bloque de facturas ha finalizado, configure uno nuevo para continuar.';
      await this.prisma.facturasBloques.update({
        data: { estado: 'INACTIVO' },
        where: { id_bloque: tipoFactura.Bloques[0].id_bloque },
      });
    }
    if (error.length > 0) {
      throw new InternalServerErrorException(error);
    }
    let db_detalle = [];
    let descuNoSuj = 0;
    let descuExenta = 0;
    let descuGravada = 0;

    let totalNoSuj = 0;
    let totalExenta = 0;
    let totalGravada = 0;
    let totalNoGravado = 0;
    iva = 0;
    for (let index = 0; index < detalle_factura.length; index++) {
      const detalle: any = detalle_factura[index];
      if (
        detalle.nombre != null &&
        detalle.nombre.length > 0 &&
        detalle.id_catalogo != null &&
        detalle.id_catalogo > 0 &&
        detalle.precio_sin_iva != null &&
        detalle.precio_sin_iva > 0 &&
        detalle.precio_con_iva != null &&
        detalle.precio_con_iva > 0 &&
        detalle.cantidad != null &&
        detalle.cantidad > 0 &&
        detalle.subtotal != null &&
        detalle.subtotal > 0 &&
        detalle.descuento != null &&
        detalle.descuento >= 0 &&
        detalle.iva != null &&
        detalle.iva >= 0 &&
        detalle.total != null &&
        detalle.total > 0
      ) {
        const no_fact = tipoFactura?.Bloques[0]?.actual
          .toString()
          .padStart(6, '0');
        await this.descargarItemDeInventario(detalle, no_fact);

        let venta_grabada = detalle.tipo == 'GRABADO' ? detalle.total : 0;
        let venta_nosujeto = detalle.tipo == 'NOSUJETO' ? detalle.total : 0;
        let venta_exenta = detalle.tipo == 'EXENTA' ? detalle.total : 0;


        totalNoSuj =
          totalNoSuj + (detalle.tipo == 'NOSUJETO' ? detalle.total : 0);
        totalExenta =
          totalExenta + (detalle.tipo == 'EXENTA' ? detalle.total : 0);
        totalGravada =
          totalGravada + (detalle.tipo == 'GRABADO' ? detalle.total : 0);
        iva = iva + (detalle.tipo == 'GRABADO' ? detalle.iva : 0);
        db_detalle.push({
          tipo_detalle: detalle.tipo,
          id_factura: 0,
          id_catalogo: detalle.id_catalogo,
          precio_unitario: formatNumberDecimal(detalle.precio_unitario),
          codigo: detalle.codigo,
          nombre: detalle.nombre,
          precio_sin_iva: formatNumberDecimal(detalle.precio_sin_iva),
          precio_con_iva: formatNumberDecimal(detalle.precio_con_iva),
          cantidad: detalle.cantidad,
          subtotal: formatNumberDecimal(detalle.subtotal),
          descuento: formatNumberDecimal(detalle.descuento),
          id_descuento:
            (detalle.id_descuento != null && detalle.id_descuento) > 0
              ? detalle.id_descuento
              : null,
          iva: formatNumberDecimal(detalle.tipo == 'GRABADO' ? detalle.iva : 0),
          total: formatNumberDecimal(detalle.total),
          venta_grabada: formatNumberDecimal(venta_grabada),
          venta_nosujeto: formatNumberDecimal(venta_nosujeto),
          venta_exenta: formatNumberDecimal(venta_exenta),
        });
      }
    }
    if (db_detalle.length == 0) {
      throw new InternalServerErrorException(
        'El detalle de la factura esta incorrecto',
      );
    }
    iva = Number(iva.toFixed(2));
    total = Number(total.toFixed(2));
    descuento = 0;
    totalNoGravado = totalNoSuj + totalExenta;
    const bloque = tipoFactura?.Bloques[0];
    const id_bloque = tipoFactura?.Bloques[0].id_bloque;
    const numero_factura = bloque?.actual.toString().padStart(10, '0');
    let codIncoterms = null;
    let descIncoterms = null;
    if (incoterms != null && incoterms > 0) {
      const incotermsDB = await this.prisma.dTEIncoterms.findFirst({
        where: { id_incoterms: incoterms },
      });
      codIncoterms = incotermsDB.codigo;
      descIncoterms = incotermsDB.valor;
    }

    const factura = await this.prisma.facturas.create({
      data: {
        tipoItemExpor: Number(id_tipo_item),
        recintoFiscal: recinto_fiscal.toString(),
        regimen: regimen.toString(),
        id_sucursal,
        flete,
        seguro,
        cliente,
        numero_factura,
        direccion,
        no_registro,
        nit,
        giro,
        id_municipio,
        id_bloque,
        id_descuento,
        id_cliente,
        id_metodo_pago,
        id_usuario,
        codIncoterms,
        descIncoterms,
        efectivo: formatNumberDecimal(efectivo),
        tarjeta: formatNumberDecimal(tarjeta),
        cheque: formatNumberDecimal(cheque),
        transferencia: formatNumberDecimal(transferencia),
        credito: formatNumberDecimal(credito),
        subtotal: formatNumberDecimal(subtotal),
        descuento: formatNumberDecimal(descuento),
        iva: formatNumberDecimal(iva),
        iva_retenido: formatNumberDecimal(iva_retenido),
        iva_percivido: formatNumberDecimal(iva_percivido),
        total: formatNumberDecimal(total + flete + seguro),
        descuNoSuj: formatNumberDecimal(descuNoSuj),
        descuExenta: formatNumberDecimal(descuExenta),
        descuGravada: formatNumberDecimal(descuGravada),
        totalNoSuj: formatNumberDecimal(totalNoSuj),
        totalExenta: formatNumberDecimal(totalExenta),
        totalGravada: formatNumberDecimal(totalGravada),
        totalNoGravado: formatNumberDecimal(totalNoGravado),
      },
    });
    if (factura == null) {
      console.log(error);
      throw new InternalServerErrorException('Error inesperado reviosar log');
    }
    try {
      console.log('Llegamos qui');
      db_detalle = db_detalle.map((e) => {
        e.id_factura = factura.id_factura;
        return e;
      });
      console.log('Llegamos qui222');
      //TODO: hacer la verificasion por si el numero actual ya se paso el limite del campo hasta
      await this.prisma.facturasBloques.update({
        data: { actual: bloque!.actual + 1 },
        where: { id_bloque },
      });
      await this.prisma.facturasDetalle.createMany({
        data: db_detalle,
      });
      console.log('Llegamos qui33');
      const facturaCreada = await this.prisma.facturas.findUnique({
        where: { id_factura: factura.id_factura },
        include: {
          FacturasDetalle: { include: { Catalogo: true } },
          Sucursal: {
            include: {
              DTETipoEstablecimiento: true,
              Municipio: { include: { Departamento: true } },
            },
          },
          Bloque: {
            include: {
              Tipo: true,
            },
          },
          Cliente: {
            include: {
              // Sucursal: { include: { Municipio: { include: { Departamento: true } } } },
              Municipio: { include: { Departamento: true } },
              DTEActividadEconomica: true,
              DTETipoDocumentoIdentificacion: true,
              DTEPais: true
            },
          },
        },
      });
      console.log('Llegamos qui444');
      return await this.serviceDTE.generarFacturaElectronica(facturaCreada);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Error inesperado reviosar log');
    }
  }

  async buscarClientes(dataDto: BuscartCatalogoDto, user: Usuarios) {
    let { query = '' } = dataDto;
    if (query.length == 0) {
      throw new NotFoundException('El parametro no es valido');
    }
    let arrayQuery = query.split(' ');
    const data = await this.prisma.cliente.findMany({
      where: {
        estado: 'ACTIVO',
        AND: arrayQuery.map((contains: any) => {
          return {
            nombre: {
              contains,
              mode: 'insensitive',
            },
          };
        }),
      },
      orderBy: {
        nombre: 'desc',
      },
      take: 20,
      include: { Municipio: true },
    });
    return data;
  }
  async buscarCatalogo(dataDto: BuscartCatalogoDto, user: Usuarios) {
    let { query = '' } = dataDto;
    if (query.length == 0) {
      throw new NotFoundException('El parametro no es valido');
    }
    let arrayQuery = query.split(' ');
    let arrayName: any = arrayQuery.map((contains: any) => {
      return {
        nombre: {
          contains,
          mode: 'insensitive',
        },
      };
    });
    let arrayCode: any = arrayQuery.map((contains: any) => {
      return {
        codigo: {
          contains,
          mode: 'insensitive',
        },
      };
    });
    let data = await this.prisma.catalogo.findMany({
      where: {
        OR: [{ OR: [...arrayName] }, { OR: [...arrayCode] }],
        estado: 'ACTIVO',
      },
      include: {
        Inventario: {
          where: {
            existencia: {
              gte: 1,
            },
          },
        },
      },
    });
    data = data.map(e => {
      e.nombre = `${e.nombre} (${e.codigo})`
      return e;
    })
    return data;
  }
  async cierreManual(dataDto: CierreManualTDO, user: Usuarios) {
    let {
      venta_bruta = 0,
      para_llevar = 0,
      tarjeta_credomatic = 0,
      tarjeta_serfinza = 0,
      tarjeta_promerica = 0,
      bitcoin = 0,
      syke = 0,
      total_restante = 0,
      propina = 0,
      venta_nota_sin_iva = 0,
      cortecia = 0,
      anti_cobrados = 0,
      anti_reservas = 0,
      certificado_regalo = 0,
      hugo_app = 0,
      pedidos_ya = 0,
      compras = 0,
      entrega_efectivo = 0,
      fecha_cierre = 0,
      id_sucursal = 0,
      observacion = '',
    }: any = dataDto;
    id_sucursal = Number(id_sucursal);
    fecha_cierre = new Date(fecha_cierre);

    const sucursal = await this.prisma.sucursales.findFirst({
      where: { id_sucursal },
    });
    if (sucursal == null) {
      throw new NotFoundException('La sucursal no existe');
    }

    let id_usuario = Number(user.id);

    var data = await this.prisma.cierresDiarios.create({
      data: {
        venta_bruta,
        para_llevar,
        tarjeta_credomatic,
        tarjeta_serfinza,
        tarjeta_promerica,
        bitcoin,
        syke,
        total_restante,
        propina,
        venta_nota_sin_iva,
        cortecia,
        anti_cobrados,
        anti_reservas,
        certificado_regalo,
        hugo_app,
        pedidos_ya,
        compras,
        entrega_efectivo,
        fecha_cierre,
        id_usuario,
        id_sucursal: sucursal.id_sucursal,
        observacion,
      },
    });
    return data;
  }

  async obtenerListadoDepartamentos() {
    return await this.prisma.departamentos.findMany({
      where: { estado: 'ACTIVO' },
    });
  }

  async listadoFacturasErrorDTE() {
    let facturas = await this.prisma.facturas.findMany({
      where: { estado: 'ACTIVO', dte_procesado: false },
      include: { Bloque: { include: { Tipo: true } }, Cliente: true, ContingenciasDetalle: { include: { Contingencias: true } } },
      orderBy: {
        fecha_creacion: 'desc'
      }
    });
    let motivos = await this.prisma.dTETipoContingencia.findMany({
      where: { estado: 'ACTIVO' },
    });
    return { facturas, motivos };
  }
  async obtenerListadoFacturas(query: FechasFacturaDto, user: Usuarios) {
    var desde1: any = query.desde.toString().split('-');
    var hasta1: any = query.hasta.toString().split('-');
    var desde = new Date(desde1[0], desde1[1] - 1, desde1[2], 0, 0, 0);
    var hasta = new Date(hasta1[0], hasta1[1] - 1, hasta1[2], 23, 59, 59);
    hasta.setDate(hasta.getDate() + 1);

    let id_sucursal = Number(user.id_sucursal);
    var total_facturado = 0;
    var total_facturas = 0;
    var total_consumidor_final = 0;
    var total_facturas_consumidor_final = 0;
    var total_credito_fiscal = 0;
    var total_facturas_credito_fiscal = 0;
    var total_anuladas = 0;
    var total_facturas_anuladas = 0;

    const data = await this.prisma.facturas.findMany({
      where: {
        fecha_creacion: {
          gte: desde,
          lte: hasta,
        },
        id_sucursal,
        dte_procesado: true,
      },
      include: { Bloque: { include: { Tipo: true } }, Cliente: true },
      orderBy: [
        {
          id_factura: 'desc',
        },
      ],
    });
    data.forEach((e: any) => {
      total_facturas++;
      total_facturado += e.total ?? 0;
      if (e.estado == 'ANULADA') {
        total_anuladas += e.total ?? 0;
        total_facturas_anuladas++;
      } else if (e.Bloque.Tipo.id_tipo_factura == 1) {
        total_consumidor_final += e.total ?? 0;
        total_facturas_consumidor_final++;
      } else {
        total_credito_fiscal += e.total ?? 0;
        total_facturas_credito_fiscal++;
      }
    });
    let tipoInvalidacion = await this.prisma.dTETipoInvalidacion.findMany({
      where: { estado: 'ACTIVO' },
    });

    return {
      tipoInvalidacion,
      data,
      contadores: {
        total_facturado,
        total_facturas,
        total_consumidor_final,
        total_facturas_consumidor_final,
        total_credito_fiscal,
        total_facturas_credito_fiscal,
        total_anuladas,
        total_facturas_anuladas,
      },
    };
  }

  async obntenerMetodosDePago() {
    return await this.prisma.facturasMetodosDePago.findMany({
      where: { estado: 'ACTIVO' },
    });
  }
  async datosExtras() {

    const [tipoItem, recintoFiscal, regimen, incoterms] = await Promise.all([
      await this.prisma.dTETipoItem.findMany({ orderBy: { valor: 'asc' } }),
      await this.prisma.dTERecintoFiscal.findMany({ orderBy: { valor: 'asc' } }),
      await this.prisma.dTERegimen.findMany({ orderBy: { valor: 'asc' } }),
      await this.prisma.dTEIncoterms.findMany({ orderBy: { valor: 'asc' } }),
    ]);
    return { tipoItem, recintoFiscal, regimen, incoterms };
  }
  async obtenerListadoMunicipios(id: number) {
    let id_departamento: number = Number(id);
    if (!(id_departamento > 0)) {
      throw new NotFoundException('Identificador de departamento incorrecto');
    }
    return await this.prisma.municipios.findMany({
      where: { estado: 'ACTIVO', id_departamento },
    });
  }
  async obtenerFactura(id: number, user: Usuarios) {
    let id_factura: number = Number(id);
    let id_sucursal = Number(user.id_sucursal);
    const data = await this.prisma.facturas.findFirst({
      where: { id_factura, id_sucursal },
      include: {
        FacturasDetalle: true,
        Bloque: {
          select: {
            Tipo: { select: { nombre: true, id_tipo_factura: true } },
            tira: true,
            serie: true,
          },
        },
        Municipio: { select: { nombre: true, Departamento: true } },
        Metodo: true,
      },
    });

    if (!data) throw new NotFoundException('La factura no existe');
    const data_sistema = await this.prisma.generalData.findFirst({ select: { id_general: true, nombre_sistema: true, direccion: true, razon: true, nit: true, nrc: true, cod_actividad: true, desc_actividad: true, nombre_comercial: true, contactos: true, correo: true, cod_estable_MH: true, cod_estable: true, cod_punto_venta_MH: true, cod_punto_venta: true, impuesto: true, icono_sistema: true, icono_factura: true, id_tipo_contribuyente: true, } });
    return {
      data,
      data_sistema,
    };
  }

  async getNumeroFactura(id_tipo_factura: number, user: Usuarios) {
    let id_sucursal = Number(user.id_sucursal);
    if (!(id_tipo_factura > 0)) {
      throw new InternalServerErrorException(
        'El tipo de factura es incorrecto',
      );
    }
    let tipoFactura: any = await this.prisma.facturasTipos.findFirst({
      where: { id_tipo_factura },
      include: {
        Bloques: { where: { estado: 'ACTIVO', id_sucursal }, take: 1 },
      },
    });
    if (tipoFactura == null || tipoFactura.Bloques.length == 0) {
      throw new InternalServerErrorException(
        'No existe un bloque de facturas configurado para este tipo de factura',
      );
    } else {
      tipoFactura.Bloques = tipoFactura.Bloques[0];
      return tipoFactura;
    }
  }
  async resendDte(id_factura: number, user: Usuarios) {
    const facturaCreada = await this.prisma.facturas.findUnique({
      where: { id_factura: id_factura },
      include: {
        FacturasDetalle: { include: { Catalogo: true } },
        Sucursal: {
          include: {
            DTETipoEstablecimiento: true,
            Municipio: { include: { Departamento: true } },
          },
        },
        Bloque: {
          include: {
            Tipo: true,
          },
        },
        Cliente: {
          include: {
            Municipio: { include: { Departamento: true } },
            DTEActividadEconomica: true,
            DTETipoDocumentoIdentificacion: true,
            DTEPais: true
          },
        },
      },
    });
    return await this.serviceDTE.generarFacturaElectronica(facturaCreada);
  }
  async resendEmailDte(id_factura: number) {
    return await this.serviceDTE.resendEmails(id_factura);
  }

  async findOne(id: number) {
    return `This action returns a #${id} factura`;
  }

  update(id: number, updateFacturaDto: UpdateFacturaDto) {
    return `This action updates a #${id} factura`;
  }

  async remove(
    id_factura: number,
    user: Usuarios,
    tipoAnulacion: number,
    motivoAnulacion: string,
  ) {
    let id_sucursal = Number(user.id_sucursal);
    const data = await this.prisma.facturas.findMany({
      where: { estado: 'ACTIVO', id_factura, id_sucursal },
    });

    if (!data) throw new NotFoundException('La factura no existe');
    const facturaCreada = await this.prisma.facturas.findUnique({
      where: { id_factura },
      include: {
        FacturasDetalle: true,
        Sucursal: {
          include: {
            DTETipoEstablecimiento: true,
            Municipio: { include: { Departamento: true } },
          },
        },
        Bloque: {
          include: {
            Tipo: true,
          },
        },
        Cliente: {
          include: {
            // Sucursal: { include: { Municipio: { include: { Departamento: true } } } },
            Municipio: { include: { Departamento: true } },
            DTEActividadEconomica: true,
            DTETipoDocumentoIdentificacion: true,
          },
        },
      },
    });
    var usuario = await this.prisma.usuarios.findFirst({
      where: { id: user.id, estado: 'ACTIVO' },
      include: { DTETipoDocumentoIdentificacion: true },
    });
    const resp = await this.serviceDTE.anularFacturaElectronica(
      facturaCreada,
      usuario,
      tipoAnulacion,
      motivoAnulacion,
    );
    if (resp.length == 0) {
      await this.prisma.facturas.update({
        where: { id_factura },
        data: { estado: 'ANULADA' },
      });

    }
    return resp;
  }
  async removeDebit(
    id_factura: number,
    user: Usuarios,
  ) {
    let id_sucursal = Number(user.id_sucursal);
    const data = await this.prisma.facturas.findMany({
      where: { estado: 'ACTIVO', id_factura, id_sucursal },
    });

    if (!data) throw new NotFoundException('La factura no existe');
    const facturaCreada = await this.prisma.facturas.findUnique({
      where: { id_factura },
      include: {
        FacturasDetalle: true,
        Sucursal: {
          include: {
            DTETipoEstablecimiento: true,
            Municipio: { include: { Departamento: true } },
          },
        },
        Bloque: {
          include: {
            Tipo: true,
          },
        },
        Cliente: {
          include: {
            Municipio: { include: { Departamento: true } },
            DTEActividadEconomica: true,
            DTETipoDocumentoIdentificacion: true,
          },
        },
      },
    });
    var usuario = await this.prisma.usuarios.findFirst({
      where: { id: user.id, estado: 'ACTIVO' },
      include: { DTETipoDocumentoIdentificacion: true },
    });
    const resp = await this.serviceDTE.debitFacturaElectronica(
      facturaCreada,
      usuario,
    );
    if (resp != null && resp == 'RECIBIDO') {
      await this.prisma.facturas.update({
        where: { id_factura },
        data: { estado: 'ANULADA' },
      });
    }
    return resp;
  }
  async removeSinDTE(
    id_factura: number,
    user: Usuarios,
  ) {
    let id_sucursal = Number(user.id_sucursal);
    const data = await this.prisma.facturas.findMany({
      where: { estado: 'ACTIVO', id_factura, id_sucursal },
    });

    if (!data) throw new NotFoundException('La factura no existe');
    await this.prisma.facturas.update({
      where: { id_factura },
      data: { estado: 'ANULADA' },
    });
    return data;
  }

  async descargarItemDeInventario(item: any, nomero_factura: any = 0) {
    if (item.item != null && item.item.Inventario.length > 0) {
      var id_inventario = item.item.Inventario[0].id_inventario;
      var inventario = await this.prisma.inventario.findFirst({
        where: {
          id_inventario,
        },
      });

      await this.prisma.inventario.update({
        where: {
          id_inventario,
        },
        data: {
          existencia: (inventario?.existencia ?? 0) - item.cantidad,
        },
      });

      var kardex: any = await this.prisma.kardex.findFirst({
        where: {
          id_catalogo: item.id_catalogo,
        },
        orderBy: {
          id_kardex: 'desc',
        },
      });
      var nInventario = (kardex?.inventario ?? 0) - item.cantidad ?? 0;
      await this.prisma.kardex.create({
        data: {
          id_catalogo: item.id_catalogo,
          id_compras_detalle: kardex?.id_compras_detalle ?? 0,
          tipo_movimiento: 2,
          descripcion: `Salida por Factura # ${nomero_factura}`,
          costo: kardex?.costo,
          cantidad: item.cantidad,
          subtotal: item.cantidad * (kardex?.costo_promedio ?? 0),
          costo_promedio: kardex?.costo_promedio ?? 0,
          inventario: nInventario,
          total: nInventario * (kardex?.costo_promedio ?? 0),
        },
      });
    }
  }
}
