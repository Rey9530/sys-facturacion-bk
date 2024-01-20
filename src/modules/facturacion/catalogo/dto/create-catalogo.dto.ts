import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsOptional, IsPositive, IsString } from "class-validator";

export class CreateCatalogoDto {


    @ApiProperty({})
    @IsInt()
    @IsPositive()
    id_tipo: number;

    @ApiProperty({})
    @IsInt()
    @IsPositive()
    id_categoria: number;

    @ApiProperty({})
    @IsString()
    codigo: string;

    @ApiProperty({})
    @IsString()
    nombre: string;

    @ApiProperty({})
    @IsPositive()
    precio_con_iva: number;

    @ApiProperty({})
    @IsPositive()
    precio_sin_iva: number;

    @ApiProperty({})
    @IsString()
    @IsOptional()
    descripcion: string;

    @ApiProperty({}) 
    @IsOptional()
    existencias_minimas: number;

    @ApiProperty({}) 
    @IsOptional()
    existencias_maximas: number;

}
