import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersController } from './domains/users/users.controller';
import { UsersService } from './domains/users/users.service';
import { UsersModule } from './domains/users/users.module';
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
