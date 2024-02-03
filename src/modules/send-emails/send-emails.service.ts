import { Injectable } from '@nestjs/common';
import { Attachment, MailtrapClient } from 'mailtrap';
// import { ConfigService } from '@nestjs/config';
// import { promises as fs } from 'fs';



@Injectable()
export class SendEmailsService {

    constructor() { }

    async sendEmailInvoice(to, json, from, nameJson) { 
        const TOKEN = "b0cde8a032cc5cbc6341033c9d33082b";
        const SENDER_EMAIL = "<invoices@relex-dev.com>";
        const RECIPIENT_EMAIL = "<" + to + ">";

        const client = new MailtrapClient({ token: TOKEN });
        const sender = { name: from, email: SENDER_EMAIL };
        const contenidoBase64 = Buffer.from(json).toString('base64');

        // Convertir el contenido del archivo a base64 
        let array: Attachment[] = [
            {
                filename: nameJson,
                type: "application/json",
                content: contenidoBase64,
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
