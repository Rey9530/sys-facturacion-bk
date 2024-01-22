import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { CatalogoTiposService } from './catalogo_tipos.service';
import { CreateCatalogoTipoDto } from './dto/create-catalogo_tipo.dto';
import { UpdateCatalogoTipoDto } from './dto/update-catalogo_tipo.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/modules/auth/decorators';
import { HEADER_API_BEARER_AUTH } from 'src/common/const';

@Controller('facturacion/catalogo_tipos')
@ApiTags('catalogo tipos')
@Auth()
@ApiBearerAuth(HEADER_API_BEARER_AUTH)
export class CatalogoTiposController {
  constructor(private readonly catalogoTiposService: CatalogoTiposService) { }


  @Get()
  findAll() {
    return this.catalogoTiposService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.catalogoTiposService.findOne(id);
  }
  @Post()
  create(@Body() createCatalogoTipoDto: CreateCatalogoTipoDto) {
    return this.catalogoTiposService.create(createCatalogoTipoDto);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateCatalogoTipoDto: UpdateCatalogoTipoDto) {
    return this.catalogoTiposService.update(id, updateCatalogoTipoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.catalogoTiposService.remove(+id);
  }
}
