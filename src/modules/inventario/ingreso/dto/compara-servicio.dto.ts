import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsOptional, IsPositive, IsString, Matches, MinLength } from "class-validator";
import { FORMAT_FECHA_YYYY_MM_DD } from "src/common/const";


export class CompraServicioDto {

    @ApiProperty({ example: '1' })
    @IsInt()
    @IsPositive()
    id_proveedor: number;

    @ApiProperty({ example: '654' })
    @IsString()
    @MinLength(4)
    numero_factura: string;


    @ApiProperty()
    @IsString()
    @MinLength(4)
    tipo_compra: string;


    @ApiProperty()
    @IsString()
    @MinLength(4)
    tipo_factura: string;

    @ApiProperty()
    @Matches(FORMAT_FECHA_YYYY_MM_DD, {
        message: 'La fecha hasta es incorrecta debe ser  YYYY-mm-dd',
    })
    fecha_factura: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    @MinLength(4)
    numero_quedan: string;    //  = "",


    @ApiProperty({ example: 'CONTADO' })
    @IsOptional()
    @IsString()
    @MinLength(4)
    tipo_pago: string;    //  = "CONTADO",

    @ApiProperty({ example: '1' })
    @IsPositive()
    monto: number;


    @ApiProperty({ example: '1' })
    @IsPositive()
    total: number;

    @ApiProperty()
    @IsOptional()
    @IsString()
    @MinLength(4)
    tipo_inventario: string;    //  = "MP", 

    @ApiProperty()
    @IsOptional()
    @IsString()
    @MinLength(4)
    detalle: string;    //  = "",



    @ApiProperty({ example: '1' })
    @IsInt()
    @IsPositive()
    @IsOptional()
    dias_credito: number;

    @ApiProperty({ example: '1' })
    @IsInt()
    @IsPositive()
    @IsOptional()
    id_sucursal: number;

    @ApiProperty({ example: '1' })
    @IsPositive()
    @IsOptional()
    iva: number;

    @ApiProperty({ example: '1' })
    @IsPositive()
    @IsOptional()
    cesc: number;

    @ApiProperty({ example: '1' })
    @IsPositive()
    @IsOptional()
    iva_percivido: number;


    @ApiProperty({ example: '1' })
    @IsPositive()
    @IsOptional()
    fovial: number;

    @ApiProperty({ example: '1' })
    @IsPositive()
    @IsOptional()
    cotrans: number;


}
