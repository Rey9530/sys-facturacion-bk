import { Injectable, InternalServerErrorException, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { PrismaService } from 'src/common/services';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from './interfaces';
import { Usuarios } from '@prisma/client';

@Injectable()
export class AuthService {
  private readonly logger = new Logger('AuthService');

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) { }

  async login(createUserDto: CreateAuthDto): Promise<any> {
    const { usuario, password } = createUserDto;
    const usaurioDB = await this.prisma.usuarios.findFirst({
      where: {
        usuario,
        estado: "ACTIVO",
      },
    });

    if (!usaurioDB) throw new NotFoundException('El usuario o clave son incorrectos');
    const validarPass = bcrypt.compareSync(password, usaurioDB.password);

    if (!validarPass) throw new NotFoundException('El email o clave no existe');
    try {
      const token = await this.getJwtToken({ id: usaurioDB.id, id_sucursal: usaurioDB.id_sucursal });
      const dataGeneral = await this.prisma.generalData.findFirst();
      dataGeneral!.id_general = 0;
      return { ...usaurioDB, token, ...dataGeneral }
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException("Error revise logs");
    }
  }

  async checkStatus(user: Usuarios) {

    const usaurioDB = await this.prisma.usuarios.findFirst({
      where: {
        id: user.id,
        estado: "ACTIVO",
      },
    });
    if (!usaurioDB) throw new NotFoundException('Error al renovar el Token');
    // const token = await getenerarJWT(uid, usaurioDB?.id_sucursal);
    const token = await this.getJwtToken({ id: usaurioDB.id, id_sucursal: usaurioDB.id_sucursal });
    const dataGeneral = await this.prisma.generalData.findFirst();
    dataGeneral!.id_general = 0;
    return { ...usaurioDB, token, ...dataGeneral };
  }

  private getJwtToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }

}
