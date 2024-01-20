import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './modules/users/users.module';
import { SeedModule } from './modules/seed/seed.module';

import { AuthModule } from './modules/auth/auth.module';
import { PerfilModule } from './modules/perfil/perfil.module';
import { FacturacionModule } from './modules/reportes/facturacion/facturacion.module';
import { ComprasModule } from './modules/reportes/compras/compras.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    UsersModule,
    SeedModule,
    AuthModule,
    PerfilModule,
    FacturacionModule,
    ComprasModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
