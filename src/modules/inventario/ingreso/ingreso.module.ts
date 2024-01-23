import { Module } from '@nestjs/common';
import { IngresoService } from './ingreso.service';
import { IngresoController } from './ingreso.controller';
import { AuthModule } from 'src/modules/auth/auth.module';
import { PrismaService } from 'src/common/services';

@Module({
  controllers: [IngresoController],
  providers: [IngresoService, PrismaService],
  imports: [AuthModule],
})
export class IngresoModule { }
