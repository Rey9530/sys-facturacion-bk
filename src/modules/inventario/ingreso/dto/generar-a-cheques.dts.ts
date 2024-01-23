import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsInt, IsOptional, IsPositive } from "class-validator";


export class GenerarAChequeDTS {

    @ApiProperty({ example: '1' })
    @IsInt()
    @IsPositive()
    @IsOptional()
    id_sucursal: number;

    @ApiProperty({})
    @IsArray()
    idsProveedores: []
}