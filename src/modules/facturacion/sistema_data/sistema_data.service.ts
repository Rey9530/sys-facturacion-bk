import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { UpdateSistemaDatumDto } from './dto/update-sistema_datum.dto';
import { PrismaService } from 'src/common/services';

import * as fs from 'fs';
import * as util from 'util';

@Injectable()
export class SistemaDataService {


  constructor(
    private readonly prisma: PrismaService,
  ) { }


  async findAll() {
    try {
      const data = await this.prisma.generalData.findFirst({ select: { ambiente: true, id_general: true, nombre_sistema: true, direccion: true, razon: true, nit: true, nrc: true, cod_actividad: true, desc_actividad: true, nombre_comercial: true, contactos: true, correo: true, cod_estable_MH: true, cod_estable: true, cod_punto_venta_MH: true, cod_punto_venta: true, impuesto: true, icono_sistema: true, icono_factura: true, id_tipo_contribuyente: true, } });
      let actividad_economica = await this.prisma.dTEActividadEconomica.findFirst({ where: { codigo: data.cod_actividad ?? "00" } });
      return { ...data, id_actividad_economica: actividad_economica != null ? actividad_economica.id_actividad : 0 };
    } catch (error) {
      throw new InternalServerErrorException('Error inesperado reviosar log');
    }
  }
  async listadoActividadesEconomicas() {
    return await this.prisma.dTEActividadEconomica.findMany({ where: { estado: 'ACTIVO' }, orderBy: { nombre: 'asc' } });
  }

  async update(uid: number, updateSistemaDatumDto: UpdateSistemaDatumDto) {

    try {
      let {
        nombre_sistema = "",
        impuesto = 0.0,
        id_tipo_contribuyente = 0,
        id_actividad_economica = 0,
        direccion = "",
        razon = "",
        nit = "",
        nrc = "",
        nombre_comercial = "",
        ambientefacturacion = "",
        contactos = "",
        cod_estable_MH = "",
        cod_estable = "",
        cod_punto_venta_MH = "",
        cod_punto_venta = "",
      } = updateSistemaDatumDto;
      id_actividad_economica = Number(id_actividad_economica);
      impuesto = Number(impuesto);
      id_tipo_contribuyente = Number(id_tipo_contribuyente);
      id_tipo_contribuyente =
        id_tipo_contribuyente > 0 ? id_tipo_contribuyente : null;

      let actividad_economica = await this.prisma.dTEActividadEconomica.findFirst({ where: { id_actividad: id_actividad_economica } });
      if (!actividad_economica) throw new NotFoundException('Actividad economica no encontrada')
      await this.prisma.generalData.update({
        where: { id_general: uid },
        data: {
          nombre_sistema,
          impuesto,
          direccion,
          razon,
          nit,
          nrc,
          contactos,
          id_tipo_contribuyente,
          nombre_comercial,
          cod_actividad: actividad_economica.codigo,
          desc_actividad: actividad_economica.nombre,
          ambiente: ambientefacturacion,
          cod_estable_MH,
          cod_estable,
          cod_punto_venta_MH,
          cod_punto_venta,
        },
      });
      return "Registro actualizado con exito";
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Error inesperado reviosar log');
    }
  }

  async updateIconSystem(uid, urlImage) {
    let icono_sistema = await this.convertFileToBase64(urlImage);
    await this.prisma.generalData.update({
      where: { id_general: uid },
      data: {
        icono_sistema: "data:image/png;base64," + icono_sistema,
      },
    });
  }
  async updateIconInvoice(uid, urlImage) {
    let icono_factura = await this.convertFileToBase64(urlImage);
    await this.prisma.generalData.update({
      where: { id_general: uid },
      data: {
        icono_factura: "data:image/png;base64," + icono_factura,
      },
    });
  }

  async convertFileToBase64(filePath: string): Promise<string> {
    // Convertimos fs.readFile en una promesa para usar async/await
    const readFile = util.promisify(fs.readFile);

    try {
      // Leer el archivo del sistema de archivos
      const fileBuffer = await readFile(filePath);

      // Convertir el contenido del archivo a Base64
      const base64 = fileBuffer.toString('base64');

      return base64;
    } catch (error) {
      throw new Error('Error al leer el archivo: ' + error.message);
    }
  }

}
