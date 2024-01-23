import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsOptional, IsPositive, IsString } from "class-validator";

export class PaginationClienteDto {


    @ApiProperty({})
    @IsPositive()
    @IsOptional()
    pagina: number;
    
    @ApiProperty({})
    @IsPositive()
    @IsOptional()
    registrosXpagina: number;

    @ApiProperty({})
    @IsString()
    @IsOptional()
    query: string;
 
}
