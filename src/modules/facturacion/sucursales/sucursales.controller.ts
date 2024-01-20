import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { SucursalesService } from './sucursales.service';
import { CreateSucursaleDto } from './dto/create-sucursale.dto';
import { UpdateSucursaleDto } from './dto/update-sucursale.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Auth, GetUser } from 'src/modules/auth/decorators';
import { HEADER_API_BEARER_AUTH } from 'src/common/const';
import { Usuarios } from '@prisma/client';

@Controller('facturacion/sucursales')
@ApiTags('Sucursales')
@Auth()
@ApiBearerAuth(HEADER_API_BEARER_AUTH)
export class SucursalesController {
  constructor(private readonly sucursalesService: SucursalesService) { }

  @Post()
  create(@Body() createSucursaleDto: CreateSucursaleDto) {
    return this.sucursalesService.create(createSucursaleDto);
  }

  @Get()
  findAll(
    @GetUser() user: Usuarios
  ) {
    return this.sucursalesService.findAll(user);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sucursalesService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateSucursaleDto: UpdateSucursaleDto) {
    return this.sucursalesService.update(+id, updateSucursaleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sucursalesService.remove(+id);
  }
}
