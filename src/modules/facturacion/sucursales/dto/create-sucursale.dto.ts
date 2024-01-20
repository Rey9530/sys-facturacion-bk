import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString, MinLength } from "class-validator";

export class CreateSucursaleDto {

    @ApiProperty({})
    @IsString()
    @MinLength(4)
    nombre: string;


    @ApiProperty({})
    @IsString()
    @IsOptional()
    color: string;
}
