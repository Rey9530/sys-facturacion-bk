import { ApiProperty } from "@nestjs/swagger";
import { IsDecimal, IsInt, IsOptional, IsPositive, IsString, MinLength } from "class-validator";

export class UpdateSistemaDatumDto {
    @ApiProperty({})
    @IsString()
    @MinLength(4)
    nombre_sistema: string;

    @ApiProperty({})
    @IsPositive()
    impuesto: number;

    @ApiProperty({})
    @IsInt()
    @IsOptional()
    id_tipo_contribuyente: number;

    @ApiProperty({})
    @IsString()
    @MinLength(3)
    nombre_comercial: string;

    @ApiProperty({})
    @IsPositive()
    id_actividad_economica: number;

    @ApiProperty({})
    @IsString()
    @MinLength(4)
    @IsOptional()
    direccion: string;

    @ApiProperty({})
    @IsString()
    @MinLength(4)
    @IsOptional()
    razon: string;

    @ApiProperty({})
    @IsString()
    @MinLength(4)
    @IsOptional()
    nit: string;

    @ApiProperty({})
    @IsString()
    @MinLength(4)
    @IsOptional()
    nrc: string;

    @ApiProperty({})
    @IsString()
    @MinLength(4)
    @IsOptional()
    contactos: string;
}



