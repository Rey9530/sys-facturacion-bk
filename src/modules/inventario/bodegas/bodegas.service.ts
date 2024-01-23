import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateBodegasDto } from './dto/create-bodegas.dto';
import { UpdateBodegasDto } from './dto/update-bodegas.dto';
import { PrismaService } from 'src/common/services';

@Injectable()
export class BodegasService {

  constructor(
    private readonly prisma: PrismaService,
  ) { }

  async create(createBodegasDto: CreateBodegasDto) {
    let { nombre = "", id_sucursal = 0 } = createBodegasDto;
    try {
      id_sucursal = Number(id_sucursal);
      const data = await this.prisma.bodegas.create({
        data: {
          nombre,
          id_sucursal,
        },
      });
      return data;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Error inesperado reviosar log');
    }
  }

  async findAll() {
    const registros = await this.prisma.bodegas.findMany({
      where: { estado: "ACTIVO" },
      include: { Sucursales: true },
      orderBy: {
        id_bodega: "asc",
      },
    });
    const total = await registros.length;
    return {
      registros,
      total,
    }
  }

  async findOne(uid: number) {
    const registros = await this.prisma.bodegas.findFirst({
      where: { id_bodega: uid, estado: "ACTIVO" },
    });
    if (!registros) throw new NotFoundException("El registro no existe")
    return registros;
  }

  async findOneAsignacion(uid: number) {
    const registros = await this.findOne(uid);
    try {
      await this.prisma.bodegas.updateMany({
        where: { id_sucursal: registros?.id_sucursal, estado: "ACTIVO" },
        data: {
          es_principal: 0
        }
      });
      await this.prisma.bodegas.update({
        where: { id_bodega: registros?.id_bodega },
        data: {
          es_principal: 1
        }
      });
      return "Datos actualizados correctamente"
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Error inesperado reviosar log');
    }
  }

  async update(uid: number, updateBodegasDto: UpdateBodegasDto) {
    let { nombre = "", id_sucursal = 0 } = updateBodegasDto;
    id_sucursal = Number(id_sucursal);

    const [registro, sucursal] = await Promise.all([
      await this.prisma.bodegas.findFirst({
        where: { id_bodega: uid, estado: "ACTIVO" },
      }),
      await this.prisma.sucursales.findFirst({
        where: { id_sucursal },
      }),
    ]);
    if (!registro || !sucursal) {
      throw new NotFoundException("El registro no existe")
    }
    try {
      const registroActualizado = await this.prisma.bodegas.update({
        where: { id_bodega: uid },
        data: { nombre, id_sucursal },
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
      await this.prisma.bodegas.update({
        data: { estado: "INACTIVO" },
        where: { id_bodega: uid },
      });
      return "Registro elimiando";
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Error inesperado reviosar log');
    }
  }
}
