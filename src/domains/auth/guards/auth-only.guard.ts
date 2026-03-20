import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from '../auth.service';

@Injectable()
export class AuthOnlyGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();
    const accessToken = req.cookies?.accessToken as string | undefined;

    if (!accessToken) throw new UnauthorizedException();

    const payload = await this.authService.verifyAccessToken(accessToken);

    if (!payload) throw new UnauthorizedException('Invalid access token');

    req['user'] = payload;
    return true;
  }
}
