import { ApiProperty } from "@nestjs/swagger";
import { IsArray } from "class-validator";


export class comprasAChequeDTS {


    @ApiProperty({})
    @IsArray()
    idsCompras: []
}