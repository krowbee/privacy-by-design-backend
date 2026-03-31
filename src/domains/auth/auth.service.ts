import {
  ForbiddenException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { PublicUserDto, SignInDto, SignUpDto } from './types/auth.dto';
import { PrismaService } from 'src/lib/prisma/prisma.service';
import { CryptoService } from '../../lib/crypto/crypto.service';
import { JwtService } from '@nestjs/jwt';
import { TokenPayload } from './types/payload';
import { accessTokenOptions } from './constants/token.constants';
import { toDto } from 'src/lib/transform';
import { AuditService } from '../audit/audit.service';
import {
  EventActions,
  EventCategories,
  EventStatus,
} from 'generated/prisma/enums';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private prismaService: PrismaService,
    private cryptoService: CryptoService,
    private jwtService: JwtService,
    private auditService: AuditService,
  ) {}

  private buildSecurityPayload(
    action: EventActions,
    status: EventStatus,
    entityId: string | null,
    error?: unknown,
  ) {
    return {
      category: EventCategories.SECURITY,
      action,
      status,
      entity: 'User',
      entitySelector: { userId: entityId ? entityId : null },
      metadata:
        error && typeof error === 'object'
          ? {
              error: (error as Error).message,
            }
          : {},
    };
  }

  private async generateToken(payload: TokenPayload) {
    const accessToken = await this.jwtService.signAsync(
      payload,
      accessTokenOptions,
    );
    return { accessToken };
  }

  async verifyAccessToken(accessToken: string): Promise<TokenPayload> {
    const payload: TokenPayload = await this.jwtService.verifyAsync(
      accessToken,
      {
        secret: accessTokenOptions.secret,
      },
    );
    return payload;
  }

  async loginUser(data: SignInDto) {
    const isExists = await this.prismaService.client.user.findUnique({
      where: { email: data.email },
    });
    try {
      if (!isExists) throw new UnauthorizedException('Invalid credentials');
      const isValid = await this.cryptoService.compareValue(
        data.password,
        isExists.password,
      );

      if (!isValid) throw new UnauthorizedException('Invalid credentials');
      const { accessToken } = await this.generateToken({
        id: isExists.id,
        email: isExists.email,
        role: isExists.role,
      });

      const user = toDto(PublicUserDto, isExists);
      this.auditService
        .log(
          this.buildSecurityPayload(
            EventActions.LOGIN,
            EventStatus.SUCCESS,
            isExists.id,
          ),
        )
        .catch((err) => this.logger.error('Audit log failed', err));
      return { user, accessToken };
    } catch (err) {
      this.auditService
        .log(
          this.buildSecurityPayload(
            EventActions.LOGIN,
            EventStatus.FAILURE,
            isExists?.id ?? null,
            err,
          ),
        )
        .catch((err) => this.logger.error('Audit log failed', err));
      throw err;
    }
  }

  async registerUser(data: SignUpDto) {
    const isExists = await this.prismaService.client.user.findUnique({
      where: { email: data.email },
    });
    try {
      if (isExists) throw new ForbiddenException('User already exists');
      const hashedPassword = await this.cryptoService.hashValue(data.password);
      const newUser = await this.prismaService.client.user.create({
        data: { ...data, password: hashedPassword },
      });
      const { accessToken } = await this.generateToken({
        id: newUser.id,
        email: newUser.email,
        role: newUser.role,
      });
      const user = toDto(PublicUserDto, newUser);
      this.auditService
        .log(
          this.buildSecurityPayload(
            EventActions.REGISTER,
            EventStatus.SUCCESS,
            user.id,
          ),
        )
        .catch((err) => this.logger.error('Audit log failed', err));
      return { user, accessToken };
    } catch (err) {
      this.auditService
        .log(
          this.buildSecurityPayload(
            EventActions.LOGIN,
            EventStatus.FAILURE,
            isExists?.id ?? null,
            err,
          ),
        )
        .catch((err) => this.logger.error('Audit log failed', err));
      throw err;
    }
  }
}
