import { PartialType } from '@nestjs/swagger';
import { CreateElectronicaDto } from './create-electronica.dto';

export class UpdateElectronicaDto extends PartialType(CreateElectronicaDto) {}
