import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/common/services';
import * as bcrypt from 'bcrypt';
import { hos_usr_usuario } from '@prisma/client';

@Injectable()
export class SeedService {
  private readonly logger = new Logger('UsersService');

  constructor(private readonly prisma: PrismaService) { }
  async deleteSeed() {
    await this.prisma.hos_usr_usuario.deleteMany();
  }

  async executeSeed() {
    try {
      await this.deleteSeed();
      var cremod = 'Creado por el seeder';
      var data: any = {
        usr_code_employe: '9505002',
        usr_names: 'Reynaldo Alexander',
        usr_surnames: 'Ruiz Rosales',
        usr_password: bcrypt.hashSync('9505002', 10),
        usr_attempts_faile: 0,
        usr_status: 'ACTIVE',
        usr_user_create: cremod,
        usr_usrer_update: cremod
      }
      await this.prisma.hos_usr_usuario.create({
        data: data
      });

    } catch (error) {
      console.log(error);
    }
  }
}
