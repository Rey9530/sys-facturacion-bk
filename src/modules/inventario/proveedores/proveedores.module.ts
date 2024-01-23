import { Module } from '@nestjs/common';
import { ProveedoresService } from './proveedores.service';
import { ProveedoresController } from './proveedores.controller';
import { PrismaService } from 'src/common/services';
import { AuthModule } from 'src/modules/auth/auth.module';

@Module({
  controllers: [ProveedoresController],
  providers: [ProveedoresService, PrismaService],
  imports: [AuthModule],
})
export class ProveedoresModule {}
