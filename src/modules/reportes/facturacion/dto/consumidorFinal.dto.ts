import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty, IsPositive, IsString } from "class-validator";

export class ConsumidorFinalDto {

    @ApiProperty({})
    @IsString() 
    @IsNotEmpty() 
    mes: string;


    @ApiProperty({})
    @IsString()
    @IsNotEmpty() 
    anio: string;
}
