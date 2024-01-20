import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsOptional, IsString } from "class-validator";

export class CreateAgendaDto {


    @ApiProperty({ example: 'Alfonso' })
    @IsString()
    nombre: string;


    @ApiProperty({ example: '1' })
    @IsInt()
    id_sucursal: number;

    @ApiProperty({ example: 'Segunda Planta' })
    @IsString()
    zona: string;


    @ApiProperty({ example: '1' })
    @IsString()
    no_personas: string;

    @ApiProperty({ example: 'DESAYUNO' })
    @IsString()
    turno: string;

    @ApiProperty({ example: '6056-5689' })
    @IsString()
    telefono: string;


    @ApiProperty()
    @IsString()
    date: string;

    @ApiProperty()
    @IsString()
    start: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    nota: string;
}
