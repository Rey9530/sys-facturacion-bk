import { Controller, Get, Post, Body, Param, Delete, Put, ParseIntPipe } from '@nestjs/common';
import { DescuentosService } from './descuentos.service';
import { CreateDescuentoDto } from './dto/create-descuento.dto';
import { UpdateDescuentoDto } from './dto/update-descuento.dto';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { HEADER_API_BEARER_AUTH } from 'src/common/const';
import { Auth } from 'src/modules/auth/decorators';

@Controller('facturacion/descuentos')
@ApiTags('Descuentos')
@Auth()
@ApiBearerAuth(HEADER_API_BEARER_AUTH)
export class DescuentosController {
  constructor(private readonly descuentosService: DescuentosService) { }

  @Post()
  create(@Body() createDescuentoDto: CreateDescuentoDto) {
    return this.descuentosService.create(createDescuentoDto);
  }

  @Get()
  findAll() {
    return this.descuentosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.descuentosService.findOne(id);
  }
  @Get('listar/tipos')
  listarTipos() {
    return this.descuentosService.listarTipos();
  }
  @Get('listar/activos')
  listarActivos() {
    return this.descuentosService.listarActivos();
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDescuentoDto: UpdateDescuentoDto,
  ) {
    return this.descuentosService.update(id, updateDescuentoDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.descuentosService.remove(id);
  }
}
