import { Controller, Get, Post, Body, Param, Delete, ParseIntPipe, Put } from '@nestjs/common';
import { BodegasService } from './bodegas.service';
import { CreateBodegasDto } from './dto/create-bodegas.dto';
import { UpdateBodegasDto } from './dto/update-bodegas.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/modules/auth/decorators';
import { HEADER_API_BEARER_AUTH } from 'src/common/const';

@Controller('inventario/bodegas')
@ApiTags('Bodegas')
@Auth()
@ApiBearerAuth(HEADER_API_BEARER_AUTH)
export class BodegasController {
  constructor(private readonly bodegasService: BodegasService) { }

  @Post()
  create(@Body() createBodegasDto: CreateBodegasDto) {
    return this.bodegasService.create(createBodegasDto);
  }

  @Get()
  findAll() {
    return this.bodegasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.bodegasService.findOne(+id);
  }
  @Get('asignar_principal/:id')
  findOneAsignacion(@Param('id', ParseIntPipe) id: number) {
    return this.bodegasService.findOneAsignacion(id);
  }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateBodegasDto: UpdateBodegasDto) {
    return this.bodegasService.update(+id, updateBodegasDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.bodegasService.remove(+id);
  }
}
