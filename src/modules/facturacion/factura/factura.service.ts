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
} from './dto';
import { ElectronicaService } from '../electronica/electronica.service';

@Injectable()
export class FacturaService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly serviceDTE: ElectronicaService,
  ) { }

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
    id_tipo_factura = Number(id_tipo_factura);
    id_descuento = id_descuento > 0 ? id_descuento : null;
    id_municipio = id_municipio > 0 ? id_municipio : null;
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

        let venta_grabada = detalle.tipo == "GRABADO" ? detalle.total : 0;
        let venta_nosujeto = detalle.tipo == "NOSUJETO" ? detalle.total : 0;
        let venta_exenta = detalle.tipo == "EXENTA" ? detalle.total : 0;

        // descuNoSuj = descuNoSuj + (detalle.tipo == "NOSUJETO" ? detalle.descuento : 0);
        // descuExenta = descuExenta + (detalle.tipo == "EXENTA" ? detalle.descuento : 0);
        // descuGravada = descuGravada + (detalle.tipo == "GRABADO" ? detalle.descuento : 0);

        totalNoSuj = totalNoSuj + (detalle.tipo == "NOSUJETO" ? detalle.total : 0);
        totalExenta = totalExenta + (detalle.tipo == "EXENTA" ? detalle.total : 0);
        totalGravada = totalGravada + (detalle.tipo == "GRABADO" ? detalle.total : 0);
        iva = iva + (detalle.tipo == "GRABADO" ? detalle.iva : 0);
        db_detalle.push({
          tipo_detalle: detalle.tipo,
          id_factura: 0,
          id_catalogo: detalle.id_catalogo,
          precio_unitario: detalle.precio_unitario,
          codigo: detalle.codigo,
          nombre: detalle.nombre,
          precio_sin_iva: detalle.precio_sin_iva,
          precio_con_iva: detalle.precio_con_iva,
          cantidad: detalle.cantidad,
          subtotal: detalle.subtotal,
          descuento: detalle.descuento,
          id_descuento:
            (detalle.id_descuento != null && detalle.id_descuento) > 0
              ? detalle.id_descuento
              : null,
          iva: detalle.tipo == "GRABADO" ? detalle.iva : 0,
          total: detalle.total,
          venta_grabada,
          venta_nosujeto,
          venta_exenta,
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
    const factura = await this.prisma.facturas.create({
      data: {
        id_sucursal,
        cliente,
        numero_factura,
        direccion,
        no_registro,
        nit,
        giro,
        id_municipio,
        id_bloque,
        efectivo,
        id_descuento,
        id_cliente,
        tarjeta,
        cheque,
        transferencia,
        credito,
        id_metodo_pago,
        subtotal,
        descuento,
        iva,
        iva_retenido,
        iva_percivido,
        total,
        id_usuario,
        descuNoSuj,
        descuExenta,
        descuGravada,
        totalNoSuj,
        totalExenta,
        totalGravada,
        totalNoGravado,
      },
    });
    if (factura == null) {
      console.log(error);
      throw new InternalServerErrorException('Error inesperado reviosar log');
    }
    try {
      console.log("Llegamos qui");
      db_detalle = db_detalle.map((e) => {
        e.id_factura = factura.id_factura;
        return e;
      });
      console.log("Llegamos qui222");
      //TODO: hacer la verificasion por si el numero actual ya se paso el limite del campo hasta
      await this.prisma.facturasBloques.update({
        data: { actual: bloque!.actual + 1 },
        where: { id_bloque },
      });
      await this.prisma.facturasDetalle.createMany({
        data: db_detalle,
      });
      console.log("Llegamos qui33");
      const facturaCreada = await this.prisma.facturas.findUnique({
        where: { id_factura: factura.id_factura },
        include: {
          FacturasDetalle: true,
          Sucursal: { include: { DTETipoEstablecimiento: true, Municipio: { include: { Departamento: true } } } },
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
            }
          }
        },
      });
      console.log("Llegamos qui444");
      this.serviceDTE.generarFacturaElectronica(facturaCreada);

      console.log("Llegamos qui555");
      return facturaCreada;
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
    const data = await this.prisma.catalogo.findMany({
      where: {
        OR: arrayQuery.map((contains: any) => {
          return {
            nombre: {
              contains,
              mode: 'insensitive',
            },
          };
        }),
        estado: 'ACTIVO'
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
  async obtenerListadoFacturas(query: FechasFacturaDto, user: Usuarios) {

    var desde1: any = query.desde.toString().split("-");
    var hasta1: any = query.hasta.toString().split("-");
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
    let tipoInvalidacion = await this.prisma.dTETipoInvalidacion.findMany({ where: { estado: 'ACTIVO' } });

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

  findAll() {
    return `This action returns all factura`;
  }
  async obntenerMetodosDePago() {
    return await this.prisma.facturasMetodosDePago.findMany({
      where: { estado: 'ACTIVO' },
    });
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
    const data_sistema = await this.prisma.generalData.findFirst();
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
        FacturasDetalle: true,
        Sucursal: { include: { DTETipoEstablecimiento: true, Municipio: { include: { Departamento: true } } } },
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
          }
        }
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

  async remove(id_factura: number, user: Usuarios, tipoAnulacion: number, motivoAnulacion: string) {
    let id_sucursal = Number(user.id_sucursal);
    const data = await this.prisma.facturas.findMany({
      where: { estado: 'ACTIVO', id_factura, id_sucursal },
    });

    if (!data) throw new NotFoundException('La factura no existe');
    const facturaCreada = await this.prisma.facturas.findUnique({
      where: { id_factura },
      include: {
        FacturasDetalle: true,
        Sucursal: { include: { DTETipoEstablecimiento: true, Municipio: { include: { Departamento: true } } } },
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
          }
        }
      },
    });
    var usuario = await this.prisma.usuarios.findFirst({
      where: { id: user.id, estado: 'ACTIVO' },
      include: { DTETipoDocumentoIdentificacion: true }
    });
    let resp = await this.serviceDTE.anularFacturaElectronica(facturaCreada, usuario, tipoAnulacion, motivoAnulacion);
    await this.prisma.facturas.update({
      where: { id_factura },
      data: { estado: 'ANULADA' },
    });
    return resp;
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
