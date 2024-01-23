import { Module } from '@nestjs/common';
import { DescuentosService } from './descuentos.service';
import { DescuentosController } from './descuentos.controller';
import { PrismaService } from 'src/common/services';
import { AuthModule } from 'src/modules/auth/auth.module';

@Module({
  controllers: [DescuentosController],
  providers: [DescuentosService, PrismaService],
  imports: [AuthModule],
})
export class DescuentosModule { }
