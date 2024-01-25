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
  cliente: string;

  @ApiProperty({}) 
  @IsOptional()
  direccion: string;

  @ApiProperty({}) 
  @IsOptional()
  no_registro: string;

  @ApiProperty({}) 
  @IsOptional()
  nit: string;

  @ApiProperty({}) 
  @IsOptional()
  giro: string;

  @ApiProperty({}) 
  @IsOptional()
  id_municipio: number;

  @ApiProperty({})
  @IsNumber()
  @IsPositive() 
  id_tipo_factura: number;

  @ApiProperty({}) 
  @IsOptional()
  subtotal: number;

  @ApiProperty({}) 
  @IsOptional()
  descuento: number;

  @ApiProperty({}) 
  @IsOptional()
  iva: number;

  @ApiProperty({}) 
  @IsOptional()
  iva_retenido: number;

  @ApiProperty({}) 
  @IsOptional()
  iva_percivido: number;

  @ApiProperty({}) 
  @IsOptional()
  total: number;

  @ApiProperty({}) 
  @IsOptional()
  efectivo: number;

  @ApiProperty({}) 
  @IsOptional()
  tarjeta: number;

  @ApiProperty({}) 
  @IsOptional()
  cheque: number;

  @ApiProperty({}) 
  @IsOptional()
  transferencia: number;

  @ApiProperty({}) 
  @IsOptional()
  credito: number;

  @ApiProperty({})
  @IsNumber()
  @IsPositive() 
  id_metodo_pago: number;

  @ApiProperty({}) 
  @IsOptional()
  id_cliente: number;

  @ApiProperty({}) 
  @IsOptional() 
  id_descuento: number;

  @ApiProperty({})
  @IsArray()
  @IsOptional()
  detalle_factura: [];
}
