import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsOptional, IsPositive, IsString, MinLength } from "class-validator";

export class CreateProveedoreDto {



    @ApiProperty({})//=
    @IsString()
    @IsOptional()
    @MinLength(2)
    nombre: string;


    @ApiProperty({})
    @IsString()
    @IsOptional()
    @MinLength(4)
    giro: string;

    @ApiProperty({})
    @IsString()
    @MinLength(4)
    @IsOptional()
    razon_social: string;

    @ApiProperty({})
    @IsString()
    @MinLength(4)
    @IsOptional()
    registro_nrc: string;

    @ApiProperty({})
    @IsString()
    @MinLength(4)
    @IsOptional()
    nit: string;

    @ApiProperty({ example: '1' })
    @IsInt()
    @IsPositive()
    id_municipio: number;


    @ApiProperty({ example: '1' })
    @IsInt()
    @IsPositive()
    @IsOptional()
    dias_credito: number;

    @ApiProperty({})///==
    @IsString()
    @MinLength(4)
    direccion: string;

    @ApiProperty({})
    @IsString()
    @MinLength(4)
    @IsOptional()
    dui: string;

    @ApiProperty({})//===
    @IsString()
    @MinLength(4)
    nombre_contac_1: string;

    @ApiProperty({})//====
    @IsString()
    @MinLength(4)
    telefono_contac_1: string;

    @ApiProperty({})
    @IsString()
    @MinLength(4)
    @IsOptional()
    correo_contac_1: string;

    @ApiProperty({})
    @IsString()
    @MinLength(4)
    @IsOptional()
    nombre_contac_2: string;

    @ApiProperty({})
    @IsString()
    @MinLength(4)
    @IsOptional()
    telefono_contac_2: string;

    @ApiProperty({})
    @IsString()
    @MinLength(4)
    @IsOptional()
    correo_contac_2: string;

    @ApiProperty({})
    @IsString()
    @MinLength(4)
    @IsOptional()
    nombre_contac_3: string;

    @ApiProperty({})
    @IsString()
    @MinLength(4)
    @IsOptional()
    telefono_contac_3: string;

    @ApiProperty({})
    @IsString()
    @MinLength(4)
    @IsOptional()
    correo_contac_3: string;

    @ApiProperty({ example: '1' })//====
    @IsInt()
    @IsPositive()
    id_tipo_proveedor: number;

    @ApiProperty({ example: '1' })
    @IsInt()
    @IsPositive()
    @IsOptional()
    id_banco: number;

    @ApiProperty({})
    @IsString()
    @MinLength(4)
    @IsOptional()
    no_cuenta: string;

    @ApiProperty({})
    @IsString()
    @MinLength(4)
    @IsOptional()
    tipo_cuenta: string;
}
