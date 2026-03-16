import { Body, Controller, HttpCode, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto, SignUpDto } from './types/auth.dto';
import type { Request, Response } from 'express';
import { accessCookieOptions } from './constants/cookie.constants';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Authorization')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({
    summary: 'Register',
    description: 'Register new user',
  })
  @ApiBody({ type: SignUpDto })
  @HttpCode(201)
  @Post('/register')
  async register(
    @Res({ passthrough: true }) res: Response,
    @Body() data: SignUpDto,
  ) {
    const { accessToken, user } = await this.authService.registerUser(data);
    res.cookie('accessToken', accessToken, accessCookieOptions);
    return { user };
  }
  @ApiOperation({
    summary: 'Login',
    description: 'Login user',
  })
  @ApiBody({ type: SignUpDto })
  @HttpCode(200)
  @Post('/login')
  async login(
    @Res({ passthrough: true }) res: Response,
    @Body() data: SignInDto,
  ) {
    const { user, accessToken } = await this.authService.loginUser(data);
    res.cookie('accessToken', accessToken, accessCookieOptions);
    return { user };
  }
}
