import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsOptional, IsPositive, IsString, MinLength } from "class-validator";

export class CreateUserDto {

    @ApiProperty({
        description: 'Codigo de usuario (unique)',
        nullable: false,
        minLength: 6
    })
    @IsString()
    @MinLength(6)
    usuario: string;

    @ApiProperty({})
    @IsString()
    @MinLength(1)
    nombres: string;

    @ApiProperty({})
    @IsString()
    @MinLength(1)
    apellidos: string;

    @ApiProperty({})
    @IsString()
    @MinLength(8)
    dui: string;

    @ApiProperty({})
    @IsInt()
    @IsPositive()
    id_rol: number;

    @ApiProperty({})
    @IsInt()
    @IsPositive()
    id_sucursal: number;

    @ApiProperty({})
    @IsInt()
    @IsPositive()
    @IsOptional()
    id_sucursal_reser: number;

}
