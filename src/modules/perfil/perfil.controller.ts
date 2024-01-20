import { Controller, Get, Post, Body, Patch, Param, Put } from '@nestjs/common';
import { PerfilService } from './perfil.service';
import { UpdatePerfilDto } from './dto/update-perfil.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Auth, GetUser } from '../auth/decorators';
import { HEADER_API_BEARER_AUTH } from 'src/common/const';
import { Usuarios } from '@prisma/client';
import { UpdatePasswordDto } from './dto/update-password-perfil.dto';


@ApiTags('Perfil')
@Controller('perfil')
@Auth()
@ApiBearerAuth(HEADER_API_BEARER_AUTH)
export class PerfilController {
  constructor(private readonly perfilService: PerfilService) { }

  @Get()
  getUsuario(
    @GetUser() user: Usuarios
  ) {
    return this.perfilService.getUsuario(user.id);
  }

  @Put()
  update(
    @Body() updatePerfilDto: UpdatePerfilDto,
    @GetUser() user: Usuarios
  ) {
    return this.perfilService.update(user.id, updatePerfilDto);
  }
  @Put('/actualizar_clave')
  updatePassword(@GetUser() user: Usuarios, @Body() updatePerfilDto: UpdatePasswordDto) {
    return this.perfilService.updatePassword(user.id, updatePerfilDto);
  }


}
