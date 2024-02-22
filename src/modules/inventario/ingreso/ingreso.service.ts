import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Usuarios } from '@prisma/client';
import { PrismaService } from 'src/common/services';
import {
  BuscarCatalogoDto,
  CompraServicioDto,
  CreateIngresoDto,
  FechasIngresosDto,
  GenerarAChequeDTS,
  PaginationIngresoDto,
  ServicioRDTO,
  VerificarServicioDto,
  comprasAChequeDTS,
} from './dto';

@Injectable()
export class IngresoService {


  constructor(
    private readonly prisma: PrismaService,
  ) { }

  async servicioVerficar(data: VerificarServicioDto, user: Usuarios) {
    let {
      numero_factura = "",
      id_proveedor = 0,
    } = data;
    id_proveedor = Number(id_proveedor);
    id_proveedor = id_proveedor > 0 ? id_proveedor : null;

    var compra = await this.prisma.compras.findFirst({
      where: {
        id_proveedor,
        numero_factura
      }
    });
    return compra;
  }

  async generarACheque(dataR: GenerarAChequeDTS, user: Usuarios) {

    let { idsProveedores = [], id_sucursal = 0 } = dataR;

    if (!(idsProveedores.length > 0)) {
      throw new NotFoundException("El listado de compras no es valido")
    }
    id_sucursal = Number(id_sucursal);
    let wSucursal = {};
    if (id_sucursal > 0) {
      wSucursal = { id_sucursal };
    }
    let data = 0;
    for (let index = 0; index < idsProveedores.length; index++) {
      const element: any = idsProveedores[index];

      var datos = await this.prisma.compras.updateMany({
        where: {
          id_proveedor: Number(element.id_proveedor),
          estado_pago: "ENCHEQUE",
          ...wSucursal,
        },
        data: {
          estado_pago: "PAGADO",
          fecha_actualizacion: new Date(),
          no_cheque: element.no_cheque
        },
      });

      if (datos.count > 0) {
        data++;
      }
    }
    return "Compras procesadas";

  }
  async comprasACheque(dataR: comprasAChequeDTS, user: Usuarios) {
    let { idsCompras = [] } = dataR;

    if (!(idsCompras.length > 0)) {
      throw new NotFoundException("El listado de compras no es valido")
    }

    const data = await this.prisma.compras.updateMany({
      where: {
        OR: idsCompras.map((contains: number) => {
          return {
            id_compras: contains,
          };
        }),
      },
      data: {
        estado_pago: "ENCHEQUE",
      },
    });
    return "Compras procesadas"
  }
  async buscarProveedores(dataR: BuscarCatalogoDto, user: Usuarios) {
    let { query = "" } = dataR;
    if (query.length == 0) {
      throw new NotFoundException("El parametro no es valido")
    }
    let consultas = [];
    if (query.length > 3) {
      let array = query.split(" ");
      let mode = "insensitive";
      consultas = array.map((contains: any) => {
        return {
          AND: [
            {
              OR: [
                { nombre: { contains, mode } },
                { giro: { contains, mode } },
                { razon_social: { contains, mode } },
                { registro_nrc: { contains, mode } },
                { nit: { contains, mode } },
                { direccion: { contains, mode } },
                { dui: { contains, mode } },
              ],
            },
          ],
        };
      });
    }
    const where = { AND: [{ estado: "ACTIVO" }, ...consultas] };
    const data = await this.prisma.proveedores.findMany({
      where,
      orderBy: {
        nombre: "desc",
      },
      take: 20,
      include: { Municipio: true },
    });
    return data;
  }

