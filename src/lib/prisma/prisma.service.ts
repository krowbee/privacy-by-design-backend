import {
  Inject,
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { PRISMA, PRISMA_BASE } from './prisma.factory';
import type { ExtendedPrismaClient } from './prisma.factory';
import { PrismaClient } from 'generated/prisma/client';

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  constructor(
    @Inject(PRISMA) public readonly client: ExtendedPrismaClient,
    @Inject(PRISMA_BASE) public readonly baseClient: PrismaClient,
  ) {}
  async onModuleInit() {
    await this.client.$connect();
    await this.baseClient.$connect();
  }

  async onModuleDestroy() {
    await this.client.$disconnect();
    await this.baseClient.$disconnect();
  }
}
