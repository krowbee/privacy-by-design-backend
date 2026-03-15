import { Injectable } from '@nestjs/common';
import { SignInDto, SignUpDto } from './auth.dto';
@Injectable()
export class AuthService {
  async loginUser(data: SignInDto) {}

  async registerUser(data: SignUpDto) {}
}
