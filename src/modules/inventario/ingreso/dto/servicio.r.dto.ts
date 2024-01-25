import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsPositive, IsOptional, IsString, Matches, MinLength } from "class-validator";
import { FORMAT_FECHA_YYYY_MM_DD } from "src/common/const";


export class ServicioRDTO { 

    @ApiProperty({ example: '021545' })
    @IsString()
    @IsOptional()
    @MinLength(4)
    numero_factura: string;

    @ApiProperty()
    @Matches(FORMAT_FECHA_YYYY_MM_DD, {
        message: 'La fecha hasta es incorrecta debe ser  YYYY-mm-dd',
    })
    fecha_factura: string;

    @ApiProperty({ example: '1' })
    @IsPositive()
    monto: number;



    @ApiProperty({ example: '1' }) 
    @IsOptional()
    id_sucursal: number;

    @ApiProperty({ example: '1' })
    @IsInt()
    @IsPositive()
    @IsOptional()
    id_tipo_factura: number;


    @ApiProperty({ example: '021545' })
    @IsString()
    @IsOptional()
    @MinLength(4)
    nombre_proveedor: string;

    @ApiProperty({ example: '021545' })
    @IsString()
    @IsOptional() 
    tipo_inventario: string;

    @ApiProperty({ example: '021545' })
    @IsString()
    @IsOptional()
    @MinLength(4)
    tipo_pago: string;

    @ApiProperty({ example: '021545' })
    @IsString()
    @IsOptional()
    @MinLength(4)
    dui_proveedor: string;


    @ApiProperty({ example: '021545' })
    @IsString()
    @IsOptional()
    @MinLength(4)
    detalle: string;



}