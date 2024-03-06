import { Injectable } from '@nestjs/common';
import { ConsumidorFinalDto } from './dto/consumidorFinal.dto';
import { CreditoFiscalDto } from './dto/credito-fiscal.dto';
import { PrismaService } from 'src/common/services';

@Injectable()
export class FacturacionService {


  constructor(
    private readonly prisma: PrismaService,
  ) { }

  async consumidorFinal(params: ConsumidorFinalDto, ids) {
 
    let id_sucursal = Number(ids);
    let { mes = "0", anio = "0" }: any = params;
    mes = Number(mes);
    anio = Number(anio);
    mes = mes > 0 ? mes : 0;
    let diasMes: any = new Date(anio, mes, 0);
    mes = mes > 0 ? mes - 1 : 0;
    diasMes = diasMes.getDate();
    var arrayDatos: any[] = []; 
    let totales: any = {};
    totales.ventas_exentas = 0;
    totales.ventas_no_sujetas = 0;
    totales.ventas_locales = 0;
    totales.ventas_exportacion = 0;
    totales.ventas_totales = 0;
    totales.ventas_terceros = 0;

    var listadoFactura: any[] = [];
    for (let index = 1; index <= diasMes; index++) {
      var fecha = new Date(anio, mes, index);
      var desde = new Date(anio, mes, index, 0, 0, 0);
      var hasta = new Date(anio, mes, index, 23, 59, 59);
      var fecha_creacio = {
        fecha_creacion: {
          gte: desde,
          lte: hasta,
        },
      };

      const [facturaInit, facturaEnd, facturas] = await Promise.all([
        await this.prisma.facturas.findFirst({
          where: {
            ...fecha_creacio,
            dte_procesado:true,
            Bloque: { Tipo: { id_tipo_factura: 1 } },
            id_sucursal
          },
        }),
        await this.prisma.facturas.findFirst({
          where: {
            ...fecha_creacio,
            dte_procesado:true,
            Bloque: { Tipo: { id_tipo_factura: 1 } },
            id_sucursal
          },
          orderBy: {
            id_factura: "desc",
          },
        }),
        await this.prisma.facturas.findMany({
          where: {
            ...fecha_creacio,
            dte_procesado:true,
            Bloque: { Tipo: { id_tipo_factura: 1 } },
            id_sucursal
          },
          include: { Bloque: { include: { Tipo: true } }, }
        }),
      ]);

      if (facturas.length > 0) {
        listadoFactura.push(...facturas);
      }

      var ventas_locales = 0;
      facturas.forEach((item: any) => {
        if (item.estado == "ACTIVO") {
          ventas_locales += item.total ?? 0;
        }
      });

      totales.ventas_locales += ventas_locales;
      totales.ventas_totales += ventas_locales;
      var fila = {
        index,
        fecha,
        desde: facturaInit?.numero_factura ?? 0,
        hasta: facturaEnd?.numero_factura ?? 0,
        maquina: "-",
        ventas_exentas: 0,
        ventas_no_sujetas: 0,
        ventas_locales,
        ventas_exportacion: 0,
        ventas_totales: ventas_locales,
        ventas_terceros: 0,
      };
      arrayDatos.push(fila);
    }
    return {
      data: arrayDatos,
      listado: listadoFactura,
      totales,
    }
  }
  async getCreditoFiscal(params: CreditoFiscalDto, ids) {
    let id_sucursal = Number(ids);
    var desde1: any = params.desde!.toString().split("-");
    var hasta1: any = params.hasta!.toString().split("-");
    var desde = new Date(desde1[0], desde1[1] - 1, desde1[2], 0, 0, 0);
    var hasta = new Date(hasta1[0], hasta1[1] - 1, hasta1[2], 23, 59, 59);
    var totales: any[] = []; 
    var data = await this.prisma.facturas.findMany({
      where: {
        fecha_creacion: {
          gte: desde,
          lte: hasta,
        },
        dte_procesado:true,
        Bloque: { Tipo: { id_tipo_factura: 2 } },
        id_sucursal
      },
      include: { Bloque: { include: { Tipo: true } }, }
    });

    return {
      data,
      totales
    };
  }

}
