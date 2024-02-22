import { Controller, Get, Post, Body, Param, Put, ParseIntPipe } from '@nestjs/common';
import { SistemaDataService } from './sistema_data.service';
import { UpdateSistemaDatumDto } from './dto/update-sistema_datum.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/modules/auth/decorators';
import { HEADER_API_BEARER_AUTH } from 'src/common/const';

@Controller('facturacion/sistema_data')
@ApiTags('Informacion de Sistema')
export class SistemaDataController {
  constructor(private readonly sistemaDataService: SistemaDataService) { }


  @Get()
  findAll() {
    return this.sistemaDataService.findAll();
  }


  @Auth()
  @ApiBearerAuth(HEADER_API_BEARER_AUTH)
  @Get("obtener/actividades/economicas")
  listadoActividadesEconomicas(
  ) {
    return this.sistemaDataService.listadoActividadesEconomicas();
  }


  @Auth()
  @ApiBearerAuth(HEADER_API_BEARER_AUTH)
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSistemaDatumDto: UpdateSistemaDatumDto
  ) {
    return this.sistemaDataService.update(id, updateSistemaDatumDto);
  }

}
