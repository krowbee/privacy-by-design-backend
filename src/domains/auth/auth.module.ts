import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { CryptoModule } from 'src/lib/crypto/crypto.module';
import { AuthController } from './auth.controller';
import { AuditModule } from '../audit/audit.module';
import { ConsentModule } from '../consent/consent.module';

@Module({
  imports: [JwtModule.register({}), CryptoModule, AuditModule, ConsentModule],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
