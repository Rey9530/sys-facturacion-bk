import { PartialType } from '@nestjs/swagger';
import { CreateOrdenSalidaDto } from './create-orden-salida.dto';

export class UpdateOrdenSalidaDto extends PartialType(CreateOrdenSalidaDto) {}
