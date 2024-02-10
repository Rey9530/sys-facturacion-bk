import { Module } from '@nestjs/common';
import { SendEmailsService } from './send-emails.service';
import { PrismaService } from 'src/common/services';
import { AuthModule } from '../auth/auth.module';
import { SednEmailsController } from './send-emails.controller';
import { PdfDteModule } from '../facturacion/pdf-dte/pdf-dte.module';

@Module({
  controllers: [SednEmailsController],
  providers: [SendEmailsService,PrismaService],
  imports: [AuthModule,PdfDteModule],
  exports: [SendEmailsService]
})
export class SendEmailsModule { }
