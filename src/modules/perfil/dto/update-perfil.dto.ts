import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MinLength } from 'class-validator';

export class UpdatePerfilDto {

    @ApiProperty({})
    @IsString()
    @MinLength(4)
    nombres: string;

    @ApiProperty({})
    @IsString()
    @MinLength(4)
    apellidos: string;

    @ApiProperty({})
    @IsString()
    @IsOptional()
    @MinLength(4)
    dui: string;
}
