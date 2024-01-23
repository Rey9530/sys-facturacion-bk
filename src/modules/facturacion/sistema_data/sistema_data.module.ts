import { Module } from '@nestjs/common';
import { SistemaDataService } from './sistema_data.service';
import { SistemaDataController } from './sistema_data.controller';
import { PrismaService } from 'src/common/services';
import { AuthModule } from 'src/modules/auth/auth.module';

@Module({
  controllers: [SistemaDataController],
  providers: [SistemaDataService, PrismaService],
  imports: [AuthModule],
})
export class SistemaDataModule { }
