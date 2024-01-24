import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class BuscartCatalogoDto {
  @ApiProperty({})
  @IsString()
  query: string;
}
