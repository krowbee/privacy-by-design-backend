import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { CryptoModule } from '../crypto/crypto.module';
import { PrismaProvider } from './prisma.provider';

@Global()
@Module({
  imports: [CryptoModule],
  providers: [PrismaService, PrismaProvider],
  exports: [PrismaService],
})
export class PrismaModule {}
