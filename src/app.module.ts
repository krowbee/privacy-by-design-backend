import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersController } from './domains/user/user.controller';
import { UsersService } from './domains/user/user.service';
import { UsersModule } from './domains/user/user.module';
import { AuthController } from './domains/auth/auth.controller';
import { AuthService } from './domains/auth/auth.service';
import { AuthModule } from './domains/auth/auth.module';
import { PrismaModule } from './lib/prisma/prisma.module';
import { PrismaService } from './lib/prisma/prisma.service';

@Module({
  imports: [UsersModule, AuthModule, PrismaModule],
  controllers: [AppController, UsersController, AuthController],
  providers: [AppService, UsersService, AuthService, PrismaService],
})
export class AppModule {}
