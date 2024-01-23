import { PartialType } from '@nestjs/swagger';
import { CreateBloqueDto } from './create-bloque.dto';

export class UpdateBloqueDto extends PartialType(CreateBloqueDto) {}
