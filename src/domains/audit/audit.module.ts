import { forwardRef, Module } from '@nestjs/common';
import { AuditService } from './audit.service';
import { CryptoModule } from 'src/lib/crypto/crypto.module';
import { AuditController } from './audit.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [CryptoModule, forwardRef(() => AuthModule)],
  providers: [AuditService],
  controllers: [AuditController],
  exports: [AuditService],
})
export class AuditModule {}
