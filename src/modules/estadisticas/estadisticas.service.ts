import { Injectable } from '@nestjs/common'; 
import { PrismaService } from 'src/common/services';
import { EstadisticasDto } from './dto/estadisticas.dto';
import { convert } from 'src/common/helpers';

@Injectable()
export class EstadisticasService {

  constructor(
    private readonly prisma: PrismaService,
  ) { }

  async ventasMenusales(anio = new Date().getFullYear(), ids) {
    let id_sucursal = Number(ids);

    var data: any[] = [];
    for (let index = 0; index <= 11; index++) {
      var diasTotales = new Date(anio, index + 1, 0).getDate() - 1;
      var desde = new Date(anio, index, 1, 0, 0, 0);
      var hasta = new Date(anio, index, diasTotales, 23, 59, 59);

      var result = await this.prisma.facturas.aggregate({
        _sum: {
          total: true,
        },
        where: {
          fecha_creacion: {
            gte: desde,
            lte: hasta,
          },
          id_sucursal,
        },
      });
      data.push(result._sum.total ?? 0);
    }
    return data;
  }

  async ventasXRango(query: EstadisticasDto, ids = 0) {
    let id_sucursal = Number(ids);
    var desde1: any = query.desde!.toString().split("-");
    var hasta1: any = query.hasta!.toString().split("-");
    var desde = new Date(desde1[0], desde1[1] - 1, desde1[2], 0, 0, 0);
    var hasta = new Date(hasta1[0], hasta1[1] - 1, hasta1[2], 23, 59, 59);
    var data_pie: any[] = [];

    var tiposFacturas = await this.prisma.facturasTipos.findMany({
      where: { estado: "ACTIVO" },
    });
    for (let index = 0; index < tiposFacturas.length; index++) {
      const element = tiposFacturas[index];
      var res: any = await this.prisma.facturas.aggregate({
        _sum: { total: true },
        where: {
          Bloque: { id_tipo_factura: element.id_tipo_factura },
          estado: "ACTIVO",
          fecha_creacion: {
            gte: desde,
            lte: hasta,
          },
          id_sucursal,
        },
      });
      data_pie.push({
        label: element.nombre,
        total: res._sum.total ?? 0,
      });
    }

    var data_fechas: any[] = [];
    var diff = hasta.getTime() - desde.getTime();
    var dias = diff / (1000 * 60 * 60 * 24);
    for (let index = 0; index < dias; index++) {
      var dia_desde = new Date(desde1[0], desde1[1] - 1, desde1[2], 0, 0, 0);
      var dia_hasta = new Date(desde1[0], desde1[1] - 1, desde1[2], 23, 59, 59);
      dia_desde.setDate(dia_desde.getDate() + index);
      dia_hasta.setDate(dia_hasta.getDate() + index);
      var dum_day = await this.prisma.facturas.aggregate({
        _sum: { total: true },
        where: {
          estado: "ACTIVO",
          fecha_creacion: {
            gte: dia_desde,
            lte: dia_hasta,
          },
          id_sucursal,
        },
      });
      data_fechas.push({
        monto: dum_day._sum.total ?? 0,
        fecha: convert(dia_desde.toString()),
      });
    }

    return { data_pie, data_fechas };
  }

  async porProveedores(id_sucursal: number) {
    // let id_sucursal: number = Number(req.params.id_sucursal);
    var wSucursal = {};
    if (id_sucursal) {
      wSucursal = { id_sucursal };
    }
    var proveedoresIds = await this.prisma.compras.groupBy({
      by: ["id_proveedor"],
      take: 10,
      _sum: {
        total: true,
      },
      orderBy: {
        _sum: {
          total: "desc",
        },
      },
      where: {
        ...wSucursal,
      },
    });

    var data = [];
    for (let index = 0; index < proveedoresIds.length; index++) {
      const element = proveedoresIds[index];
      if (Number(element.id_proveedor) > 0) {
        var proveedor = await this.prisma.proveedores.findUnique({
          where: {
            id_proveedor: element.id_proveedor ?? 0,
          },
        });
        data.push({
          nombre: proveedor?.nombre,
          monto: Number((element._sum.total ?? 0).toFixed(2)),
          id_proveedor: element.id_proveedor,
        });
      }
    }

    return data;
  }

