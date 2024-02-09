import { Injectable } from '@nestjs/common';
import * as JsReport from 'jsreport-core';
import * as JsReportChromePdf from 'jsreport-chrome-pdf';

@Injectable()
export class PdfDteService {
  private jsreport: JsReport.Reporter;

  constructor() {
    this.jsreport = JsReport();
    this.jsreport.use(JsReportChromePdf());

    // Es importante inicializar jsreport
    this.jsreport
      .init()
      .then(() => {
        console.log('JsReport initialized successfully');
      })
      .catch((err) => {
        console.error('Error initializing JsReport', err);
      });
  }

  async generatePdf(html: string): Promise<Buffer> {
    const result = await this.jsreport.render({
      template: {
        content: html,
        engine: 'none',
        recipe: 'chrome-pdf',
      },
    });
    return result.content;
  }
}
