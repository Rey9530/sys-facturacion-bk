import { Controller, Get, Query } from '@nestjs/common';
import { FacturacionService } from './facturacion.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Auth, GetUser } from 'src/modules/auth/decorators';
import { HEADER_API_BEARER_AUTH } from 'src/common/const';
import { Usuarios } from '@prisma/client';
import { CreditoFiscalDto } from './dto/credito-fiscal.dto';
import { ConsumidorFinalDto } from './dto/consumidorFinal.dto';

@ApiTags('Facturacion')
@Controller('reportes/facturacion')
@Auth()
@ApiBearerAuth(HEADER_API_BEARER_AUTH)
export class FacturacionController {
  constructor(private readonly facturacionService: FacturacionService) { }

  @Get("consumidor_final")
  consumidorFinal( 
    @Query() params: ConsumidorFinalDto,
    @GetUser() user: Usuarios
  ) {
    console.log(params)
    return this.facturacionService.consumidorFinal(params, user.id_sucursal);
  }

  @Get("credito_fiscal")
  findAll(
    @Query() params: CreditoFiscalDto,
    @GetUser() user: Usuarios
  ) {
    return this.facturacionService.getCreditoFiscal(params, user.id_sucursal);
  }

}
