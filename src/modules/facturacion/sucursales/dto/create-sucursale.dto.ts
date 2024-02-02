import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsPositive, IsString, MinLength } from "class-validator";

export class CreateSucursaleDto {

    @ApiProperty({})
    @IsString()
    @MinLength(4)
    nombre: string; 
    @ApiProperty({})
    @IsString()
    @IsOptional()
    color: string; 
    @ApiProperty({})
    @IsString()
    telefono: string;
    @ApiProperty({})
    @IsPositive()
    id_municipio: number;
    @ApiProperty({})
    @IsPositive()
    id_tipo_establecimiento: number;
}
