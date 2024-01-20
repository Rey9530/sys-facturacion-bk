import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches } from 'class-validator';
import { FORMAT_FECHA_YYYY_MM_DD } from 'src/common/const';

export class EstadisticasDto {


    @ApiProperty({ example: '2024-01-01' })
    @IsString()
    @Matches(FORMAT_FECHA_YYYY_MM_DD, {
        message: 'La fecha desde es incorrecta debe ser  YYYY-mm-dd',
    })
    desde: string;

    @ApiProperty({ example: '2024-01-31' })
    @IsString()
    @Matches(FORMAT_FECHA_YYYY_MM_DD, {
        message: 'La fecha hasta es incorrecta debe ser  YYYY-mm-dd',
    })
    hasta: string;
}
