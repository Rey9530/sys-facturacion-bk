import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsOptional, IsPositive, IsString } from "class-validator";

export class PaginationProveedoresDto {


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
 
}