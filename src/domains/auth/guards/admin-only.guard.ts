import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from '../auth.service';
import { Request } from 'express';
import { ActorType } from 'generated/prisma/enums';

export class AdminOnlyGuard implements CanActivate {
  constructor(private authService: AuthService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();
    const accessToken = req.cookies?.accessToken as string | undefined;

    if (!accessToken) throw new UnauthorizedException();

    const payload = await this.authService.verifyAccessToken(accessToken);

    if (!payload) throw new UnauthorizedException('Invalid or expired token');

    if (payload.role !== ActorType.ADMIN && payload.role !== ActorType.SYSTEM) {
      throw new ForbiddenException("You don't have access to this resource");
    }

    return true;
  }
}
