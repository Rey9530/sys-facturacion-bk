import { Module } from '@nestjs/common';
import { BloquesService } from './bloques.service';
import { BloquesController } from './bloques.controller';
import { PrismaService } from 'src/common/services';
import { AuthModule } from 'src/modules/auth/auth.module';

@Module({
  controllers: [BloquesController],
  providers: [BloquesService, PrismaService],
  imports: [AuthModule],
})
export class BloquesModule {}
