import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto'; 
import { Auth, GetUser } from './decorators';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { HEADER_API_BEARER_AUTH } from 'src/common/const';
import { Usuarios } from '@prisma/client';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }


  @Post('sign-in')
  loginUser(@Body() loginUserDto: CreateAuthDto) {
    return this.authService.login(loginUserDto);
  }


  @Post('sign-in-with-token')
  @Auth()
  @ApiBearerAuth(HEADER_API_BEARER_AUTH)
  checkStatus(@GetUser() user: Usuarios) {
    return this.authService.checkStatus(user);
  }
}
