import { Controller, Get, Post, Body, Param, Delete, Query, Put } from '@nestjs/common';
import { CatalogoService } from './catalogo.service';
import { CreateCatalogoDto } from './dto/create-catalogo.dto';
import { UpdateCatalogoDto } from './dto/update-catalogo.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/modules/auth/decorators';
import { HEADER_API_BEARER_AUTH } from 'src/common/const';
import { PaginationCatalogoDto } from './dto/pagintaion-catalogo.dto';

@ApiTags('Catalogo')
@Controller('facturacion/catalogo')
@Auth()
@ApiBearerAuth(HEADER_API_BEARER_AUTH)
export class CatalogoController {

  constructor(private readonly catalogoService: CatalogoService) { }



  @Get()
  findAll(
    @Query() query: PaginationCatalogoDto
  ) {
    return this.catalogoService.findAll(query);
  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.catalogoService.findOne(+id);
  }

  @Post()
  create(@Body() createCatalogoDto: CreateCatalogoDto) {
    return this.catalogoService.create(createCatalogoDto);
  }


  @Put(':id')
  update(@Param('id') id: string, @Body() updateCatalogoDto: UpdateCatalogoDto) {
    return this.catalogoService.update(+id, updateCatalogoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.catalogoService.remove(+id);
  }
}
