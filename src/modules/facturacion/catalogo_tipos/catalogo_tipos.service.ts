import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateCatalogoTipoDto } from './dto/create-catalogo_tipo.dto';
import { UpdateCatalogoTipoDto } from './dto/update-catalogo_tipo.dto';
import { PrismaService } from 'src/common/services';

@Injectable()
export class CatalogoTiposService {



  constructor(
    private readonly prisma: PrismaService,
  ) { }
  async findAll() {

    const registros = await this.prisma.catalogoTipo.findMany({
      where: { estado: "ACTIVO" },
    });
    const total = await registros.length;
    return {
      registros,
      total,
    }
  }


  async create(createCatalogoTipoDto: CreateCatalogoTipoDto) {
    let { nombre = "" } = createCatalogoTipoDto;
    try {
      const data = await this.prisma.catalogoTipo.create({
        data: {
          nombre
        },
      });
      return data;
    } catch (error) {
      console.log(error)
      throw new InternalServerErrorException("Error inesperado reviosar log");
    }
  }


  async findOne(uid: number) {
    const registros = await this.prisma.catalogoTipo.findFirst({
      where: { id_tipo: uid, estado: "ACTIVO" },
    });

    if (!registros) {
      throw new NotFoundException('El registro no existe');
    } else {
      return registros;
    }
  }

  async update(uid: number, updateCatalogoTipoDto: UpdateCatalogoTipoDto) {

    await this.findOne(uid);
    try {

      let { nombre = "" } = updateCatalogoTipoDto;
      const registroActualizado = await this.prisma.catalogoTipo.update({
        where: { id_tipo: uid },
        data: { nombre },
      });
      return registroActualizado;
    } catch (error) {
      console.log(error)
      throw new InternalServerErrorException("Error inesperado reviosar log");
    }
  }

  async remove(uid: number) {


    await this.findOne(uid);
    try {
      await this.prisma.catalogoTipo.update({
        data: { estado: "INACTIVO" },
        where: { id_tipo: uid },
      });
      return "Registro elimiando";
    } catch (error) {
      console.log(error)
      throw new InternalServerErrorException("Error inesperado reviosar log");
    }
  }
}
