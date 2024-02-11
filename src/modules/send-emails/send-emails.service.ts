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

    async sendEmailInvoice(factura, json) {
        const data = await this.prismaService.generalData.findFirstOrThrow();
        if (!data) throw new InternalServerErrorException('No se encontraron datos generales');
        const TOKEN = data.token_email;//"";
        const SENDER_EMAIL = "<" + data.sender_email + ">";
        const RECIPIENT_EMAIL = "<" + factura.Cliente.correo + ">";

        const client = new MailtrapClient({ token: TOKEN });
        const sender = { name: data.sender_email, email: SENDER_EMAIL };
        let array: Attachment[] = [
            {
                filename: json.identificacion.numeroControl + '.json',
                type: "application/json",
                content: Buffer.from(JSON.stringify(json)).toString('base64'),
            }, {
                filename: json.identificacion.numeroControl + '.pdf',
                type: "application/pdf",
                content: await this.pdfDteService.generatePdfFactura(factura),
            }
        ]
        client
            .send({
                from: sender,
                to: [{ email: RECIPIENT_EMAIL }],
                subject: "Factura " + json.identificacion.numeroControl,
                text: "Gracias pro su preferencia!",
                attachments: array
            })
            .then(console.log)
            .catch(console.error);
        return 'Email sent';
    }
}
