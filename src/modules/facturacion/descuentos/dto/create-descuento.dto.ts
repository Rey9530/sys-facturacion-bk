import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNumber, IsOptional, IsPositive, IsString, MinLength } from "class-validator";

export enum Position {
    ITEM = 'ITEM',
    GLOBAL = 'GLOBAL',
    AMBOS = 'AMBOS',
    INACTIVO = 'INACTIVO',
}
// nombre = "", porcentaje = 0, isItem
export class CreateDescuentoDto {

    @ApiProperty({})
    @IsString()
    @MinLength(2)
    nombre: string;

    @ApiProperty({})
    @IsNumber()
    @IsPositive()
    porcentaje: number;
 
    @ApiProperty({})
    @IsEnum(Position)
    @IsOptional()
    isItem: Position;

}