  async buscarCatalogo(dataR: BuscarCatalogoDto, user: Usuarios) {
    let { query = "", id_bodega = 0 } = dataR;
    id_bodega = Number(id_bodega);
    if (query.length == 0) {
      throw new NotFoundException("El parametro no es valido")
    }
    let arrayQuery = query.split(" ");
    const data = await this.prisma.catalogo.findMany({
      where: {
        OR: arrayQuery.map((contains: any) => {
          return {
            nombre: {
              contains,
              mode: "insensitive",
            },
          };
        }),
        AND: [
          {
            id_tipo: 2,
          },
        ],
      },
      include: {
        Inventario: { where: { existencia: { gte: 1 }, id_bodega }, take: 1 },
        Kardex: {
          where: { inventario: { gte: 1 } },
          orderBy: { id_kardex: "desc" },
          take: 1,
        },
      },
    });
    return data;
  }

  async servicioR(data: ServicioRDTO, user: Usuarios) {
    const id_usuario = Number(user.id);
    try {
      let {
        id_sucursal = 0,
        id_tipo_factura = 3,
        numero_factura = "",
        nombre_proveedor = "",
        tipo_inventario = "MP",
        tipo_pago = "CONTADO",
        dui_proveedor = "",
        fecha_factura = new Date(),
        detalle = "",
        monto = 0,
      }: any = data;
      var fecha_de_pago = new Date();

      id_sucursal = Number(id_sucursal);
      id_sucursal = id_sucursal > 0 ? id_sucursal : Number(user.id_sucursal);
      fecha_factura = new Date(fecha_factura);
      const compra = await this.prisma.compras.create({
        data: {
          numero_factura,
          fecha_factura,
          tipo_pago,
          dui_proveedor,
          tipo_inventario,
          detalle,
          nombre_proveedor,
          subtotal: monto,
          total: monto,
          id_usuario,
          id_sucursal,
          fecha_de_pago,
          id_tipo_factura,
          estado_pago: "PAGADO",
        },
      });
      return compra;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException("Error inesperado reviosar log");
    }
  }


