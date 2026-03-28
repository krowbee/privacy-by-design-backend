import { PrismaPg } from '@prisma/adapter-pg';
import { CryptoService } from '../crypto/crypto.service';
import { PrismaClient } from 'generated/prisma/client';
import { encryptionExtension } from './extensions/encryption.extension';
import { ClsService } from 'nestjs-cls';
import { auditExtension } from './extensions/audit.extension';

function createBaseClient() {
  const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL,
  });
  return new PrismaClient({ adapter });
}

export function createPrismaClient(
  cryptoService: CryptoService,
  cls: ClsService,
) {
  const baseClient = createBaseClient();
  const client = createBaseClient()
    .$extends(encryptionExtension(cryptoService))
    .$extends(auditExtension(cls, baseClient));
  return { client, baseClient };
}

export type ExtendedPrismaClient = ReturnType<
  typeof createPrismaClient
>['client'];
export const PRISMA = 'PRISMA';
export const PRISMA_BASE = 'PRISMA_BASE';
