import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsOptional, IsPositive, IsString } from "class-validator";

export class PaginationIngresoDto {


    @ApiProperty({})
    @IsString()
    @IsOptional()
    pagina: number;
    
    @ApiProperty({})
    @IsString()
    @IsOptional()
    registrosXpagina: number;

    @ApiProperty({})
    @IsString()
    @IsOptional()
    query: string;


    @ApiProperty({ example: '1' }) 
    @IsOptional()
    sucursal: number;


    @ApiProperty({ example: '1' }) 
    @IsOptional()
    bodega: number;
}