  async tablero(id_sucursal = 0, anio = new Date().getFullYear(), mes = 0) {
    id_sucursal = Number(id_sucursal);
    mes = Number(mes);

    mes = mes > 0 ? mes : 0;
    let diasMes: any = new Date(anio, mes, 0);
    mes = mes > 0 ? mes - 1 : 0;
    diasMes = diasMes.getDate();

    var wSucursal = {};
    if (id_sucursal > 0) {
      wSucursal = { id_sucursal };
    }
    var sucursales = await this.prisma.sucursales.findMany({
      where: {
        estado: "ACTIVO",
        ...wSucursal,
      },
    });

    var dias = [];
    var dataGrafica = [];
    var colores = [];

    var sucursalesConMonto = [];
    for (let index = 0; index < sucursales.length; index++) {
      const element = sucursales[index];
      dias = [];
      var montosSucursal = [];
      var totalporSucursal = 0;
      for (let index = 1; index <= diasMes; index++) {
        var desde = new Date(anio, mes, index, 0, 0, 0);
        var hasta = new Date(anio, mes, index, 23, 59, 59);
        dias.push(index);
        var result = await this.prisma.cierresDiarios.aggregate({
          _sum: {
            venta_bruta: true,
            venta_nota_sin_iva: true,
          },
          where: {
            fecha_cierre: {
              gte: desde,
              lte: hasta,
            },
            id_sucursal: element.id_sucursal,
          },
        });
        totalporSucursal += result._sum.venta_bruta ?? 0;
        montosSucursal.push(result._sum.venta_bruta ?? 0);
      }
      dataGrafica.push({ name: element.nombre, data: montosSucursal });
      sucursalesConMonto.push({ name: element.nombre, monto: totalporSucursal });
      colores.push(this.obtenerColorAleatorio());
    }


    return { dias, dataGrafica, colores, sucursalesConMonto };
  }

  async porTipoPastel(id_sucursal = 0, query: EstadisticasDto) {
    id_sucursal = Number(id_sucursal);

    var desde_v: any = query.desde!.toString();
    var hasta_v: any = query.hasta!.toString();
    var desde = new Date(desde_v);
    var hasta = new Date(hasta_v);
    hasta.setHours(hasta.getHours() + 23);
    hasta.setMinutes(hasta.getMinutes() + 59);;

    var wSucursal = {};
    if (id_sucursal > 0) {
      wSucursal = { id_sucursal };
    }
    var sucursales = await this.prisma.sucursales.findMany({
      where: {
        estado: "ACTIVO",
        ...wSucursal,
      },
    });

    var colores = [];
    var dataGorcentaje = [];

    for (let index = 0; index < sucursales.length; index++) {
      const element = sucursales[index];
      var resultXSUCURSAL = await this.prisma.compras.aggregate({
        _sum: {
          total: true,
        },
        where: {
          fecha_factura: {
            gte: desde,
            lte: hasta,
          },
          id_sucursal: element.id_sucursal,
          tipo_inventario: "MP",
        },
      });
      if (Number(resultXSUCURSAL._sum.total) > 0) {
        dataGorcentaje.push({
          name: element.nombre,
          data: resultXSUCURSAL._sum.total ?? 0,
        });
        colores.push(this.obtenerColorAleatorio());
      }
    }
    var whereF = {
      fecha_factura: {
        gte: desde,
        lte: hasta,
      },
    };

    var [RMP, RIC] = await Promise.all([
      await this.prisma.compras.aggregate({
        _sum: {
          total: true,
        },
        where: {
          ...whereF,
          tipo_inventario: "MP",
        },
      }),
      await this.prisma.compras.aggregate({
        _sum: {
          total: true,
        },
        where: {
          ...whereF,
          tipo_inventario: "CI",
        },
      }),
    ]);
    var dataGrafTipo = [];
    dataGrafTipo.push({ name: "Materia Prima", data: RMP._sum.total ?? 0 });
    dataGrafTipo.push({ name: "Costos Indirectos", data: RIC._sum.total ?? 0 });

    return { dataGorcentaje, colores, dataGrafTipo };
  }

