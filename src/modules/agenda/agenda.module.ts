import { Module } from '@nestjs/common';
import { AgendaService } from './agenda.service';
import { AgendaController } from './agenda.controller';
import { PrismaService } from 'src/common/services';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [AgendaController],
  providers: [AgendaService, PrismaService],
  imports: [AuthModule],
})
export class AgendaModule { }
