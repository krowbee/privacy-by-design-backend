import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from '../auth.service';
import { AuditService } from '../../audit/audit.service';
import { ClsService } from 'nestjs-cls';
import { EventCategories, EventStatus } from 'generated/prisma/enums';

@Injectable()
export class AuthOnlyGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private auditService: AuditService,
    private cls: ClsService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const req = context.switchToHttp().getRequest<Request>();
      const accessToken = req.cookies?.accessToken as string | undefined;

      if (!accessToken) throw new UnauthorizedException();

      const payload = await this.authService.verifyAccessToken(accessToken);

      if (!payload) throw new UnauthorizedException('Invalid access token');

      this.cls.set('actorId', payload.id);
      this.cls.set('actorType', payload.role);

      req['user'] = payload;
      return true;
    } catch (err) {
      await this.auditService.log({
        status: EventStatus.FAILURE,
        category: EventCategories.SECURITY,
      });
      throw err;
    }
  }
}
