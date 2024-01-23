import { Module } from '@nestjs/common';
import { ClienteService } from './cliente.service';
import { ClienteController } from './cliente.controller';
import { PrismaService } from 'src/common/services';
import { AuthModule } from 'src/modules/auth/auth.module';

@Module({
  controllers: [ClienteController],
  providers: [ClienteService, PrismaService],
  imports: [AuthModule],
})
export class ClienteModule {}
