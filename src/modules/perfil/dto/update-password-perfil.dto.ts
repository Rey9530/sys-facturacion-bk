import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString, MinLength } from "class-validator";

export class UpdatePasswordDto {

    @ApiProperty({})
    @IsString()
    @MinLength(4)
    clave_actual: string;

    @ApiProperty({})
    @IsString()
    @MinLength(4)
    clave_nueva: string;

    @ApiProperty({})
    @IsString()
    @IsOptional()
    @MinLength(4)
    clave_confirmada: string;
}
