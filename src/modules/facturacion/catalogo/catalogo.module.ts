import { Module } from '@nestjs/common';
import { CatalogoService } from './catalogo.service';
import { CatalogoController } from './catalogo.controller';
import { PrismaService } from 'src/common/services';
import { AuthModule } from 'src/modules/auth/auth.module';

@Module({
  controllers: [CatalogoController],
  providers: [CatalogoService, PrismaService],
  imports: [AuthModule],
})
export class CatalogoModule { }
