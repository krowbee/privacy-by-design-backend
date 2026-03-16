import { Body, Controller, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto, SignUpDto } from './types/auth.dto';
import type { Response } from 'express';
import { accessCookieOptions } from './constants/cookie.constants';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/register')
  async register(
    @Res({ passthrough: true }) res: Response,
    @Body() data: SignUpDto,
  ) {
    const { accessToken, user } = await this.authService.registerUser(data);
    res.cookie('accessToken', accessToken, accessCookieOptions);
    return { user };
  }

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
