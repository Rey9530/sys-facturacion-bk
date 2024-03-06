import { Controller, Get, Post, Body, Param, Put, ParseIntPipe, UploadedFile, ParseFilePipe, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { SistemaDataService } from './sistema_data.service';
import { UpdateSistemaDatumDto } from './dto/update-sistema_datum.dto';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/modules/auth/decorators';
import { HEADER_API_BEARER_AUTH } from 'src/common/const';
import { FileInterceptor, FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';

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
  @Post(':id')
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'sysicon', maxCount: 1 },
    { name: 'invoiceicon', maxCount: 1 },
  ]))
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSistemaDatumDto: UpdateSistemaDatumDto,
    @UploadedFiles() files: { sysicon?: Express.Multer.File[], invoiceicon?: Express.Multer.File[] }
  ) { 
    if (files.sysicon != null && files.sysicon.length > 0) {
      this.sistemaDataService.updateIconSystem(+id, files.sysicon[0].path);
    }

    if (files.invoiceicon != null && files.invoiceicon.length > 0) {
      this.sistemaDataService.updateIconInvoice(+id, files.invoiceicon[0].path);
    } 
    return this.sistemaDataService.update(id, updateSistemaDatumDto);
  }

}
