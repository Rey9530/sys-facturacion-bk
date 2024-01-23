import { Module } from '@nestjs/common';
import { BodegasService } from './bodegas.service';
import { BodegasController } from './bodegas.controller';
import { PrismaService } from 'src/common/services';
import { AuthModule } from 'src/modules/auth/auth.module';

@Module({
  controllers: [BodegasController],
  providers: [BodegasService, PrismaService],
  imports: [AuthModule],
})
export class BodegasModule {}
