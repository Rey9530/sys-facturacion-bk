import { Module } from '@nestjs/common';
import { PdfDteService } from './pdf-dte.service';
import { PdfDteController } from './pdf-dte.controller';
import { PrismaService } from 'src/common/services';

@Module({
  controllers: [PdfDteController],
  providers: [PdfDteService,PrismaService],
  exports: [PdfDteService],
})
export class PdfDteModule {}
