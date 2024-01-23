import { Controller, Get, Post, Body, Param, Delete, ParseIntPipe, Put } from '@nestjs/common';
import { BloquesService } from './bloques.service';
import { CreateBloqueDto } from './dto/create-bloque.dto';
import { UpdateBloqueDto } from './dto/update-bloque.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Auth, GetUser } from 'src/modules/auth/decorators';
import { HEADER_API_BEARER_AUTH } from 'src/common/const';
import { Usuarios } from '@prisma/client';

@Controller('facturacion/bloques')
@ApiTags('Bloques de Facturas')
@Auth()
@ApiBearerAuth(HEADER_API_BEARER_AUTH)
export class BloquesController {
  constructor(private readonly bloquesService: BloquesService) { }

  @Post()
  create(
    @Body() createBloqueDto: CreateBloqueDto,
    @GetUser() user: Usuarios
  ) {
    return this.bloquesService.create(createBloqueDto, user);
  }

  @Get()
  findAll(
    @GetUser() user: Usuarios
  ) {
    return this.bloquesService.findAll(user);
  }

  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: Usuarios,
  ) {
    return this.bloquesService.findOne(id, user);
  }

  @Get('factura/tipos')
  facturTipos(
    @GetUser() user: Usuarios,
  ) {
    return this.bloquesService.facturTipos(user);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBloqueDto: UpdateBloqueDto,
    @GetUser() user: Usuarios,
  ) {
    return this.bloquesService.update(id, updateBloqueDto, user);
  }

  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: Usuarios,
  ) {
    return this.bloquesService.remove(id,user);
  }
}
