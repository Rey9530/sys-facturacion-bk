import { Module } from '@nestjs/common';
import { OrdenSalidaService } from './orden-salida.service';
import { OrdenSalidaController } from './orden-salida.controller';
import { PrismaService } from 'src/common/services';
import { AuthModule } from 'src/modules/auth/auth.module';

@Module({
  controllers: [OrdenSalidaController],
  providers: [OrdenSalidaService, PrismaService],
  imports: [AuthModule],
})
export class OrdenSalidaModule {}
