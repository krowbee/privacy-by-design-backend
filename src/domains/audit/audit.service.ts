import { Injectable, Logger } from '@nestjs/common';
import { AuditPayload, CreateAuditData, Metadata } from './audit.payload';
import { PrismaService } from 'src/lib/prisma/prisma.service';
import { ClsService } from 'nestjs-cls';
import { EventActions } from 'generated/prisma/enums';

const METHOD_TO_ACTION: Record<string, EventActions> = {
  GET: EventActions.READ,
  POST: EventActions.CREATE,
  PATCH: EventActions.UPDATE,
  DELETE: EventActions.DELETE,
};

@Injectable()
export class AuditService {
  private readonly logger = new Logger(AuditService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly cls: ClsService,
  ) {}

  async log(data: AuditPayload): Promise<void> {
    try {
      const createData = this.buildPayload(data);
      await this.prisma.client.auditEvent.create({ data: createData });
      this.logger.debug(
        `Audit logged: ${createData.category} ${createData.action}`,
      );
      this.logger.debug('Audit details:', createData);
    } catch (err) {
      this.logger.error('Failed to create audit log', err);
    }
  }

  private buildPayload(data: AuditPayload): CreateAuditData {
    return {
      ...data,
      ip: this.cls.get<string>('ip'),
      actorId: this.cls.get<string>('actorId'),
      actorType: this.cls.get('actorType'),
      action: this.resolveAction(data.action),
      metadata: this.buildMetadata(data.metadata),
    };
  }

  private resolveAction(action?: EventActions): EventActions {
    if (action) return action;
    const method = this.cls.get<string>('method');
    return METHOD_TO_ACTION[method] ?? EventActions.READ;
  }

  private buildMetadata(extra?: Metadata): Metadata {
    return {
      ...(extra ?? {}),
      method: this.cls.get<string>('method'),
      path: this.cls.get<string>('path'),
      userAgent: this.cls.get<string>('userAgent'),
      requestId: this.cls.getId(),
    };
  }
}
