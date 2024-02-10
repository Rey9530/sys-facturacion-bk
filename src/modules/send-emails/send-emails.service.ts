import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Attachment, MailtrapClient } from 'mailtrap';
import { PdfDteService } from '../facturacion/pdf-dte/pdf-dte.service';
import { PrismaService } from 'src/common/services';
// import { ConfigService } from '@nestjs/config';
// import { promises as fs } from 'fs';



@Injectable()
export class SendEmailsService {

    constructor(
        private readonly pdfDteService: PdfDteService,
        private readonly prismaService: PrismaService,
    ) { }

    async sendEmailInvoice(to, json, from, nameJson, id_factura) {
        const data = await this.prismaService.generalData.findFirstOrThrow();
        if (!data) throw new InternalServerErrorException('No se encontraron datos generales');
        const TOKEN = data.token_email;//"";
        const SENDER_EMAIL = "<" + data.sender_email + ">";//invoices@relex-dev.com
        const RECIPIENT_EMAIL = "<" + to + ">";

        const client = new MailtrapClient({ token: TOKEN });
        const sender = { name: data.sender_email, email: SENDER_EMAIL };
        const contenidoBase64 = Buffer.from(json).toString('base64');
        const pdfBase64 = await this.pdfDteService.generatePdfFactura(id_factura); 
        let array: Attachment[] = [
            {
                filename: nameJson + '.json',
                type: "application/json",
                content: contenidoBase64,
            }, {
                filename: nameJson + '.pdf',
                type: "application/pdf",
                content: pdfBase64,
            }
        ]
        client
            .send({
                from: sender,
                to: [{ email: RECIPIENT_EMAIL }],
                subject: "Factura " + nameJson.replace('.json', ''),
                text: "Gracias pro su preferencia!",
                attachments: array
            })
            .then(console.log)
            .catch(console.error);
        return 'Email sent';
    }
}
