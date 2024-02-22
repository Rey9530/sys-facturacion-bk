import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as JsReport from 'jsreport-core';
import * as JsReportChromePdf from 'jsreport-chrome-pdf';
import * as fs from 'fs';
import * as path from 'path';
import * as jsRender from 'jsrender';
import { PrismaService } from 'src/common/services';
import { formatNumber } from 'src/common/helpers';
import * as QRCode from 'qrcode';

@Injectable()
export class PdfDteService {
  private jsreport: JsReport.Reporter;

  constructor(
    private readonly prisma: PrismaService,
  ) {
    this.jsreport = JsReport();
    this.jsreport.use(JsReportChromePdf());

    this.jsreport
      .init({
        "extensions": {
          "chrome": {
            "launchOptions": {
              "args": ["--no-sandbox", '--disable-setuid-sandbox']
            }
          }
        }
      })
      .then(() => {
        console.log('JsReport initialized successfully');
      })
      .catch((err) => {
        console.error('Error initializing JsReport', err);
      });
  }

  async generatePdfFactura(factura_s: any): Promise<Buffer> {

    const dataGeneral = await this.prisma.generalData.findFirst();
    var jsonDte = JSON.parse(factura_s.dte_json);
    var jsonFirma = JSON.parse(factura_s.response_dte_json);
    jsonDte.emisor.direccion = factura_s.Sucursal.Municipio.nombre + ', ' + factura_s.Sucursal.Municipio.Departamento.nombre + ", " + factura_s.Sucursal.complemento;
    const tipoEstablecimiento = await this.prisma.dTETipoEstablecimiento.findFirst({ where: { codigo: jsonDte.emisor.tipoEstablecimiento } });
    jsonDte.emisor.tipoEstablecimiento = tipoEstablecimiento.nombre;

    var token = JSON.parse(factura_s.response_dte_json);
    jsonDte.firmaElectronica = jsonFirma.selloRecibido;
    jsonDte.selloRecibido = token.selloRecibido;
    jsonDte.receptor.tipoDocumento = factura_s.Cliente.DTETipoDocumentoIdentificacion?.nombre ?? "";
    jsonDte.resumen.totalNoSuj = formatNumber(jsonDte.resumen.totalNoSuj);
    jsonDte.resumen.totalExenta = formatNumber(jsonDte.resumen.totalExenta);
    jsonDte.resumen.totalGravada = formatNumber(jsonDte.resumen.totalGravada);
    jsonDte.resumen.subTotalVentas = formatNumber(jsonDte.resumen.subTotalVentas);
    jsonDte.resumen.descuNoSuj = formatNumber(jsonDte.resumen.descuNoSuj);
    jsonDte.resumen.descuExenta = formatNumber(jsonDte.resumen.descuExenta);
    jsonDte.resumen.descuGravada = formatNumber(jsonDte.resumen.descuGravada);
    jsonDte.resumen.totalDescu = formatNumber(jsonDte.resumen.totalDescu);
    jsonDte.resumen.subTotal = formatNumber(jsonDte.resumen.subTotal);
    jsonDte.resumen.ivaRete1 = formatNumber(jsonDte.resumen.ivaRete1);
    jsonDte.resumen.montoTotalOperacion = formatNumber(jsonDte.resumen.montoTotalOperacion);
    jsonDte.resumen.totalPagar = formatNumber(jsonDte.resumen.totalPagar);
    jsonDte.resumen.totalIva = formatNumber(jsonDte.resumen.totalIva);
    jsonDte.resumen.reteRenta = formatNumber(jsonDte.resumen.reteRenta);
    jsonDte.resumen.totalNoGravado = formatNumber(jsonDte.resumen.totalNoGravado);
    let cuerpoDocumento = [];
    for (let element of jsonDte.cuerpoDocumento) {
      element.precioUni = formatNumber(element.precioUni)
      element.montoDescu = formatNumber(element.montoDescu)
      element.ventaNoSuj = formatNumber(element.ventaNoSuj)
      element.ventaExenta = formatNumber(element.ventaExenta)
      element.ventaGravada = formatNumber(element.ventaGravada)
      element.noGravado = formatNumber(element.noGravado)  
      element.ivaItem = formatNumber(element.ivaItem)
      cuerpoDocumento.push(element); 
    }
    jsonDte.cuerpoDocumento = cuerpoDocumento;
    jsonDte.iconInvoice = dataGeneral.icono_factura;
    jsonDte.identificacion.tipoOperacion = jsonDte.identificacion.tipoOperacion == 1 ? "NORMAL" : "POR CONTINGENCIA";
    jsonDte.identificacion.tipoModelo = jsonDte.identificacion.tipoModelo == 1 ? "Modelo Facturación previo" : "Modelo de Facturación Diferido";
    jsonDte.qr = await this.generateQr("https://admin.factura.gob.sv/consultaPublica?ambiente=" + dataGeneral.ambiente + "&codGen=" + jsonDte.identificacion.codigoGeneracion + "&fechaEmi=" + jsonDte.identificacion.fecEmi);
    let template = '';
    jsonDte.nombreFactura = "N/A";
    if (jsonDte.identificacion.tipoDte == "01") {
      jsonDte.nombreFactura = "FACTURA";
    }
    if (jsonDte.identificacion.tipoDte == "03") {
      jsonDte.nombreFactura = "COMPROBANTE DE CRÉDITO FISCAL";
    }

    template = 'reports/dte/factura.html';
    return this.renderPdf(jsonDte, template);
  }


  async renderPdf(jsonDte, facturaTemplate: string) {
    const templateHtml: string = fs.readFileSync(path.join(process.cwd(), facturaTemplate), 'utf8')
    const tmpl = jsRender.templates(templateHtml);
    console.log(jsonDte);
    const content = tmpl.render(jsonDte);
    const result = await this.jsreport.render({
      template: {
        content: content,
        engine: 'none',
        recipe: 'chrome-pdf',
        chrome: {
          pdf: {
            format: 'Legal' // Directamente se puede usar 'Legal' para tamaño oficio
          },
        }
      },
    });

    // await fs.writeFileSync(path.join(process.cwd(), 'reports/pdf-temp/DTE-01-M001P001-000010000000021.pdf'), result.content);
    return result.content.toString('base64');
  }

  async generateQr(data: string): Promise<string> {
    try {
      // Generar QR como Data URL
      const qrCodeDataURL = await QRCode.toDataURL(data);
      return qrCodeDataURL;
    } catch (error) {
      throw new InternalServerErrorException('Error generando código QR');
    }
  }
}
