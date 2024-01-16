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
import { JwtPayload } from '../auth/interfaces';
import { PasswordUserDto } from '../auth/dto/password-user.dto';
import { PrismaService } from 'src/common/services';
import { hos_usr_usuario } from '@prisma/client';

@Injectable()
export class UsersService {
  private readonly logger = new Logger('UsersService');

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) { }

  async create(createUserDto: CreateUserDto, user: hos_usr_usuario) {
    try {
      const { usr_password, ...resto } = createUserDto;
      var data: any = {
        usr_password: bcrypt.hashSync(usr_password, 10),
        usr_user_create: user.usr_names + ' ' + user.usr_surnames,
        usr_usrer_update: user.usr_names + ' ' + user.usr_surnames,
        usr_code_employe: resto.usr_code,
        usr_names: resto.usr_names,
        usr_surnames: resto.usr_surnames,
      };
      const register = await this.prisma.hos_usr_usuario.create({
        data,
      });
      delete register.usr_password;
      return register;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async updatePassword(
    passwordUserDto: PasswordUserDto,
    user: hos_usr_usuario,
  ) {
    try {
      const respDb = await this.prisma.hos_usr_usuario.findFirst({
        where: { usr_code: user.usr_code },
      });

      if (!respDb) throw new NotFoundException('Usuario no encontrado');
      const password = passwordUserDto.curren_password;
      if (!bcrypt.compareSync(password, respDb.usr_password))
        throw new UnauthorizedException('Credenciales incorrectas');

      if (
        bcrypt.compareSync(passwordUserDto.new_password, user.usr_password)
      )
        throw new UnauthorizedException(
          'La nueva contraseña no debe ser la misma que la actual',
        );

      await this.prisma.hos_usr_usuario.update({
        where: { usr_code: respDb.usr_code },
        data: {
          usr_password: bcrypt.hashSync(passwordUserDto.new_password, 10),
        },
      });
      return;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }



  findAll() {
    return this.prisma.hos_usr_usuario.findMany({
      where: { usr_status: 'ACTIVE' },
    });
  }

  async findOne(term: string) {
    let resp = await this.prisma.hos_usr_usuario.findFirst({
      where: { usr_code: term, usr_status: 'ACTIVE' },
    });
    if (!resp)
      throw new NotFoundException(`Usuario con el id ${term} no encontrada`);

    return resp;
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
    user: hos_usr_usuario,
  ) {
    await this.findOne(id);
    try {
      const { usr_password, ...resto } = updateUserDto;
      var data: any = {
        usr_password: bcrypt.hashSync(usr_password, 10),
        usr_usrer_update: user.usr_names + ' ' + user.usr_surnames,
        usr_code_employe: resto.usr_code,
        usr_names: resto.usr_names,
        usr_surnames: resto.usr_surnames,
      };
      const product = await this.prisma.hos_usr_usuario.update({
        where: { usr_code: id },
        data,
      });
      if (!product)
        throw new NotFoundException(`Product with id: ${id} not found`);
      return product;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async remove(id: string) {
    const resp = await this.findOne(id);
    await this.prisma.hos_usr_usuario.update({
      where: { usr_code: resp.usr_code },
      data: { usr_status: 'INACTIVE' },
    });
  }


  private handleDBExceptions(error: any) {
    if (error.code === '23505') throw new BadRequestException(error.detail);

    this.logger.error(error);
    throw new InternalServerErrorException(error);
  }
}
