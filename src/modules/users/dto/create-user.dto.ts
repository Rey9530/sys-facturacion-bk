import { ApiProperty } from "@nestjs/swagger";
import { IsString, MinLength } from "class-validator";

export class CreateUserDto {

    @ApiProperty({
        description: 'Codigo de usuario (unique)',
        nullable: false,
        minLength: 6
    })
    @IsString()
    @MinLength(6)
    usr_code: string;

    @ApiProperty({})
    @IsString()
    @MinLength(1)
    usr_names: string;
    

    @ApiProperty({})
    @IsString()
    @MinLength(1)
    usr_surnames: string;


    @ApiProperty({})
    @IsString()
    @MinLength(8)
    usr_password: string;

}
