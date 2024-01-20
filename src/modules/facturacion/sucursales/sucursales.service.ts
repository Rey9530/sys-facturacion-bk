import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateSucursaleDto } from './dto/create-sucursale.dto';
import { UpdateSucursaleDto } from './dto/update-sucursale.dto';
import { PrismaService } from 'src/common/services';
import { Usuarios } from '@prisma/client';

@Injectable()
export class SucursalesService {


  constructor(
    private readonly prisma: PrismaService,
  ) { }

  async create(createSucursaleDto: CreateSucursaleDto) {
    let { nombre = "", color = "" } = createSucursaleDto;
    try {
      return await this.prisma.sucursales.create({
        data: {
          nombre,
          color,
        },
      });

    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Error inesperado reviosar log');
    }
  }

  async findAll(user: Usuarios) {

    var wSucursal = {};
    if (Number(user.id_sucursal_reser) > 0 && user.id_rol != 1) {
      wSucursal = { id_sucursal: Number(user?.id_sucursal_reser) };
    }
    const registros = await this.prisma.sucursales.findMany({
      where: { estado: "ACTIVO", ...wSucursal },
    });
    const total = await registros.length;
    return {
      registros,
      total,
    }
  }

  async findOne(uid: number) {
    const registros = await this.prisma.sucursales.findFirst({
      where: { id_sucursal: uid, estado: "ACTIVO" },
    });
    if (!registros) throw new NotFoundException("El registro no existe")

    return registros;
  }

  async update(uid: number, updateSucursaleDto: UpdateSucursaleDto) {
    await this.findOne(uid);
    try {
      let { nombre = "", color = "" } = updateSucursaleDto;
      const registroActualizado = await this.prisma.sucursales.update({
        where: { id_sucursal: uid },
        data: { nombre, color },
      });
      return registroActualizado
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Error inesperado reviosar log');
    }
  }

  async remove(uid: number) {
    await this.findOne(uid);
    try {

      await this.prisma.sucursales.update({
        data: { estado: "INACTIVO" },
        where: { id_sucursal: uid },
      });
      return "Registro elimiando";
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Error inesperado reviosar log');
    }
  }
}
