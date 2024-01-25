import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsOptional, IsString } from "class-validator";

// ,,
export enum Turnos {
    '' = '',
    ALMUERZO = 'ALMUERZO',
    CENA = 'CENA',
    DESAYUNO = 'DESAYUNO',
}

export class GetAgendaDto {

    @ApiProperty()
    @IsEnum(Turnos)
    @IsOptional()
    turno: Turnos;


    @ApiProperty({ example: '1' })
    @IsString()
    @IsOptional()
    id_sucursal: string;
}