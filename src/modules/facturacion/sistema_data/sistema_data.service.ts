import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { UpdateSistemaDatumDto } from './dto/update-sistema_datum.dto';
import { PrismaService } from 'src/common/services';

@Injectable()
export class SistemaDataService {


  constructor(
    private readonly prisma: PrismaService,
  ) { }


  async findAll() {
    try {
      const data = await this.prisma.generalData.findFirst();
      let actividad_economica = await this.prisma.dTEActividadEconomica.findFirst({ where: { codigo: data.cod_actividad } });
      return { ...data, id_actividad_economica: actividad_economica.id_actividad };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Error inesperado reviosar log');
    }
  }
  async listadoActividadesEconomicas() {
    return await this.prisma.dTEActividadEconomica.findMany({ where: { estado: 'ACTIVO' } });
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
        contactos = "",
      } = updateSistemaDatumDto;
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
          desc_actividad: actividad_economica.nombre
        },
      });
      return "Registro actualizado con exito";
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Error inesperado reviosar log');
    }
  }

}
