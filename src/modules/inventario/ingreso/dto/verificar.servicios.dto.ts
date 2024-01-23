import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsPositive, IsString, MinLength } from "class-validator";

export class VerificarServicioDto {

    @ApiProperty({ example: '1' })
    @IsInt()
    @IsPositive()
    id_proveedor: number;


    @ApiProperty({ example: '654' })
    @IsString() 
    numero_factura: string;
}