import { Module } from '@nestjs/common';
import { SendEmailsService } from './send-emails.service';
import { PrismaService } from 'src/common/services';
import { AuthModule } from '../auth/auth.module';
import { SednEmailsController } from './send-emails.controller';

@Module({
  controllers: [SednEmailsController],
  providers: [SendEmailsService,PrismaService],
  imports: [AuthModule],
  exports: [SendEmailsService]
})
export class SendEmailsModule { }
