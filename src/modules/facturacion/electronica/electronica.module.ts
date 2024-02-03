import { Module } from '@nestjs/common';
import { ElectronicaService } from './electronica.service';
import { PrismaService } from 'src/common/services';
import { AuthModule } from 'src/modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  controllers: [],
  providers: [ElectronicaService, PrismaService],
  imports: [AuthModule,ConfigModule],
  exports: [ElectronicaService]
})
export class ElectronicaModule { }
