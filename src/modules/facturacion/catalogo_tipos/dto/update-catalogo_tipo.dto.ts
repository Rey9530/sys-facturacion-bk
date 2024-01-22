import { PartialType } from '@nestjs/swagger';
import { CreateCatalogoTipoDto } from './create-catalogo_tipo.dto';

export class UpdateCatalogoTipoDto extends PartialType(CreateCatalogoTipoDto) {}
