import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './domains/auth/auth.module';
import { PrismaModule } from './lib/prisma/prisma.module';
import { ProfileModule } from './domains/profile/profile.module';
import { ClsModule } from 'nestjs-cls';
import { randomUUID } from 'crypto';
import { Request } from 'express';
import { ThrottlerModule } from '@nestjs/throttler';
import { ConsentModule } from './domains/consent/consent.module';

@Module({
  imports: [
    AuthModule,
    PrismaModule,
    ProfileModule,
    ConsentModule,
    ThrottlerModule.forRoot({
      errorMessage: 'Too many requests',
      throttlers: [
        {
          name: 'login_short',
          ttl: 60000,
          limit: 3,
        },
        {
          name: 'login_long',
          ttl: 15 * 60000,
          limit: 5,
        },
      ],
    }),
    ClsModule.forRoot({
      global: true,
      middleware: {
        mount: true,
        generateId: true,
        idGenerator: (req: Request) =>
          (req.headers['x-request-id'] as string) || randomUUID(),
        setup: (cls, req: Request) => {
          cls.set('ip', req.ip);
          cls.set('method', req.method);
          cls.set('path', req.originalUrl);
          cls.set('userAgent', req.headers['user-agent']);
        },
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
