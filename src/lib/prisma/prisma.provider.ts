import { Provider } from '@nestjs/common';
import { createPrismaClient, PRISMA } from './prisma.factory';
import { CryptoService } from '../crypto/crypto.service';

export const PrismaProvider: Provider = {
  provide: PRISMA,
  inject: [CryptoService],
  useFactory: (cryptoService: CryptoService) =>
    createPrismaClient(cryptoService),
};
