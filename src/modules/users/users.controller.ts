import { Controller, Get, Post, Body, Param, Delete, ParseUUIDPipe, Put, } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { Auth, GetUser } from 'src/modules/auth/decorators';
import { CreateUserDto, UpdateUserDto } from './dto';
import { hos_usr_usuario } from '@prisma/client';
import { HEADER_API_BEARER_AUTH } from 'src/common/const';
import { PasswordUserDto } from '../auth/dto/password-user.dto';


@ApiTags('Users')
@Controller('v1/users')
@Auth()
@ApiBearerAuth(HEADER_API_BEARER_AUTH)
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post()
  create(
    @Body() createUserDto: CreateUserDto,
    @GetUser() user: hos_usr_usuario
  ) {
    return this.usersService.create(createUserDto, user);
  }

  @Post("update/password")
  updatePassword(
    @Body() passwordUserDto: PasswordUserDto,
    @GetUser() user: hos_usr_usuario
  ) {
    return this.usersService.updatePassword(passwordUserDto, user);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.findOne(`${id}`);
  }

  @Put(':id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateUserDto: UpdateUserDto,
    @GetUser() user: hos_usr_usuario) {
    return this.usersService.update(`${id}`, updateUserDto, user);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.remove(`${id}`);
  }
}
