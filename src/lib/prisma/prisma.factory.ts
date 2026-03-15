import { PrismaPg } from '@prisma/adapter-pg';
import { CryptoService } from '../crypto/crypto.service';
import { PrismaClient } from 'generated/prisma/client';
import { userPasswordExtension } from './extensions/userPassword.extension';

export function createPrismaClient(cryptoService: CryptoService) {
  const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL,
  });
  const prisma = new PrismaClient({ adapter });
  return prisma.$extends(userPasswordExtension(cryptoService));
}

export type ExtendedPrismaClient = ReturnType<typeof createPrismaClient>;
export const PRISMA = 'PRISMA';
