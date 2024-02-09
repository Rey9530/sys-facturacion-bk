import { Controller, Get, Res } from '@nestjs/common';
import { PdfDteService } from './pdf-dte.service';
import { Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';

@Controller('pdf-dte')
export class PdfDteController {
  constructor(private readonly pdfDteService: PdfDteService) {}

  @Get('generate-pdf')
  async generatePdf(@Res() res: Response) {
    const html = `<!DOCTYPE html>
    <html lang="en">
    
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Factura</title>
        <style>
            .contenedor-flexbox {
                display: flex;
                /*Convertimos al menú en flexbox*/
                justify-content: space-between;
                /*Con esto le indicamos que margine todos los items que se encuentra adentro hacia la derecha e izquierda*/
                align-items: center;
                /*con esto alineamos de manera vertical*/
            }
        </style>
    </head>
    
    <body style="text-align: center;">
        <h4>DOCUMENTO TRIBUTARIO ELECTRÓNICO <br>FACTURA</h4>
        <div class="contenedor-flexbox">
            <div style="width:44%; ">
    
                <table style="width: 100%;">
                    <tr>
                        <td>Código de Generación</td>
                        <td>Código de Generación</td>
                    </tr>
                    <tr>
                        <td>Número de Control:</td>
                        <td>Número de Con</td>
                    </tr>
                    <tr>
                        <td>Sello de Recepción:</td>
                        <td>Sello de Recepción</td>
                    </tr>
                </table>
            </div>
            <div style="width:12%;">
                <img src="https://upload.wikimedia.org/wikipedia/commons/d/d7/Commons_QR_code.png" style="width: 100%;"
                    alt="">
            </div>
            <div style="width:44%;">
    
                <table style="width: 100%;">
                    <tr>
                        <td>Módelo de Facturación:</td>
                        <td>Módelo de Facturación</td>
                    </tr>
                    <tr>
                        <td>Tipo de Transmisión:</td>
                        <td>Tipo de Transmisión</td>
                    </tr>
                    <tr>
                        <td>Fecha y Hora de Generación:</td>
                        <td>Fecha y Hora de Generación</td>
                    </tr>
                </table>
            </div>
        </div>
        <div class="contenedor-flexbox">
            <div style="width:45%; "> 
                <table style="width: 100%;">
                    <tr>
                        <td colspan="2">EMISOR</td> 
                    </tr> 
                    <tr>
                        <td>Nombre o razón social:</td>
                        <td></td>
                    </tr> 
                    <tr>
                        <td>NIT:</td>
                        <td></td>
                    </tr> 
                    <tr>
                        <td>NRC:</td>
                        <td></td>
                    </tr> 
                    <tr>
                        <td>Actividad económica:</td>
                        <td></td>
                    </tr> 
                    <tr>
                        <td>Dirección:</td>
                        <td></td>
                    </tr> 
                    <tr>
                        <td>Número de teléfono:</td>
                        <td></td>
                    </tr> 
                    <tr>
                        <td>Correo electrónico:</td>
                        <td></td>
                    </tr> 
                    <tr>
                        <td>Nombre Comercial:</td>
                        <td></td>
                    </tr> 
                    <tr>
                        <td>Tipo de establecimiento:</td>
                        <td></td>
                    </tr> 
                </table>
            </div>
    
            <div style="width:8%; ">
            </div> 
            <div style="width:45%; "> 
                <table style="width: 100%;">
                    <tr>
                        <td colspan="2">RECEPTOR</td> 
                    </tr> 
                    <tr>
                        <td>Nombre o razón socia:</td>
                        <td></td>
                    </tr> 
                    <tr>
                        <td>Tipo de doc. de <br>
                            Identificación:</td>
                        <td></td>
                    </tr> 
                    <tr>
                        <td>N° de doc. de Identificación:</td>
                        <td></td>
                    </tr> 
                    <tr>
                        <td>Correo Electrónico:</td>
                        <td></td>
                    </tr> 
                    <tr>
                        <td>Nombre Comercial::</td>
                        <td></td>
                    </tr>  
                </table>
            </div>
        </div>
    
    </body>
    
    </html>`;
    // const templateHtml: string = fs.readFileSync("index.html", 'utf8');
    const pdfBuffer = await this.pdfDteService.generatePdf(html);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=report.pdf');
    res.end(pdfBuffer);
  }
}
