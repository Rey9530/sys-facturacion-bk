import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';

export class CierreManualTDO {
  @ApiProperty({})
  @IsNumber()
  @IsOptional()
  @IsPositive()
  venta_bruta: number;

  @ApiProperty({})
  @IsNumber()
  @IsOptional()
  @IsPositive()
  para_llevar: number;

  @ApiProperty({})
  @IsNumber()
  @IsOptional()
  @IsPositive()
  tarjeta_credomatic: number;

  @ApiProperty({})
  @IsNumber()
  @IsOptional()
  @IsPositive()
  tarjeta_serfinza: number;

  @ApiProperty({})
  @IsNumber()
  @IsOptional()
  @IsPositive()
  tarjeta_promerica: number;

  @ApiProperty({})
  @IsNumber()
  @IsOptional()
  @IsPositive()
  bitcoin: number;

  @ApiProperty({})
  @IsNumber()
  @IsOptional()
  @IsPositive()
  syke: number;

  @ApiProperty({})
  @IsNumber()
  @IsOptional()
  @IsPositive()
  total_restante: number;

  @ApiProperty({})
  @IsNumber()
  @IsOptional()
  @IsPositive()
  propina: number;

  @ApiProperty({})
  @IsNumber()
  @IsOptional()
  @IsPositive()
  venta_nota_sin_iva: number;

  @ApiProperty({})
  @IsNumber()
  @IsOptional()
  @IsPositive()
  cortecia: number;

  @ApiProperty({})
  @IsNumber()
  @IsOptional()
  @IsPositive()
  anti_cobrados: number;

  @ApiProperty({})
  @IsNumber()
  @IsOptional()
  @IsPositive()
  anti_reservas: number;

  @ApiProperty({})
  @IsNumber()
  @IsOptional()
  @IsPositive()
  certificado_regalo: number;

  @ApiProperty({})
  @IsNumber()
  @IsOptional()
  @IsPositive()
  hugo_app: number;

  @ApiProperty({})
  @IsNumber()
  @IsOptional()
  @IsPositive()
  pedidos_ya: number;

  @ApiProperty({})
  @IsNumber()
  @IsOptional()
  @IsPositive()
  compras: number;

  @ApiProperty({})
  @IsNumber()
  @IsOptional()
  @IsPositive()
  entrega_efectivo: number;

  @ApiProperty({})
  @IsNumber()
  @IsOptional()
  @IsPositive()
  fecha_cierre: number;

  @ApiProperty({})
  @IsNumber()
  @IsOptional()
  @IsPositive()
  id_sucursal: number;

  @ApiProperty({})
  @IsString()
  @IsOptional() 
  observacion: string;
}
