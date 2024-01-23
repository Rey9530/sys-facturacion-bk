import { ApiProperty } from "@nestjs/swagger"
import { IsNumber, IsString, MinLength, IsPositive, IsOptional } from 'class-validator';

export class CreateBloqueDto {


    @ApiProperty({})
    @IsString()
    @MinLength(2)
    autorizacion: string

    @ApiProperty({})
    @IsString()
    @MinLength(2)
    tira: string

    @ApiProperty({})
    @IsNumber()
    @IsPositive()
    desde: number

    @ApiProperty({})
    @IsNumber()
    @IsPositive()
    hasta: number

    @ApiProperty({})
    @IsNumber()
    @IsPositive()
    actual: number

    @ApiProperty({})
    @IsString()
    @MinLength(2)
    serie: string

    @ApiProperty({})
    @IsString()
    @IsOptional()
    resolucion: string


    @ApiProperty({})
    @IsNumber()
    @IsPositive()
    id_tipo_factura: number

}
