import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, Matches } from 'class-validator';
import { FORMAT_FECHA_YYYY_MM_DD } from 'src/common/const';

export class ComprasContadoDto {

    @ApiProperty({ example: '2024-01-01' })
    @IsString()
    @Matches(FORMAT_FECHA_YYYY_MM_DD, {
        message: 'La fecha desde es incorrecta debe ser 2024-01-01',
    })
    fecha: string;

    @ApiProperty({ example: '1' })
    @IsString()
    @IsOptional() 
    id_sucursal: string;

}
