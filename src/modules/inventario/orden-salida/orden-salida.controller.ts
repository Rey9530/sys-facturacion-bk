import { Controller, Get, Post, Body, Param, Delete, ParseIntPipe, Put } from '@nestjs/common';
import { OrdenSalidaService } from './orden-salida.service';
import { CreateOrdenSalidaDto } from './dto/create-orden-salida.dto';
import { UpdateOrdenSalidaDto } from './dto/update-orden-salida.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/modules/auth/decorators';
import { HEADER_API_BEARER_AUTH } from 'src/common/const';


@Controller('inventario/orden-salida')
@ApiTags('Ordenes de Salida')
@Auth()
@ApiBearerAuth(HEADER_API_BEARER_AUTH)
export class OrdenSalidaController {
  constructor(private readonly ordenSalidaService: OrdenSalidaService) { }

  @Post()
  create(@Body() createOrdenSalidaDto: CreateOrdenSalidaDto) {
    return this.ordenSalidaService.create(createOrdenSalidaDto);
  }

  @Get()
  findAll() {
    return this.ordenSalidaService.findAll();
  }

  @Get('obtener/motivos')
  findMotivos() {
    return this.ordenSalidaService.findMotivos();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.ordenSalidaService.findOne(id);
  }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateOrdenSalidaDto: UpdateOrdenSalidaDto) {
    return this.ordenSalidaService.update(id, updateOrdenSalidaDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.ordenSalidaService.remove(id);
  }
}
