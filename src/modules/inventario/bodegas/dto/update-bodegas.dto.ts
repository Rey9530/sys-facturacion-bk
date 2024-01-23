import { PartialType } from '@nestjs/swagger';
import { CreateBodegasDto } from './create-bodegas.dto';

export class UpdateBodegasDto extends PartialType(CreateBodegasDto) {}
