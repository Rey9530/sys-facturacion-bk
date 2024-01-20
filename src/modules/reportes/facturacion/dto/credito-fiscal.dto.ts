import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches } from 'class-validator';
import { FORMAT_FECHA_YYYY_MM_DD } from 'src/common/const';

export class CreditoFiscalDto {


    @ApiProperty({ example: '19-08-1998' })
    @IsString()
    @Matches(FORMAT_FECHA_YYYY_MM_DD, {
        message: 'La fecha desde es incorrecta debe ser  dd-mm-YYYY',
    })
    desde: string;

    @ApiProperty({ example: '19-08-1998' })
    @IsString()
    @Matches(FORMAT_FECHA_YYYY_MM_DD, {
        message: 'La fecha hasta es incorrecta debe ser  dd-mm-YYYY',
    })
    hasta: string;
}
