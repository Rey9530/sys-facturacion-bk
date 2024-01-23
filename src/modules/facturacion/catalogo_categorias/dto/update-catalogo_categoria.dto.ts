import { PartialType } from '@nestjs/swagger';
import { CreateCatalogoCategoriaDto } from './create-catalogo_categoria.dto';

export class UpdateCatalogoCategoriaDto extends PartialType(CreateCatalogoCategoriaDto) {}
