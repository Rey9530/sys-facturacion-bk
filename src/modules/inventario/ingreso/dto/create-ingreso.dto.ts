import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsInt, IsOptional, IsPositive, IsString, Matches, MinLength } from "class-validator";
import { FORMAT_FECHA_YYYY_MM_DD } from "src/common/const";

export class CreateIngresoDto {

    @ApiProperty({ example: '1' })
    @IsInt()
    @IsPositive()
    id_proveedor: number;

    @ApiProperty({ example: '1' })
    @IsInt()
    @IsPositive()
    id_tipo_factura: number;

    @ApiProperty({})
    @IsArray()
    detalle_factura:[]


    @ApiProperty({ example: '021545' })
    @IsString()
    @IsOptional()
    @MinLength(4)
    numero_factura: string

    @ApiProperty({ example: '2024-01-31' })
    @IsString()
    @IsOptional()
    @Matches(FORMAT_FECHA_YYYY_MM_DD, {
        message: 'La fecha hasta es incorrecta debe ser  YYYY-mm-dd',
    })
    fecha_factura: string

    @ApiProperty({ example: 'CONTADO' })
    @IsOptional()
    @IsString()
    @MinLength(4)
    tipo_pago: string

    @ApiProperty({ example: '30' })
    @IsOptional() 
    dias_credito: number;

    @ApiProperty({ example: '1' })
    @IsOptional() 
    id_bodega: number;

    @ApiProperty({ example: '15.56' })
    @IsOptional()
    @IsPositive()
    subtotal: number;

    @ApiProperty({ example: '10.20' })
    @IsOptional() 
    descuento: number;

    @ApiProperty({ example: '1.13' })
    @IsOptional() 
    iva: number;

    @ApiProperty({ example: '0.10' })
    @IsOptional() 
    iva_retenido

    @ApiProperty({ example: '0.11' })
    @IsOptional() 
    iva_percivido: number;

    @ApiProperty({ example: '30.45' })
    @IsOptional()
    @IsPositive()
    total: number;
}
