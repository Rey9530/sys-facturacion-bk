import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsPositive, IsString, MinLength } from "class-validator";

export class CreateBodegasDto {


    @ApiProperty({})
    @IsString()
    @MinLength(4)
    nombre: string;


    @ApiProperty({})
    @IsInt()
    @IsPositive()
    id_sucursal: number;

}
