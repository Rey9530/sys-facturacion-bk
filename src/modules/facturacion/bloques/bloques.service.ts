import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateBloqueDto } from './dto/create-bloque.dto';
import { UpdateBloqueDto } from './dto/update-bloque.dto';
import { PrismaService } from 'src/common/services';
import { Usuarios } from '@prisma/client';

@Injectable()
export class BloquesService {


  constructor(
    private readonly prisma: PrismaService,
  ) { }

  async create(createBloqueDto: CreateBloqueDto, user: Usuarios) {
    let id_sucursal = Number(user.id_sucursal);
    let {
      autorizacion = "",
      tira = "",
      desde = 0,
      hasta = 0,
      actual = 0,
      serie = "",
      resolucion = "",
      id_tipo_factura = 0,
    } = createBloqueDto;
    if (actual < desde || actual > hasta) {
      throw new InternalServerErrorException("El actual esta fuera de rango de los campos DESDE y HASTA")
    }
    try {
      const data = await this.prisma.facturasBloques.create({
        data: {
          autorizacion,
          tira,
          desde,
          hasta,
          actual,
          serie,
          id_tipo_factura, 
          id_sucursal,
          resolucion
        },
      });
      return data;
    } catch (error) {
      console.log(error)
      throw new InternalServerErrorException("Error inesperado reviosar log");
    }
  }

  async findAll(user: Usuarios) {
    let id_sucursal = Number(user.id_sucursal);
    const registros = await this.prisma.facturasBloques.findMany({
      where: { estado: "ACTIVO", id_sucursal },
      include: { Tipo: true },
    });
    const total = await registros.length;
    return {
      registros,
      total,
    };
  }

  async findOne(uid: number, user: Usuarios) {

    let id_sucursal = Number(user.id_sucursal);
    const registros = await this.prisma.facturasBloques.findFirst({
      where: { id_bloque: uid, estado: "ACTIVO", id_sucursal },
      include: { Tipo: true },
    });

    if (!registros) {
      throw new NotFoundException('El registro no existe');
    } else {
      return registros;
    }
  }
  async facturTipos(user: Usuarios) {

    let id_sucursal = Number(user.id_sucursal);
    try {
      const data = await this.prisma.facturasTipos.findMany({
        where: { estado: "ACTIVO" },
        include: { Bloques: { where: { estado: "ACTIVO", id_sucursal } } },
      });
      return data;
    } catch (error) {
      console.log(error)
      throw new InternalServerErrorException("Error inesperado reviosar log");
    }
  }

  async update(uid: number, updateBloqueDto: UpdateBloqueDto, user: Usuarios) {
    // validar que el actual no sea mayor que el +hasta+ o menor que el +desde+ 
    let id_sucursal = Number(user.id_sucursal);
    await this.findOne(uid, user);
    let {
      autorizacion = "",
      tira = "",
      desde = 0,
      hasta = 0,
      actual = 0,
      serie = "",
      resolucion = "",
      id_tipo_factura = 0,
    } = updateBloqueDto;

    if (actual < desde || actual > hasta) {
      throw new InternalServerErrorException("El actual esta fuera de rango de los campos DESDE y HASTA")
    }
    try {
      const registroActualizado = await this.prisma.facturasBloques.update({
        where: { id_bloque: uid },
        data: {
          autorizacion,
          tira,
          desde,
          hasta,
          actual,
          serie,
          id_tipo_factura,
          id_sucursal,
          resolucion,
        },
      });
      return registroActualizado;
    } catch (error) {
      console.log(error)
      throw new InternalServerErrorException("Error inesperado reviosar log");
    }
  }

  async remove(uid: number, user: Usuarios) {
    await this.findOne(uid, user);
    try {
      await this.prisma.facturasBloques.update({
        data: { estado: "INACTIVO" },
        where: { id_bloque: uid },
      });
      return "Registro elimiando";
    } catch (error) {
      console.log(error)
      throw new InternalServerErrorException("Error inesperado reviosar log");
    }
  }
}
