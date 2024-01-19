import { Controller, Get, Post, Body, Param, Delete, ParseUUIDPipe, Put, ParseIntPipe, } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { Auth, GetUser } from 'src/modules/auth/decorators';
import { CreateUserDto, UpdateUserDto } from './dto';
import { Usuarios } from '@prisma/client';
import { HEADER_API_BEARER_AUTH } from 'src/common/const';
import { PasswordUserDto } from '../auth/dto/password-user.dto';


@ApiTags('Usuarios')
@Controller('usuarios')
@Auth()
@ApiBearerAuth(HEADER_API_BEARER_AUTH)
export class UsersController {
  constructor(private readonly usersService: UsersService) { }


  @Get()
  findAll() {
    return this.usersService.findAll();
  }
  @Get("obtener/roles")
  obtenerRoles() {
    return this.usersService.obtenerRoles();
  }


  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne(id);
  }



  @Post()
  create(
    @Body() createUserDto: CreateUserDto,
    @GetUser() user: Usuarios
  ) {
    return this.usersService.create(createUserDto, user);
  }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateUserDto: UpdateUserDto,
    @GetUser() user: Usuarios) {
    return this.usersService.update(id, updateUserDto, user);
  }



  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.remove(id);
  }
}
