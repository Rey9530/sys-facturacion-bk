import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './modules/users/users.module';
import { SeedModule } from './modules/seed/seed.module';

import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    UsersModule,
    SeedModule,
    AuthModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
