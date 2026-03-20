/* eslint-disable @typescript-eslint/no-unsafe-argument */

import { Prisma } from 'generated/prisma/client';
import { CryptoService } from 'src/lib/crypto/crypto.service';

const ENCRYPTION_FIELDS = new Set([
  'firstName',
  'lastName',
  'passportNumber',
  'address',
]);

/* TODO: FIX TYPESCRIPT PROBLEMS */
export const encryptionExtension = (cryptoService: CryptoService) =>
  Prisma.defineExtension({
    name: 'encryption',
    query: {
      profile: {
        async create({ args, query }) {
          try {
            if (args.data) {
              for (const key of Object.keys(args.data)) {
                if (ENCRYPTION_FIELDS.has(key) && args.data[key]) {
                  args.data[key] = cryptoService.encryptField(args.data[key]);
                }
              }
            }
            const result = await query(args);
            if (!result) return result;

            for (const key of Object.keys(result)) {
              if (ENCRYPTION_FIELDS.has(key) && result[key]) {
                result[key] = cryptoService.decryptField(result[key]);
              }
            }
            return result;
          } catch {
            throw new Error('Decryption failed');
          }
        },

        async update({ args, query }) {
          try {
            if (args.data) {
              for (const key of Object.keys(args.data)) {
                if (ENCRYPTION_FIELDS.has(key) && args.data[key]) {
                  args.data[key] = cryptoService.encryptField(args.data[key]);
                }
              }
            }
            const result = await query(args);
            if (!result) return result;

            for (const key of Object.keys(result)) {
              if (ENCRYPTION_FIELDS.has(key) && result[key]) {
                result[key] = cryptoService.decryptField(result[key]);
              }
            }
            return result;
          } catch {
            throw new Error('Decryption failed');
          }
        },

        async findUnique({ args, query }) {
          try {
            const result = await query(args);
            if (!result) return result;

            for (const key of Object.keys(result)) {
              if (ENCRYPTION_FIELDS.has(key) && result[key]) {
                result[key] = cryptoService.decryptField(result[key]);
              }
            }
            return result;
          } catch {
            throw new Error('Decryption failed');
          }
        },
      },
    },
  });
