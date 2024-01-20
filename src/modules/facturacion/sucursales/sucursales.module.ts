import { Module } from '@nestjs/common';
import { SucursalesService } from './sucursales.service';
import { SucursalesController } from './sucursales.controller';
import { PrismaService } from 'src/common/services';
import { AuthModule } from 'src/modules/auth/auth.module';

@Module({
  controllers: [SucursalesController],
  providers: [SucursalesService, PrismaService],
  imports: [AuthModule],
})
export class SucursalesModule { }
