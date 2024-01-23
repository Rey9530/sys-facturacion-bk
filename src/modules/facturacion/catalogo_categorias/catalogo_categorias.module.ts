import { Module } from '@nestjs/common';
import { CatalogoCategoriasService } from './catalogo_categorias.service';
import { CatalogoCategoriasController } from './catalogo_categorias.controller';
import { PrismaService } from 'src/common/services';
import { AuthModule } from 'src/modules/auth/auth.module';

@Module({
  controllers: [CatalogoCategoriasController],
  providers: [CatalogoCategoriasService, PrismaService],
  imports: [AuthModule],
})
export class CatalogoCategoriasModule {}
