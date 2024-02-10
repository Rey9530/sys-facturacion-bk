import { Controller, Get, Res } from '@nestjs/common';
import { PdfDteService } from './pdf-dte.service';
import { Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';

@Controller('pdf-dte')
export class PdfDteController {
    constructor(private readonly pdfDteService: PdfDteService) { }

    @Get('generate-pdf')
    async generatePdf(@Res() res: Response) {
        const pdfBuffer = await this.pdfDteService.generatePdfFactura(62);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=report.pdf');
        res.end(pdfBuffer);
    }
}
