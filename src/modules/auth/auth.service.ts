import { Injectable, InternalServerErrorException, Logger, UnauthorizedException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { PrismaService } from 'src/common/services';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from './interfaces';
import { hos_usr_usuario } from '@prisma/client';

@Injectable()
export class AuthService {
  private readonly logger = new Logger('AuthService');

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) { }

  async login(createUserDto: CreateAuthDto): Promise<any> {
    const { password, user_code } = createUserDto;

    const user = await this.prisma.hos_usr_usuario.findFirst({
      where: { usr_code_employe: user_code },
      select: {
        usr_code_employe: true,
        usr_code: true,
        usr_names: true,
        usr_surnames: true,
        usr_password: true,
        usr_status: true,
        usr_attempts_faile: true,
      }, //! OJO!
    });

    if (!user) throw new UnauthorizedException('Credenciales incorrectas');
    if (user.usr_status == 'INACTIVE' || user.usr_attempts_faile == 3)
      throw new UnauthorizedException('Usuario bloqueado, favor comunicarse con soporte técnico');

    if (!bcrypt.compareSync(password, user.usr_password)) {
      await this.prisma.hos_usr_usuario.update({
        where: { usr_code: user.usr_code },
        data: { usr_attempts_faile: user.usr_attempts_faile + 1 },
      });
      throw new UnauthorizedException('Credenciales incorrectas');
    } else {
      await this.prisma.hos_usr_usuario.update({
        where: { usr_code: user.usr_code },
        data: { usr_attempts_faile: 0 },
      });
    }
    delete user.usr_password;
    var data: any = {
      ...user,
      token: this.getJwtToken({ hos_usr_uuid: user.usr_code }),
    };

    return data;
  }


  async checkStatus(user: hos_usr_usuario) {
    try {
      const userN = await this.prisma.hos_usr_usuario.findFirst({
        where: { usr_code: user.usr_code },
        select: {
          usr_code_employe: true,
          usr_code: true,
          usr_names: true,
          usr_surnames: true,
          usr_password: true,
          usr_status: true,
        }, //! OJO!
      });
      delete userN.usr_password;
      return {
        ...userN,
        token: this.getJwtToken({ hos_usr_uuid: userN.usr_code }),
      };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(
        'Ha ocurrido un error favor intentarlo mas tarde',
      );
    }
  }
  private getJwtToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }

}
