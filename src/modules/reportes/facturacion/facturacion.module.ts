import { Module } from '@nestjs/common';
import { FacturacionService } from './facturacion.service';
import { FacturacionController } from './facturacion.controller';
import { PrismaService } from 'src/common/services';
import { AuthModule } from 'src/modules/auth/auth.module';

@Module({
  controllers: [FacturacionController],
  providers: [FacturacionService, PrismaService],
  imports: [AuthModule],
})
export class FacturacionModule { }
