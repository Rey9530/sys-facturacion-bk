import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateFacturaDto {
  @ApiProperty({})
  @IsString()
  @MinLength(4)
  cliente: string;

  @ApiProperty({})
  @IsString()
  @MinLength(4)
  @IsOptional()
  direccion: string;

  @ApiProperty({})
  @IsString()
  @MinLength(4)
  @IsOptional()
  no_registro: string;

  @ApiProperty({})
  @IsString()
  @MinLength(4)
  @IsOptional()
  nit: string;

  @ApiProperty({})
  @IsString()
  @MinLength(4)
  @IsOptional()
  giro: string;

  @ApiProperty({})
  @IsNumber()
  @IsPositive()
  @IsOptional()
  id_municipio: number;

  @ApiProperty({})
  @IsNumber()
  @IsPositive() 
  id_tipo_factura: number;

  @ApiProperty({})
  @IsNumber()
  @IsPositive()
  @IsOptional()
  subtotal: number;

  @ApiProperty({})
  @IsNumber()
  @IsPositive()
  @IsOptional()
  descuento: number;

  @ApiProperty({})
  @IsNumber()
  @IsPositive()
  @IsOptional()
  iva: number;

  @ApiProperty({})
  @IsNumber()
  @IsPositive()
  @IsOptional()
  iva_retenido: number;

  @ApiProperty({})
  @IsNumber()
  @IsPositive()
  @IsOptional()
  iva_percivido: number;

  @ApiProperty({})
  @IsNumber()
  @IsPositive()
  @IsOptional()
  total: number;

  @ApiProperty({})
  @IsNumber()
  @IsPositive()
  @IsOptional()
  efectivo: number;

  @ApiProperty({})
  @IsNumber()
  @IsPositive()
  @IsOptional()
  tarjeta: number;

  @ApiProperty({})
  @IsNumber()
  @IsPositive()
  @IsOptional()
  cheque: number;

  @ApiProperty({})
  @IsNumber()
  @IsPositive()
  @IsOptional()
  transferencia: number;

  @ApiProperty({})
  @IsNumber()
  @IsPositive()
  @IsOptional()
  credito: number;

  @ApiProperty({})
  @IsNumber()
  @IsPositive() 
  id_metodo_pago: number;

  @ApiProperty({})
  @IsNumber()
  @IsPositive()
  @IsOptional()
  id_cliente: number;

  @ApiProperty({})
  @IsNumber()
  @IsOptional()
  @IsPositive()
  id_descuento: number;

  @ApiProperty({})
  @IsArray()
  @IsOptional()
  detalle_factura: [];
}
