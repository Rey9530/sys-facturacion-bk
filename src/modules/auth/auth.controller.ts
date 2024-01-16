import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto'; 
import { Auth, GetUser } from './decorators';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { HEADER_API_BEARER_AUTH } from 'src/common/const';
import { hos_usr_usuario } from '@prisma/client';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }


  @Post('login')
  loginUser(@Body() loginUserDto: CreateAuthDto) {
    return this.authService.login(loginUserDto);
  }


  @Get('check-status')
  @Auth()
  @ApiBearerAuth(HEADER_API_BEARER_AUTH)
  checkStatus(@GetUser() user: hos_usr_usuario) {
    return this.authService.checkStatus(user);
  }
}
