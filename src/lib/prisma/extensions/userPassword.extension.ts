import { Prisma } from 'generated/prisma/client';
import { CryptoService } from 'src/lib/crypto/crypto.service';

export const userPasswordExtension = (cryptoService: CryptoService) =>
  Prisma.defineExtension({
    name: 'user-password-extension',
    query: {
      user: {
        async create({ args, query }) {
          if (typeof args.data.password === 'string') {
            args.data.password = await cryptoService.hashValue(
              args.data.password,
            );
          }
          return query(args);
        },

        async upsert({ args, query }) {
          console.log('extension is working');
          if (typeof args.create.password === 'string') {
            args.create.password = await cryptoService.hashValue(
              args.create.password,
            );
          }

          if (typeof args.update.password === 'string') {
            args.update.password = await cryptoService.hashValue(
              args.update.password,
            );
          }
          return query(args);
        },
      },
    },
  });
