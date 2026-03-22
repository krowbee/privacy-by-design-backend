import { Injectable } from '@nestjs/common';
import { PrismaClient } from 'generated/prisma/client';

@Injectable()
export class AuditService {
  constructor(private prisma: PrismaClient) {}

  async log() {}
}
