import { ApiProperty } from "@nestjs/swagger";
import { IsString, MinLength } from "class-validator";

export class CreateCatalogoCategoriaDto {

    @ApiProperty({})
    @IsString()
    @MinLength(2)
    nombre: string;


}
