import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { CryptoModule } from '../crypto/crypto.module';
import { PrismaProviders } from './prisma.provider';

@Global()
@Module({
  imports: [CryptoModule],
  providers: [...PrismaProviders, PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
