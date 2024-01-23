import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateOrdenSalidaDto } from './dto/create-orden-salida.dto';
import { UpdateOrdenSalidaDto } from './dto/update-orden-salida.dto';
import { PrismaService } from 'src/common/services';

@Injectable()
export class OrdenSalidaService {


  constructor(
    private readonly prisma: PrismaService,
  ) { }

  async create(createOrdenSalidaDto: CreateOrdenSalidaDto) {
    let { nombre = "", id_sucursal = 0 } = createOrdenSalidaDto;
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
      throw new InternalServerErrorException("Error inesperado reviosar log");
    }
  }

  async findAll() {
    const registros = await this.prisma.bodegas.findMany({
      where: { estado: "ACTIVO" },
      include: { Sucursales: true }
    });
    const total = await registros.length;
    return {
      registros,
      total,
    }
  }

  async findMotivos() {
    return await this.prisma.motivoSalida.findMany({
      where: { estado: "ACTIVO" },
    });
  }

  async findOne(uid: number) {
    const registro = await this.prisma.bodegas.findFirst({
      where: { id_bodega: uid, estado: "ACTIVO" },
    });
    if (!registro) throw new NotFoundException("El registro no existe  ")
    return registro;
  }

  async update(uid: number, updateOrdenSalidaDto: UpdateOrdenSalidaDto) {
    let { nombre = "", id_sucursal = 0 } = updateOrdenSalidaDto;
    id_sucursal = Number(id_sucursal);

    const [registro, sucursal] = await Promise.all([
      await this.prisma.bodegas.findFirst({
        where: { id_bodega: uid, estado: "ACTIVO" },
      }),
      await this.prisma.sucursales.findFirst({
        where: { id_sucursal },
      }),
    ]);
    if (!registro || !sucursal) throw new NotFoundException("El registro no existe o la sucursal esta incorrecta")

    try {
      const registroActualizado = await this.prisma.bodegas.update({
        where: { id_bodega: uid },
        data: { nombre, id_sucursal },
      });
      return registroActualizado;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException("Error inesperado reviosar log");
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
      throw new InternalServerErrorException("Error inesperado reviosar log");
    }
  }
}
