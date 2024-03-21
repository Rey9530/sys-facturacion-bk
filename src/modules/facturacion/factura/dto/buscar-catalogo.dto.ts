import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class BuscartCatalogoDto {
  @ApiProperty({})
  @IsString()
  @IsOptional()
  query: string;
}
