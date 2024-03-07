import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/common/services';
import { CompraslDto } from './dto/compras.dto';
import { ComprasContadoDto } from './dto/compras.contado.dto';

@Injectable()
export class ComprasService {


  constructor(
    private readonly prisma: PrismaService,
  ) { }
  async libroCompras(params: CompraslDto) {
    var desde1: any = params.desde.toString().split("-");
    var hasta1: any = params.hasta.toString().split("-");
    var desde = new Date(desde1[0], desde1[1] - 1, desde1[2], 0, 0, 0);
    var hasta = new Date(hasta1[0], hasta1[1] - 1, hasta1[2], 23, 59, 59);
    var data = await this.prisma.compras.findMany({
      where: {
        fecha_creacion: {
          gte: desde,
          lte: hasta,
        },
      },
      include: { Proveedor: true },
    });

    return data;
  }
  async libroComprasContado(params: ComprasContadoDto) {
    var desde1: any = params.fecha!.toString().split("-");
    var hasta1: any = params.fecha!.toString().split("-");
    var id_sucursal: any = params.id_sucursal;
    var desde = new Date(desde1[0], desde1[1] - 1, desde1[2], 0, 0, 0);
    var hasta = new Date(hasta1[0], hasta1[1] - 1, hasta1[2], 23, 59, 59);

    id_sucursal = Number(id_sucursal);
    var wSucursal = {};
    if (id_sucursal > 0) {
      wSucursal = { id_sucursal };
    }
    var data = await this.prisma.compras.findMany({
      where: {
        fecha_creacion: {
          gte: desde,
          lte: hasta,
        },
        ...wSucursal,
        tipo_pago: "CONTADO",
      },
      include: { Proveedor: true },
    });
    return data;
  }
  async obtenerListadoCompras(params: CompraslDto) {
    var desde: any = params.desde!.toString();
    var hasta: any = params.hasta!.toString();
    desde = new Date(desde);
    hasta = new Date(hasta);
    hasta.setHours(hasta.getHours() + 23);
    hasta.setMinutes(hasta.getMinutes() + 59);
    hasta.setSeconds(hasta.getSeconds() + 59);  
    const data = await this.prisma.compras.findMany({
      where: {
        fecha_factura: {
          gte: desde,
          lte: hasta,
        },
      },
      include: { Proveedor: true, Sucursales: true, FacturasTipos: true },
      orderBy: [
        {
          id_compras: "asc",
        },
      ],
    });

    return data;
  }
  async obtenerListadoComprasInventario(params: CompraslDto) {
    var desde: any = params.desde!.toString();
    var hasta: any = params.hasta!.toString();
    desde = new Date(desde);
    hasta = new Date(hasta);
    hasta.setHours(hasta.getHours() + 23);
    hasta.setMinutes(hasta.getMinutes() + 59);
    hasta.setSeconds(hasta.getSeconds() + 59); 

    const data = await this.prisma.compras.findMany({
      where: {
        fecha_factura: {
          gte: desde,
          lte: hasta,
        },
        id_bodega: {
          gte: 1, //TODO: ESTO ESTA QUEMADO????
        },
      },
      include: {
        Proveedor: true,
        Sucursales: true,
        FacturasTipos: true,
        Bodegas: true,
        ComprasDetalle: { include: { Catalogo: { select: { nombre: true } } } },
      },
      orderBy: [
        {
          id_compras: "asc",
        },
      ],
    });
    return data;
  }

  async obtenerListadoComprasCredito(id_sucursal, id_proveedor) {

    id_sucursal = Number(id_sucursal);
    let wSucursal = {};
    if (id_sucursal > 0) {
      wSucursal = { id_sucursal };
    }
    id_proveedor = Number(id_proveedor);
    let wProveedor = {};
    if (id_proveedor > 0) {
      wProveedor = { id_proveedor };
    }
    const data = await this.prisma.compras.findMany({
      where: {
        ...wSucursal,
        ...wProveedor,
        estado_pago: "PENDIENTE",
        tipo_pago: "CREDITO",
      },
      include: { Proveedor: true },
      orderBy: [
        {
          fecha_de_pago: "asc",
        },
      ],
    });

    return data;
  }
  async obtenerPreCheques(id_sucursal) {

    id_sucursal = Number(id_sucursal);
    let wSucursal = {};
    if (id_sucursal > 0) {
      wSucursal = { id_sucursal };
    }
    const [deudaPendiente, deudaEnCheque] = await Promise.all([
      await this.prisma.compras.aggregate({
        where: {
          ...wSucursal,
          tipo_pago: "CREDITO",
          estado_pago: "PENDIENTE",
        },
        _sum: {
          total: true,
        },
      }),
      await this.prisma.compras.aggregate({
        where: {
          ...wSucursal,
          tipo_pago: "CREDITO",
          estado_pago: "ENCHEQUE",
        },
        _sum: {
          total: true,
        },
      }),
    ]);

    var proveedores = await this.prisma.compras.groupBy({
      by: ["id_proveedor"],
      where: {
        ...wSucursal,
        tipo_pago: "CREDITO",
        estado_pago: "ENCHEQUE",
      },
    });

    var data = [];
    for (let index = 0; index < proveedores.length; index++) {
      const element = proveedores[index];
      var provv = await this.prisma.proveedores.findFirst({
        where: { id_proveedor: element.id_proveedor ?? 0 },
        select: { nombre: true, id_proveedor: true, Banco: true, no_cuenta: true, tipo_cuenta: true },
      });

      var compras = await this.prisma.compras.findMany({
        where: {
          id_proveedor: element.id_proveedor,
          estado_pago: "ENCHEQUE",
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
          estado_pago: "ENCHEQUE",
          ...wSucursal,
        },
      });
      data.push({
        proveedor: provv?.nombre ?? "",
        id_proveedor: provv?.id_proveedor ?? 0,
        banco: provv?.Banco?.nombre ?? 0,
        no_cuenta: provv?.no_cuenta ?? 0,
        tipo_cuenta: provv?.tipo_cuenta ?? 0,
        monto: registro._sum.total ?? 0,
        compras
      });
    }

    var pending = deudaPendiente._sum.total ?? 0;
    var cheques = deudaEnCheque._sum.total ?? 0;
    var total = pending + cheques;

    return {
      data,
      contadores: {
        pending,
        cheques,
        total,
      }
    };
  }


  async revertirEstado(id_compra: number) {
    const db = await this.prisma.compras.findFirst({
      where: { id_compras: id_compra },
    });
    if (!db) throw new NotFoundException('El resgistro no existe');
    await this.prisma.compras.update({
      where: { id_compras: id_compra },
      data: {
        estado_pago: "PENDIENTE"
      }
    });
    return "Datos Actualizados";
  }


  async remove(id_compras: number) {
    id_compras = id_compras > 0 ? id_compras : null;
    const db = await this.prisma.compras.findFirst({
      where: { id_compras },
    });
    if (!db) throw new NotFoundException('El resgistro no existe');
    await this.prisma.compras.delete({
      where: { id_compras },
    });
    return "Datos eliminado";
  }
}
