import { Module } from '@nestjs/common';
import { CatalogoTiposService } from './catalogo_tipos.service';
import { CatalogoTiposController } from './catalogo_tipos.controller';
import { PrismaService } from 'src/common/services';
import { AuthModule } from 'src/modules/auth/auth.module';

@Module({
  controllers: [CatalogoTiposController],
  providers: [CatalogoTiposService, PrismaService],
  imports: [AuthModule],
})
export class CatalogoTiposModule { }
