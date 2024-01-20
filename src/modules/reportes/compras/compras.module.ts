import { Module } from '@nestjs/common';
import { ComprasService } from './compras.service';
import { ComprasController } from './compras.controller';
import { PrismaService } from 'src/common/services';
import { AuthModule } from 'src/modules/auth/auth.module';

@Module({
  controllers: [ComprasController],
  providers: [ComprasService, PrismaService],
  imports: [AuthModule],
})
export class ComprasModule { }
