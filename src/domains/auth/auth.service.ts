import { Injectable } from '@nestjs/common';
import { SignInDto, SignUpDto } from './auth.dto';
import { PrismaService } from 'src/lib/prisma/prisma.service';
@Injectable()
export class AuthService {
  constructor(private prismaService: PrismaService) {}
  async loginUser(data: SignInDto) {}

  async registerUser(data: SignUpDto) {}
}
