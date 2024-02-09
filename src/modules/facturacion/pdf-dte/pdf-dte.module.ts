import { Module } from '@nestjs/common';
import { PdfDteService } from './pdf-dte.service';
import { PdfDteController } from './pdf-dte.controller';

@Module({
  controllers: [PdfDteController],
  providers: [PdfDteService],
})
export class PdfDteModule {}
