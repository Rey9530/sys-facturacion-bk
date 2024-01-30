import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString, MinLength } from "class-validator";

export class CreateCatalogoCategoriaDto {

    @ApiProperty({})
    @IsString()
    @MinLength(2)
    nombre: string; 

    @ApiProperty({}) 
    @IsOptional()
    id_categoria_padre: number;

}