  async porTipoPastelPropinas(id_sucursal = 0, query: EstadisticasDto) {

    id_sucursal = Number(id_sucursal);



    var desde_v: any = query.desde!.toString();
    var hasta_v: any = query.hasta!.toString();
    var desde = new Date(desde_v);
    var hasta = new Date(hasta_v);
    hasta.setHours(hasta.getHours() + 23);
    hasta.setMinutes(hasta.getMinutes() + 59);
    var wSucursal = {};
    if (id_sucursal > 0) {
      wSucursal = { id_sucursal };
    }
    var sucursales = await this.prisma.sucursales.findMany({
      where: {
        estado: "ACTIVO",
        ...wSucursal,
      },
    });

    var colores = [];
    var dataGorcentaje = [];

    for (let index = 0; index < sucursales.length; index++) {
      const element = sucursales[index];
      var resultXSUCURSAL = await this.prisma.cierresDiarios.aggregate({
        _sum: {
          venta_bruta: true,
          propina: true,
        },
        where: {
          fecha_cierre: {
            gte: desde,
            lte: hasta,
          },
          id_sucursal: element.id_sucursal,
        },
      });
      if (
        Number(resultXSUCURSAL._sum.venta_bruta) > 0 &&
        Number(resultXSUCURSAL._sum.propina) > 0
      ) {
        dataGorcentaje.push({
          name: element.nombre,
          data:
            (resultXSUCURSAL._sum.venta_bruta ?? 0) -
            (resultXSUCURSAL._sum.propina ?? 0),
        });
        colores.push(this.obtenerColorAleatorio());
      }
    }

    var resPro = await this.prisma.cierresDiarios.aggregate({
      _sum: {
        venta_bruta: true,
        propina: true
      },
      where: {
        fecha_cierre: {
          gte: desde,
          lte: hasta,
        },
      },
    });
    var dataGrafTipo = [];
    dataGrafTipo.push({ name: "Propina", data: resPro._sum.propina ?? 0 });
    dataGrafTipo.push({ name: "Sub Total", data: resPro._sum.venta_bruta ?? 0 });

    // var montos = [];

    return { dataGorcentaje, colores, dataGrafTipo };
  }

  async porMesSucrusal(anio = new Date().getFullYear()) {

    anio = Number(anio)

    var sucursales = await this.prisma.sucursales.findMany({
      where: { estado: "ACTIVO" },
    });

    var data: any[] = [];
    for (let index = 0; index < sucursales.length; index++) {
      const sucursal = sucursales[index];
      var totales = [];
      for (let index = 0; index <= 11; index++) {
        var diasTotales = new Date(anio, index + 1, 0).getDate() - 1;
        var desde = new Date(anio, index, 1, 0, 0, 0);
        var hasta = new Date(anio, index, diasTotales, 23, 59, 59);

        var result = await this.prisma.compras.aggregate({
          _sum: {
            total: true,
          },
          where: {
            fecha_factura: {
              gte: desde,
              lte: hasta,
            },
            id_sucursal: sucursal.id_sucursal,
          },
        });
        totales.push(Number((result._sum.total ?? 0).toFixed(2)));
      }
      data.push({ name: sucursal.nombre, data: totales });
    }

    return data;
  }

  obtenerColorAleatorio = () => {
    var simbolos, color;
    simbolos = "0123456789ABCDEF";
    color = "#";

    for (var i = 0; i < 6; i++) {
      color = color + simbolos[Math.floor(Math.random() * 16)];
    }
    return color;
  };
}
