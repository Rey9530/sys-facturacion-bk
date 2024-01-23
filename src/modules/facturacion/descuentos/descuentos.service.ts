import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateDescuentoDto } from './dto/create-descuento.dto';
import { UpdateDescuentoDto } from './dto/update-descuento.dto';
import { PrismaService } from 'src/common/services';

@Injectable()
export class DescuentosService {

  constructor(
    private readonly prisma: PrismaService,
  ) { }

  async create(createDescuentoDto: CreateDescuentoDto) {
    let { nombre = "", porcentaje = 0, isItem = "AMBOS" }: any = createDescuentoDto;
    try {
      const data = await this.prisma.facturasDescuentos.create({
        data: {
          nombre,
          porcentaje,
          isItem,
        },
      });
      return data;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Error inesperado reviosar log');
    }
  }

  async findAll() {
    const registros = await this.prisma.facturasDescuentos.findMany({
      where: { estado: "ACTIVO" },
    });
    const total = await registros.length;
    return {
      registros,
      total,
    }
  }

  async findOne(uid: number) {
    const registros = await this.prisma.facturasDescuentos.findFirst({
      where: { id_descuento: uid, estado: "ACTIVO" },
    });
    if (!registros) throw new NotFoundException("El registro no existe")
    return registros;
  }

  async listarActivos() {
    const data = await this.prisma.facturasDescuentos.findMany({
      where: {
        estado: "ACTIVO",
        OR: [{ isItem: "AMBOS" }, { isItem: "GLOBAL" }, { isItem: "ITEM" }],
      },
    });
    const total = await data.length;
    return {
      data,
      total,
    }
  }
  async listarTipos() {
    try {
      return ["ITEM", "GLOBAL", "AMBOS", "INACTIVO"];
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Error inesperado reviosar log');
    }
  }

  async update(uid: number, updateDescuentoDto: UpdateDescuentoDto) {
    // validar que el actual no sea mayor que el +hasta+ o menor que el +desde+ 

    await this.findOne(uid);
    try {
      let { nombre = "", porcentaje = 0, isItem = "AMBOS" }: any = updateDescuentoDto;

      const registroActualizado = await this.prisma.facturasDescuentos.update({
        where: { id_descuento: uid },
        data: {
          nombre,
          porcentaje,
          isItem,
        },
      });
      return registroActualizado;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Error inesperado reviosar log');
    }
  }

  async remove(uid: number) {
    await this.findOne(uid);
    try {
      await this.prisma.facturasDescuentos.update({
        data: { estado: "INACTIVO" },
        where: { id_descuento: uid },
      });
      return "Registro elimiando";
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Error inesperado reviosar log');
    }
  }
}
