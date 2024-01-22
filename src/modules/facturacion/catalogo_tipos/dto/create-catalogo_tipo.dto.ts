import { ApiProperty } from "@nestjs/swagger";
import { IsString, MinLength } from "class-validator";

export class CreateCatalogoTipoDto {


    @ApiProperty({})
    @IsString()
    @MinLength(2)
    nombre: string;

}
