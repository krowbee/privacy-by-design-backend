import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PublicUserDto, SignInDto, SignUpDto } from './types/auth.dto';
import { PrismaService } from 'src/lib/prisma/prisma.service';
import { CryptoService } from '../../lib/crypto/crypto.service';
import { JwtService } from '@nestjs/jwt';
import { TokenPayload } from './types/payload';
import { accessTokenOptions } from './constants/token.constants';
import { toDto } from 'src/lib/transform';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private cryptoService: CryptoService,
    private jwtService: JwtService,
  ) {}

  private async generateToken(payload: TokenPayload) {
    const accessToken = await this.jwtService.signAsync(
      payload,
      accessTokenOptions,
    );
    return { accessToken };
  }

  async loginUser(data: SignInDto) {
    const isExists = await this.prismaService.client.user.findUnique({
      where: { email: data.email },
    });

    if (!isExists) throw new UnauthorizedException('Invalid credentials');
    const isValid = await this.cryptoService.compareValue(
      data.password,
      isExists.password,
    );

    if (!isValid) throw new UnauthorizedException('Invalid credentials');
    const { accessToken } = await this.generateToken({
      id: isExists.id,
      email: isExists.email,
    });

    const user = toDto(PublicUserDto, isExists);

    return { user, accessToken };
  }

  async registerUser(data: SignUpDto) {
    const isExists = await this.prismaService.client.user.findUnique({
      where: { email: data.email },
    });
    if (isExists) throw new ForbiddenException('User already exists');
    const newUser = await this.prismaService.client.user.create({ data });
    const { accessToken } = await this.generateToken({
      id: newUser.id,
      email: newUser.email,
    });
    const user = toDto(PublicUserDto, newUser);
    return { user, accessToken };
  }
}
