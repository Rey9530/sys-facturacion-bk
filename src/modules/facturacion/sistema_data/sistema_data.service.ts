import { Injectable, InternalServerErrorException } from '@nestjs/common';
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
      return data;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Error inesperado reviosar log');
    }
  }

  async update(uid: number, updateSistemaDatumDto: UpdateSistemaDatumDto) {

    try {
      let {
        nombre_sistema = "",
        impuesto = 0.0,
        id_tipo_contribuyente = 0,
        direccion = "",
        razon = "",
        nit = "",
        nrc = "",
        contactos = "",
      } = updateSistemaDatumDto;
      id_tipo_contribuyente = Number(id_tipo_contribuyente);
      id_tipo_contribuyente =
        id_tipo_contribuyente > 0 ? id_tipo_contribuyente : null;
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
        },
      });
      return "Registro actualizado con exito";
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Error inesperado reviosar log');
    }
  }

}
