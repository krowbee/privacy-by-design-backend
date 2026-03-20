import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { CryptoModule } from 'src/lib/crypto/crypto.module';
import { AuthController } from './auth.controller';

@Module({
  imports: [JwtModule.register({}), CryptoModule],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
