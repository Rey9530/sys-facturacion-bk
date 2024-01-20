import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class PaginationCatalogoDto {


    @ApiProperty({})
    @IsString()
    @IsOptional()
    pagina: string;
    
    @ApiProperty({})
    @IsString()
    @IsOptional()
    registrosXpagina: string;

    @ApiProperty({})
    @IsString()
    @IsOptional()
    query: string
}
