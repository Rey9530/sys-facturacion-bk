import { Controller, Get } from '@nestjs/common';
import { SendEmailsService } from './send-emails.service';

@Controller('send-emails')
export class SednEmailsController {
  constructor(private readonly seedService: SendEmailsService) { }


  // @Get()
  // executeSeed() {
  //   return this.seedService.sendEmailInvoice();
  // }

}
