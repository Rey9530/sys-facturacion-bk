import { Controller, Get, Param, ParseIntPipe, } from '@nestjs/common';
import { PdfDteService } from './pdf-dte.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/modules/auth/decorators';
import { HEADER_API_BEARER_AUTH } from 'src/common/const';

@Controller('pdf-dte')
@ApiTags('Generacion PDFs de facturas')
@Auth()
@ApiBearerAuth(HEADER_API_BEARER_AUTH)
export class PdfDteController {
    constructor(private readonly pdfDteService: PdfDteService) { }

    @Get('generate-pdf/:id')
    async generatePdf(
        @Param('id', ParseIntPipe) id: number,
    ) {
        return await this.pdfDteService.generatePdf(id);
    }
}
