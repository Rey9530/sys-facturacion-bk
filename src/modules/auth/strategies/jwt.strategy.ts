import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { JwtPayload } from "../interfaces/jwt-payload.interface";
import { ConfigService } from "@nestjs/config";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PrismaService } from "src/common/services/prisma.service";


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private prisma: PrismaService,
        configService: ConfigService
    ) {
        super({
            secretOrKey: configService.get('JWT_SECRET'),
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
        });
    }
    async validate(payload: JwtPayload): Promise<any> {
        const { hos_usr_uuid } = payload; 
        const user = await this.prisma.hos_usr_usuario.findFirst({ where: { usr_code: hos_usr_uuid } }); 
        if (!user) throw new UnauthorizedException('Token no valido')
        if (user.usr_status == 'INACTIVE') throw new UnauthorizedException('Token no valido')

        return user;
    }

}