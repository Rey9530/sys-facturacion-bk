import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsOptional, IsPositive, IsString, MinLength } from "class-validator";

export class BuscarCatalogoDto { 


    @ApiProperty({ example: '1' })
    @IsInt()
    @IsPositive()
    @IsOptional()
    id_bodega: number;

    @ApiProperty({ example: 'Demo' })
    @IsString() 
    query: string;
}