  async createServicio(createIngresoDto: CompraServicioDto, user: Usuarios) {

    const id_usuario = Number(user.id);
    try {
      let {
        numero_factura = "",
        numero_quedan = "",
        fecha_factura = new Date(),
        tipo_pago = "CONTADO",
        tipo_compra = "INTERNA",
        tipo_factura = "GRABADO",
        tipo_inventario = "MP",
        dias_credito = 0,
        id_sucursal = 0,
        detalle = "",
        iva = 0,
        cesc = 0,
        iva_percivido = 0,
        monto = 2,
        fovial = 0,
        cotrans = 0,
        total = 0,
        id_proveedor = 0,
      }: any = createIngresoDto;

      id_sucursal = Number(id_sucursal);
      id_sucursal = id_sucursal > 0 ? id_sucursal : Number(user.id_sucursal);
      dias_credito = Number(dias_credito);
      fecha_factura = new Date(fecha_factura);
      var fecha_de_pago = new Date();
      if (tipo_pago == "CREDITO" && dias_credito > 0) {
        fecha_de_pago.setDate(fecha_de_pago.getDate() + dias_credito);
      }
      const compra = await this.prisma.compras.create({
        data: {
          numero_factura,
          fecha_factura,
          tipo_pago,
          tipo_compra,
          tipo_factura,
          dias_credito,
          tipo_inventario,
          detalle,
          iva,
          cesc,
          iva_percivido,
          subtotal: monto,
          fovial,
          cotrans,
          total,
          id_proveedor,
          id_usuario,
          id_sucursal,
          numero_quedan,
          fecha_de_pago,
          estado_pago: tipo_pago == "CREDITO" ? "PENDIENTE" : "PAGADO",
        },
      });
      return compra;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException("Error inesperado reviosar log");
    }

  }
  async create(createIngresoDto: CreateIngresoDto, user: Usuarios) {

    let {
      id_proveedor = 0,
      id_tipo_factura = 0,
      detalle_factura = [],
      numero_factura = "",
      fecha_factura = new Date(),
      tipo_pago = "CONTADO",
      dias_credito = 0,
      id_bodega = 0,
      subtotal = 0,
      descuento = 0,
      iva = 0,
      iva_retenido = 0,
      iva_percivido = 0,
      total = 0,
    }: any = createIngresoDto;
    let id_sucursal = Number(user.id_sucursal);
    fecha_factura = new Date(fecha_factura);
    const id_usuario = Number(user.id);
    if (detalle_factura == null || detalle_factura.length == 0) {
      throw new InternalServerErrorException('La factura debe tener detalle');
    }
    try {

      dias_credito = dias_credito > 0 ? dias_credito : null;
      var fecha_de_pago = new Date();
      if (tipo_pago == "CREDITO" && dias_credito > 0) {
        fecha_de_pago.setDate(fecha_de_pago.getDate() + dias_credito);
      }

      id_proveedor = Number(id_proveedor);
      iva_retenido = Number(iva_retenido);
      id_tipo_factura = Number(id_tipo_factura);
      id_bodega = Number(id_bodega);
      id_tipo_factura = id_tipo_factura > 0 ? id_tipo_factura : 0;
      const [facturasTipos, proveedores, bodega] = await Promise.all([
        await this.prisma.facturasTipos.findFirst({
          where: { id_tipo_factura, estado: "ACTIVO" },
        }),
        await this.prisma.proveedores.findFirst({
          where: { id_proveedor, estado: "ACTIVO" },
        }),
        await this.prisma.bodegas.findFirst({
          where: { id_bodega, estado: "ACTIVO" },
        }),
      ]);

      let error = "";
      if (!(id_usuario > 0)) {
        error = "Error de token, no se detecta al usuario";
      } else if (facturasTipos == null) {
        error = "Por favor seleccione un tipo de factura valido";
      } else if (proveedores == null) {
        error = "El proveedor seleccionado no es valido";
      } else if (bodega == null) {
        error = "La bodega seleccionada no es valida";
      }
      if (error.length > 0) {
        throw new InternalServerErrorException('La factura debe tener detalle');
      }

      let db_detalle = [];
      for (let index = 0; index < detalle_factura.length; index++) {
        const detalle = detalle_factura[index];
        if (
          detalle.id_catalogo != null &&
          detalle.id_catalogo > 0 &&
          detalle.costo_unitario != null &&
          detalle.costo_unitario > 0 &&
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
          db_detalle.push({
            id_compras: 0,
            id_catalogo: Number(detalle.id_catalogo),
            codigo: detalle.codigo,
            nombre: detalle.nombre,
            costo_unitario: detalle.costo_unitario,
            cantidad: detalle.cantidad,
            subtotal: detalle.subtotal,
            descuento_porcentaje:
              detalle.descuento_porcentaje > 0 ? detalle.descuento_porcentaje : 0,
            descuento_monto:
              detalle.descuento_monto > 0 ? detalle.descuento_monto : 0,
            iva: detalle.iva,
            total: detalle.total,
          });
        }
      }
      if (db_detalle.length == 0) {
        throw new InternalServerErrorException('El detalle de la factura esta incorrecto');
      }
      const compra = await this.prisma.compras.create({
        data: {
          id_proveedor,
          numero_factura,
          tipo_pago,
          fecha_factura,
          subtotal,
          descuento,
          iva,
          iva_retenido,
          iva_percivido,
          total,
          id_usuario,
          dias_credito,
          id_bodega,
          id_sucursal,
          fecha_de_pago,
          estado_pago: tipo_pago == "CREDITO" ? "PENDIENTE" : "PAGADO",
        },
      });
      if (compra == null) {
        throw new InternalServerErrorException('Ha ocurrido un error al crear la factura favor intentarlo mas tarde');
      }
      db_detalle = db_detalle.map((e) => {
        e.id_compras = compra.id_compras;
        return e;
      });
      //TODO: hacer la verificasion por si el numero actual ya se paso el limite del campo hasta

      var detalleCompra = await this.prisma.comprasDetalle.createMany({
        data: db_detalle,
      });

      if (detalleCompra.count > 0) {
        await this.procesarInKardex(compra.id_compras);
      }

      const facturaCreada = await this.prisma.compras.findUnique({
        where: { id_compras: compra.id_compras },
        include: {
          ComprasDetalle: true,
          Proveedor: true,
          Bodegas: true,
        },
      });
      return facturaCreada;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error.response.message);
    }
  }


  async findBodegas(id_sucursal: number) {
    return await this.prisma.bodegas.findMany({
      where: { estado: "ACTIVO", id_sucursal },
    });
  }
  async listadoExistencias(resp: PaginationIngresoDto, user: Usuarios) {

    let {
      pagina = 1,
      registrosXpagina = 10,
      query = "",
      sucursal = 0,
      bodega = 0,
    } = resp;
    pagina = Number(pagina);
    sucursal = Number(sucursal);
    bodega = Number(bodega);
    registrosXpagina = Number(registrosXpagina);
    pagina = pagina > 0 ? pagina : 0;
    registrosXpagina = registrosXpagina > 0 ? registrosXpagina : 10;

    let consultas = [];
    if (query.length > 3) {
      let array = query.split(" ");
      consultas = array.map((contains: any) => {
        return {
          AND: [
            {
              OR: [
                {
                  Catalogo: { codigo: { contains } },
                },
                {
                  Catalogo: { nombre: { contains } },
                },
              ],
            },
          ],
        };
      });
    }
    var wSusucursales: any = {};
    var wBodega = {};
    if (bodega > 0) {
      wBodega = { id_bodega: bodega };
    } else if (sucursal > 0) {
      var sucursales = await this.prisma.bodegas.findMany({
        where: { id_sucursal: sucursal, estado: "ACTIVO" },
      });

      var array = sucursales.map((e: any) => {
        return {
          id_bodega: e.id_bodega,
        };
      });

      wSusucursales = {
        OR: array,
      };
    }
    const where = {
      AND: [
        {
          existencia: {
            gte: 1,
          },
        },
        ...consultas,
      ],
      ...wBodega,
      ...wSusucursales,
    };
    const total = await this.prisma.inventario.count({ where });
    const registros = await this.prisma.inventario.findMany({
      where,
      include: { Bodegas: { include: { Sucursales: true } }, Catalogo: true },
      take: registrosXpagina,
      skip: (pagina - 1) * registrosXpagina,
    });
    const totalFiltrado = await registros.length;
    return {
      total,
      totalFiltrado,
      pagina,
      registrosXpagina,
      registros,
    }
  }

  async obtenerFactura(id_compras: number, user: Usuarios) {
    let id_sucursal = Number(user.id_sucursal);
    const data = await this.prisma.compras.findFirst({
      where: { id_compras, id_sucursal },
      include: {
        ComprasDetalle: true,
        Proveedor: true,
      },
    });

    if (!data) {
      throw new NotFoundException("La factura no existe")
    }

    const data_sistema = await this.prisma.generalData.findFirst({ select: { id_general: true, nombre_sistema: true, direccion: true, razon: true, nit: true, nrc: true, cod_actividad: true, desc_actividad: true, nombre_comercial: true, contactos: true, correo: true, cod_estable_MH: true, cod_estable: true, cod_punto_venta_MH: true, cod_punto_venta: true, impuesto: true, icono_sistema: true, icono_factura: true, id_tipo_contribuyente: true,} });
    return {
      data,
      data_sistema,
    }
  }
  async findListadoFacturas(query: FechasIngresosDto, user: Usuarios) {
    var desde: any = query.desde!.toString();
    var hasta: any = query.hasta!.toString();
    let id_sucursal = Number(user.id_sucursal);

    // fecha.setDate(fecha.getDate() + dias);
    desde = new Date(desde);
    hasta = new Date(hasta);
    hasta.setDate(hasta.getDate() + 1);

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
      include: { Bloque: { include: { Tipo: true } } },
      orderBy: [
        {
          id_factura: "asc",
        },
      ],
    });
    data.forEach((e: any) => {
      total_facturas++;
      total_facturado += e.total ?? 0;
      if (e.estado == "ANULADA") {
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

    return {
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

  async findListadoComprasCredito(id_sucursal: number) {

    let wSucursal = {};
    if (id_sucursal > 0) {
      wSucursal = { id_sucursal };
    }
    var estado_pago: any = "PENDIENTE";
    var proveedores = await this.prisma.compras.groupBy({
      by: ["id_proveedor"],
      where: {
        ...wSucursal,
        tipo_pago: "CREDITO",
        estado_pago,
      },
    });

    var data = [];
    for (let index = 0; index < proveedores.length; index++) {
      const element = proveedores[index];
      var provv = await this.prisma.proveedores.findFirst({
        where: { id_proveedor: element.id_proveedor ?? 0 },
        include: { TipoProveedor: true, },
      });

      var compras = await this.prisma.compras.findMany({
        where: {
          id_proveedor: element.id_proveedor,
          estado_pago,
          ...wSucursal,
        },
        include: {
          FacturasTipos: true,
          Sucursales: true,
        }
      });
      var registro = await this.prisma.compras.aggregate({
        _sum: {
          total: true,
        },
        where: {
          id_proveedor: element.id_proveedor,
          estado_pago,
          ...wSucursal,
        },
      });
      data.push({
        proveedor: provv ?? "",
        monto: registro._sum.total ?? 0,
        compras
      });
    }

    return data;

  }


  procesarInKardex = async (id_compras: number) => {
    const compra = await this.prisma.compras.findUnique({
      where: { id_compras: id_compras },
      include: {
        ComprasDetalle: true,
        Proveedor: true,
        Bodegas: true,
      },
    });

    if (compra != null) {
      let descripcion =
        "Ingreso por compra con numero de factura #" + compra.numero_factura;
      var id_bodega = compra.id_bodega;
      let dataKardex = [];
      for (let index = 0; index < compra.ComprasDetalle.length; index++) {
        const element = compra.ComprasDetalle[index];
        let id_catalogo = element.id_catalogo ?? 0;
        let id_compras_detalle = element.id_compras_detalle ?? 0;
        let costo = element.costo_unitario ?? 0;
        let costo_promedio = element.costo_unitario ?? 0;
        let cantidad = element.cantidad ?? 0;
        let inventario = element.cantidad ?? 0;
        let subtotal = element.subtotal ?? 0;
        let total = element.total ?? 0;
        let tipo_movimiento = 1; // Entrada
        var kardexItem = await this.prisma.kardex.findFirst({
          where: { id_catalogo },
          orderBy: { id_kardex: "desc" },
          take: 1,
        });

        if (kardexItem != null) {
          let totalK = kardexItem.total ?? 0;
          let existenciaK = kardexItem.inventario ?? 0;
          let totalIng = element.total ?? 0;
          costo_promedio = (totalK + totalIng) / (existenciaK + cantidad);
          inventario += existenciaK;
          total += totalK;
        }
        dataKardex.push({
          id_catalogo,
          id_compras_detalle,
          tipo_movimiento,
          descripcion,
          costo,
          cantidad,
          subtotal,
          costo_promedio,
          inventario,
          total,
        });

        var invRegistro = await this.prisma.inventario.findFirst({
          where: { id_catalogo, existencia: { gte: 1 }, id_bodega },
          orderBy: { id_inventario: "desc" },
          take: 1,
        });

        if (invRegistro != null) {
          var existencia = (invRegistro.existencia ?? 0) + cantidad;
          await this.prisma.inventario.update({
            where: { id_inventario: invRegistro.id_inventario },
            data: {
              costo_unitario: costo_promedio,
              existencia,
              costo_total: costo_promedio * existencia,
            },
          });
        } else {
          await this.prisma.inventario.create({
            data: {
              id_catalogo,
              id_compras_detalle,
              id_bodega,
              costo_unitario: costo_promedio,
              existencia: cantidad,
              costo_total: costo_promedio * cantidad,
            },
          });
        }
      }

      await this.prisma.kardex.createMany({
        data: dataKardex,
      });
    }
  }
}
