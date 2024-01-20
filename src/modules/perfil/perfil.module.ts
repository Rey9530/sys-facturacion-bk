import { Module } from '@nestjs/common';
import { PerfilService } from './perfil.service';
import { PerfilController } from './perfil.controller';
import { PrismaService } from 'src/common/services';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [PerfilController],
  providers: [PerfilService, PrismaService],
  imports: [AuthModule],
})
export class PerfilModule {}
