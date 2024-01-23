import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsPositive, IsString } from 'class-validator';

export class CreateClienteDto {
  @ApiProperty({})
  @IsString()
  nombre: string;

  @ApiProperty({})
  @IsString()
  @IsOptional()
  giro: string;

  @ApiProperty({})
  @IsString()
  @IsOptional()
  razon_social: string;

  @ApiProperty({})
  @IsString()
  @IsOptional()
  registro_nrc: string;

  @ApiProperty({})
  @IsString()
  @IsOptional()
  nit: string;

  @ApiProperty({})
  @IsPositive()
  @IsOptional()
  id_municipio: number;

  @ApiProperty({})
  @IsPositive()
  @IsOptional()
  id_tipo_cliente: number;

  @ApiProperty({})
  @IsString()
  direccion: string;

  @ApiProperty({})
  @IsString()
  telefono: string;

  @ApiProperty({})
  @IsString()
  @IsOptional()
  correo: string;

  @ApiProperty({})
  @IsString()
  @IsOptional()
  dui: string;
}
