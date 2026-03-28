import { Provider } from '@nestjs/common';
import { createPrismaClient, PRISMA, PRISMA_BASE } from './prisma.factory';
import { CryptoService } from '../crypto/crypto.service';
import { ClsService } from 'nestjs-cls';

// Зберігаємо результат щоб не створювати зайвих підключень
let prismaInstance: ReturnType<typeof createPrismaClient> | null = null;

function getPrismaInstance(cryptoService: CryptoService, cls: ClsService) {
  if (!prismaInstance) {
    prismaInstance = createPrismaClient(cryptoService, cls);
  }
  return prismaInstance;
}

export const PrismaProviders: Provider[] = [
  {
    provide: PRISMA,
    inject: [CryptoService, ClsService],
    useFactory: (cryptoService: CryptoService, cls: ClsService) =>
      getPrismaInstance(cryptoService, cls).client,
  },
  {
    provide: PRISMA_BASE,
    inject: [CryptoService, ClsService],
    useFactory: (cryptoService: CryptoService, cls: ClsService) =>
      getPrismaInstance(cryptoService, cls).baseClient,
  },
];
