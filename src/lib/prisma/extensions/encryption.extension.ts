/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
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
    model: {
      profile: {
        async $allOperations({ args, query }) {
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
            if (Array.isArray(result)) {
              return result.map((item) => {
                for (const key of Object.keys(item)) {
                  if (ENCRYPTION_FIELDS.has(key) && args.data[key]) {
                    item[key] = cryptoService.decryptField(item[key]);
                  }
                }
                return item;
              });
            }
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
