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

    @ApiProperty({ example: '1' })
    @IsInt()
    @IsPositive()
    id_municipio: number;


    @ApiProperty({ example: '1' }) 
    @IsOptional()
    dias_credito: number;

    @ApiProperty({})///==
    @IsString()
    
    direccion: string;

    @ApiProperty({})
    @IsString()
    
    @IsOptional()
    dui: string;

    @ApiProperty({})//===
    @IsString()
    
    nombre_contac_1: string;

    @ApiProperty({})//====
    @IsString()
    
    telefono_contac_1: string;

    @ApiProperty({})
    @IsString()
    
    @IsOptional()
    correo_contac_1: string;

    @ApiProperty({})
    @IsString()
    
    @IsOptional()
    nombre_contac_2: string;

    @ApiProperty({})
    @IsString()
    
    @IsOptional()
    telefono_contac_2: string;

    @ApiProperty({})
    @IsString()
    
    @IsOptional()
    correo_contac_2: string;

    @ApiProperty({})
    @IsString()
    
    @IsOptional()
    nombre_contac_3: string;

    @ApiProperty({})
    @IsString()
    
    @IsOptional()
    telefono_contac_3: string;

    @ApiProperty({})
    @IsString()
    
    @IsOptional()
    correo_contac_3: string;

    @ApiProperty({ example: '1' })//====
    @IsInt()
    @IsPositive()
    id_tipo_proveedor: number;

    @ApiProperty({ example: '1' }) 
    @IsOptional()
    id_banco: number;

    @ApiProperty({})
    @IsString()
    
    @IsOptional()
    no_cuenta: string;

    @ApiProperty({})
    @IsString()
    
    @IsOptional()
    tipo_cuenta: string;
}
