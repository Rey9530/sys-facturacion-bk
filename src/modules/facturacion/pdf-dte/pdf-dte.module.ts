import { Module } from '@nestjs/common';
import { PdfDteService } from './pdf-dte.service';
import { PdfDteController } from './pdf-dte.controller';
import { PrismaService } from 'src/common/services';
import { AuthModule } from 'src/modules/auth/auth.module';

@Module({
  controllers: [PdfDteController],
  providers: [PdfDteService, PrismaService],
  exports: [PdfDteService], 
  imports: [AuthModule],
})
export class PdfDteModule { }
