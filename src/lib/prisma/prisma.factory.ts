import { PrismaPg } from '@prisma/adapter-pg';
import { CryptoService } from '../crypto/crypto.service';
import { PrismaClient } from 'generated/prisma/client';
import { encryptionExtension } from './extensions/encryption.extension';

export function createPrismaClient(cryptoService: CryptoService) {
  const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL,
  });
  const prisma = new PrismaClient({ adapter });
  return prisma.$extends(encryptionExtension(cryptoService));
}

export type ExtendedPrismaClient = ReturnType<typeof createPrismaClient>;
export const PRISMA = 'PRISMA';
