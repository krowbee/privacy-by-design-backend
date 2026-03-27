import { Injectable } from '@nestjs/common';
import { AuditPayload } from './audit.payload';
import { PrismaService } from 'src/lib/prisma/prisma.service';

@Injectable()
export class AuditService {
  constructor(private prisma: PrismaService) {}

  async log(payload: AuditPayload) {
    const log = this.prisma.client.auditEvent.create({ data: payload });
  }
}
