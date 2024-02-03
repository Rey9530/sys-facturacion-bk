import { Module } from '@nestjs/common';
import { FacturaService } from './factura.service';
import { FacturaController } from './factura.controller';
import { PrismaService } from 'src/common/services';
import { AuthModule } from 'src/modules/auth/auth.module';
import { ElectronicaModule } from '../electronica/electronica.module';

@Module({
  controllers: [FacturaController],
  providers: [FacturaService, PrismaService],
  imports: [AuthModule, ElectronicaModule],
})
export class FacturaModule { }
