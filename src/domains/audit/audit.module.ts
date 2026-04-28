import { Module } from '@nestjs/common';
import { AuditService } from './audit.service';
import { CryptoModule } from 'src/lib/crypto/crypto.module';

@Module({
  imports: [CryptoModule],
  providers: [AuditService],
  exports: [AuditService],
})
export class AuditModule {}
