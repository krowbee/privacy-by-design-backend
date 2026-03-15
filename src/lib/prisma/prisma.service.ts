import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from 'generated/prisma/client';
import { CryptoService } from '../crypto/crypto.service';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor(private cryptoService: CryptoService) {
    const adapter: PrismaPg = new PrismaPg({
      connectionString: process.env.DATABASE_URL,
    });

    super({ adapter });
    this.$extends({
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
        },
      },
    });
  }
  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
