import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsOptional, MinLength, IsInt, IsPositive } from "class-validator";

export class CreateOrdenSalidaDto {


    @ApiProperty({})
    @IsString()
    @MinLength(4)
    nombre: string;


    @ApiProperty({ example: '1' })
    @IsInt()
    @IsPositive()
    id_sucursal: number;
}
