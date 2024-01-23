import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe, Put } from '@nestjs/common';
import { ProveedoresService } from './proveedores.service';
import { CreateProveedoreDto } from './dto/create-proveedore.dto';
import { UpdateProveedoreDto } from './dto/update-proveedore.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Auth, GetUser } from 'src/modules/auth/decorators';
import { HEADER_API_BEARER_AUTH } from 'src/common/const';
import { PaginationProveedoresDto } from './dto/pagintaion-proveedores.dto';
import { Usuarios } from '@prisma/client';

@Controller('inventario/proveedores')
@ApiTags('Proveedores')
@Auth()
@ApiBearerAuth(HEADER_API_BEARER_AUTH)
export class ProveedoresController {
  constructor(private readonly proveedoresService: ProveedoresService) { }

  @Post()
  create(
    @Body() createProveedoreDto: CreateProveedoreDto,
    @GetUser() user: Usuarios,) {
    return this.proveedoresService.create(createProveedoreDto, user);
  }

  @Get()
  findAll(
    @Query() query: PaginationProveedoresDto
  ) {
    return this.proveedoresService.findAll(query);
  }

  @Get("listado/bancos")
  listadoBancos(
  ) {
    return this.proveedoresService.listadoBancos();
  }
  @Get("obtener/tipos/contribuyentes")
  listadoTiposContrinuyentes(
  ) {
    return this.proveedoresService.listadoTiposContrinuyentes();
  }

  @Get('listado/facturas/:id')
  findInvoice(@Param('id', ParseIntPipe) id: number) {
    return this.proveedoresService.findInvoice(id);
  }


  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.proveedoresService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProveedoreDto: UpdateProveedoreDto
  ) {
    return this.proveedoresService.update(id, updateProveedoreDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.proveedoresService.remove(id);
  }
}
