import { Module } from '@nestjs/common';
import { ElectronicaService } from './electronica.service';
import { PrismaService } from 'src/common/services';
import { AuthModule } from 'src/modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { SendEmailsModule } from 'src/modules/send-emails/send-emails.module';

@Module({
  controllers: [],
  providers: [ElectronicaService, PrismaService],
  imports: [AuthModule, ConfigModule, SendEmailsModule],
  exports: [ElectronicaService]
})
export class ElectronicaModule { }
