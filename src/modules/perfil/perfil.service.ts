import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UpdatePerfilDto } from './dto/update-perfil.dto';
import { PrismaService } from 'src/common/services';
import { UpdatePasswordDto } from './dto/update-password-perfil.dto';

@Injectable()
export class PerfilService {

  constructor(
    private readonly prisma: PrismaService,
  ) { }

  async getUsuario(id: number) {
    // const id: number = Number(uid);

    const data = await this.prisma.usuarios.findFirst({
      where: { id, estado: "ACTIVO" },
      include: { Sucursales: true, Roles: true }
    });
    if (data == null) {
      throw new NotFoundException("El usuario no existe o esta deshabilitado");
    }
    return data;
  }

  findOne(id: number) {
    return `This action returns a #${id} perfil`;
  }

  async update(uid: number, updatePerfilDto: UpdatePerfilDto) {
    const existeEmail = await this.prisma.usuarios.findFirst({
      where: { id: uid, estado: "ACTIVO" },
    });
    if (!existeEmail) {
      throw new NotFoundException("El usuario no existe o esta deshabilitado");
    }
    try {
      const { nombres = "", apellidos = "", dui = "" } = updatePerfilDto;


      return await this.prisma.usuarios.update({
        where: { id: uid },
        data: { nombres, apellidos, dui },
        include: {
          Sucursales: true,
          Roles: true
        }
      });
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException("Error inesperado reviosar log");
    }
  }

  async updatePassword(uid: number, updatePerfilDto: UpdatePasswordDto) {
    const usuarioDb = await this.prisma.usuarios.findFirst({
      where: { id: uid, estado: "ACTIVO" },
    });
    if (!usuarioDb) {
      throw new NotFoundException("El usuario no existe o esta deshabilitado");
    }
    let { clave_actual = "",
      clave_nueva = "",
      clave_confirmada = "" } = updatePerfilDto;


    const validarPass = bcrypt.compareSync(clave_actual, usuarioDb.password);
    if (!validarPass) {
      throw new NotFoundException("La clave actual es incorrecta");
    }
    if (clave_nueva !== clave_confirmada) {
      throw new InternalServerErrorException("La claves no coinciden");
    }

    try {

      const salt = bcrypt.genSaltSync();
      clave_nueva = bcrypt.hashSync(clave_nueva, salt);
      return await this.prisma.usuarios.update({
        where: { id: uid },
        data: { password: clave_nueva },
      });
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException("Error inesperado reviosar log");
    }
  }

  remove(id: number) {
    return `This action removes a #${id} perfil`;
  }
}
