import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsPositive, IsString } from 'class-validator';

export class ContingencyDto {
  @ApiProperty({})
  @IsString()
  fecha_inicio: string;
  @ApiProperty({})
  @IsString()
  hora_inicio: string;
  @ApiProperty({})
  @IsString()
  fecha_fin: string;
  @ApiProperty({})
  @IsString()
  hora_fin: string;
  @ApiProperty({})
  @IsString()
  motivo: string; 
  @ApiProperty({})
  @IsPositive()
  tipo: number;
  @ApiProperty({})
  @IsArray()
  facturas: number[];
}
