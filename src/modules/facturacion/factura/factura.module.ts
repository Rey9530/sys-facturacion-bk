import { Module } from '@nestjs/common';
import { FacturaService } from './factura.service';
import { FacturaController } from './factura.controller';
import { PrismaService } from 'src/common/services';
import { AuthModule } from 'src/modules/auth/auth.module';

@Module({
  controllers: [FacturaController],
  providers: [FacturaService, PrismaService],
  imports: [AuthModule],
})
export class FacturaModule {}