import { Controller, Get, Post, Body, Param, Delete, Put, ParseIntPipe } from '@nestjs/common';
import { CatalogoCategoriasService } from './catalogo_categorias.service';
import { CreateCatalogoCategoriaDto } from './dto/create-catalogo_categoria.dto';
import { UpdateCatalogoCategoriaDto } from './dto/update-catalogo_categoria.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/modules/auth/decorators';
import { HEADER_API_BEARER_AUTH } from 'src/common/const';

@Controller('facturacion/catalogo_categorias')
@ApiTags('Catalogo Categorias')
@Auth()
@ApiBearerAuth(HEADER_API_BEARER_AUTH)
export class CatalogoCategoriasController {
  constructor(private readonly catalogoCategoriasService: CatalogoCategoriasService) { }

  @Get()
  findAll() {
    return this.catalogoCategoriasService.findAll();
  }
  @Post()
  create(@Body() createCatalogoCategoriaDto: CreateCatalogoCategoriaDto) {
    return this.catalogoCategoriasService.create(createCatalogoCategoriaDto);
  }


  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.catalogoCategoriasService.findOne(id);
  }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateCatalogoCategoriaDto: UpdateCatalogoCategoriaDto) {
    return this.catalogoCategoriasService.update(id, updateCatalogoCategoriaDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.catalogoCategoriasService.remove(id);
  }
}
