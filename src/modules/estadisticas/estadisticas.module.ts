import { Module } from '@nestjs/common';
import { EstadisticasService } from './estadisticas.service';
import { EstadisticasController } from './estadisticas.controller';
import { PrismaService } from 'src/common/services';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [EstadisticasController],
  providers: [EstadisticasService, PrismaService],
  imports: [AuthModule],
})
export class EstadisticasModule {}
