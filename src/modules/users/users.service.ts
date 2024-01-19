import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDto, UpdateUserDto } from './dto';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/common/services';
import { Usuarios } from '@prisma/client'; 
import { JwtPayload } from '../auth/interfaces';

@Injectable()
export class UsersService {
  private readonly logger = new Logger('UsersService');

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) { }

  async create(createUserDto: CreateUserDto, user: Usuarios) {

    let { usuario, nombres, apellidos, dui, id_rol, id_sucursal, id_sucursal_reser = 0 } =
      createUserDto;
    id_rol = Number(id_rol)
    const existeRol = await this.prisma.roles.findUnique({ where: { id_rol } });
    if (!existeRol) {
      throw new NotFoundException('"El registro del rol no existe"');
    }
    id_sucursal = Number(id_sucursal)
    if (id_sucursal > 0) {
      const existeSucursal = await this.prisma.sucursales.findUnique({
        where: { id_sucursal },
      });
      if (!existeSucursal) throw new NotFoundException('"El registro de sucursal no existe"');
    }

    const existeEmail = await this.prisma.usuarios.findFirst({
      where: {
        usuario,
        estado: 'ACTIVO'
      },
    });
    if (existeEmail) throw new NotFoundException(usuario + " ya existe");
    try {
      id_sucursal_reser = Number(id_sucursal_reser)
      id_sucursal_reser = id_sucursal_reser > 0 ? id_sucursal_reser : null;


      //encriptar clave 
      const salt = bcrypt.genSaltSync();
      let password = bcrypt.hashSync("1234", salt);

      const userSaved = await this.prisma.usuarios.create({
        data: {
          usuario,
          password,
          nombres,
          apellidos,
          dui,
          id_rol,
          id_sucursal,
          id_sucursal_reser
        },
        select: {
          nombres: true,
          apellidos: true,
          dui: true,
          usuario: true,
          Roles: true,
          Sucursales: true,
          id: true,
          id_sucursal_reser: true,
          id_sucursal: true
        }
      });
      // const token = await getenerarJWT(userSaved.id, userSaved.id_sucursal);
      const token = await this.getJwtToken({ id: userSaved.id, id_sucursal: userSaved.id_sucursal });
      return { ...userSaved, token };
    } catch (error) {
      console.log(error)
      throw new InternalServerErrorException("Error inesperado reviosar log");
    }
  }

  private getJwtToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  } 

  findAll() {
    return this.prisma.usuarios.findMany({
      where: { estado: "ACTIVO" },
      select: {
        nombres: true,
        apellidos: true,
        dui: true,
        usuario: true,
        Roles: true,
        Sucursales: true,
        id: true,
        id_sucursal_reser: true,
      }
    });
  }
  obtenerRoles() {
    return this.prisma.roles.findMany({
      where: { Estado: "ACTIVO" },
    });
  }

  async findOne(term: number) {
    let resp = await this.prisma.usuarios.findFirst({
      where: { id: term, estado: "ACTIVO" },
    });
    if (!resp)
      throw new NotFoundException(`Usuario con el id ${term} no encontrada`);

    return resp;
  }

  async update(
    id: number,
    updateUserDto: UpdateUserDto,
    user: Usuarios,
  ) {
    await this.findOne(id);
    let uid: number = id;
    const existeEmail = await this.prisma.usuarios.findFirst({
      where: { id: uid, estado: "ACTIVO" },
    });
    if (!existeEmail) {
      throw new NotFoundException("El usuario no existe o esta deshabilitado");
    }

    let { usuario, password, nombres, apellidos, dui, id_rol, id_sucursal, id_sucursal_reser = 0 } =
      updateUserDto;
    id_rol = Number(id_rol)
    id_sucursal = Number(id_sucursal)
    id_sucursal_reser = Number(id_sucursal_reser)
    id_sucursal_reser = id_sucursal_reser > 0 ? id_sucursal_reser : null;
    if (existeEmail.usuario != usuario) {
      const existeEmail = await this.prisma.usuarios.findFirst({
        where: { usuario },
      });
      if (existeEmail) throw new NotFoundException("Ya existe un registro con ese usuario");

    }
    const existeRol = await this.prisma.roles.findUnique({ where: { id_rol } });
    if (!existeRol) throw new NotFoundException("El registro del rol no existe");

    if (id_sucursal > 0) {
      const existeSucursal = await this.prisma.sucursales.findUnique({
        where: { id_sucursal },
      });
      if (!existeSucursal) throw new NotFoundException("El registro de la sucursal no existe");

    }
    try {
      const usuarioUpdate = await this.prisma.usuarios.update({
        where: { id: uid },
        data: { usuario, password, nombres, apellidos, dui, id_rol, id_sucursal, id_sucursal_reser },
      });
      return { ...usuarioUpdate }
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException("Error inesperado reviosar log");
    }
  }


  async remove(uid: number) {
    const resp = await this.findOne(uid);
    const existeEmail = await this.prisma.usuarios.findFirst({
      where: { id: uid, estado: "ACTIVO" },
    });
    if (!existeEmail) throw new NotFoundException("El usuario no existe o ya esta deshabilitado");
    try {
      await this.prisma.usuarios.update({
        data: { estado: "INACTIVO" },
        where: { id: uid },
      });
      return { msg: "Usuario elimiando" }
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException("Error inesperado reviosar log");
    }
  }


  private handleDBExceptions(error: any) {
    if (error.code === '23505') throw new BadRequestException(error.detail);

    this.logger.error(error);
    throw new InternalServerErrorException(error);
  }
}
