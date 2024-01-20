import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsPositive } from "class-validator";

export class ConsumidorFinalDto {

    @ApiProperty({})
    @IsInt()
    @IsPositive()
    mes: number;


    @ApiProperty({})
    @IsInt()
    @IsPositive()
    anio: number;
}
