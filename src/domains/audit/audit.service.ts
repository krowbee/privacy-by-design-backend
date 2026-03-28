import { Injectable } from '@nestjs/common';
import { AuditPayload, CreateAuditData, Metadata } from './audit.payload';
import { PrismaService } from 'src/lib/prisma/prisma.service';
import { ClsService } from 'nestjs-cls';
import { EventActions } from 'generated/prisma/enums';
import { Logger } from '@nestjs/common';

const METHOD_TO_ACTION = {
  GET: EventActions.READ,
  POST: EventActions.CREATE,
  PATCH: EventActions.UPDATE,
  DELETE: EventActions.DELETE,
};
@Injectable()
export class AuditService {
  private readonly logger = new Logger(AuditService.name);
  constructor(
    private prisma: PrismaService,
    private cls: ClsService,
  ) {}

  async log(data: AuditPayload): Promise<void> {
    try {
      const createData = this.generatePayload(data);
      await this.prisma.client.auditEvent.create({
        data: createData,
      });
      console.log('LOGGED:', createData);
    } catch (err) {
      this.logger.error('Failed to create audit log:', err);
    }
  }

  private generateMetadata(metadata: Metadata | undefined): Metadata {
    return {
      ...(metadata ?? {}),
      method: this.cls.get<string>('method'),
      path: this.cls.get<string>('path'),
      userAgent: this.cls.get<string>('userAgent'),
      requestId: this.cls.getId(),
    };
  }

  private chooseAction(action: EventActions | undefined): EventActions {
    const method = this.cls.get<string>('method');
    return (
      action ??
      (method && method in METHOD_TO_ACTION
        ? METHOD_TO_ACTION[method as keyof typeof METHOD_TO_ACTION]
        : EventActions.READ)
    );
  }

  private generatePayload(data: AuditPayload): CreateAuditData {
    const action = this.chooseAction(data.action);
    const metadata = this.generateMetadata(data.metadata);

    const createData: CreateAuditData = {
      ip: this.cls.get('ip'),
      actorId: this.cls.get('actorId'),
      actorType: this.cls.get('actorType'),
      metadata,
      action: action,
      status: data.status,
      entity: data.entity,
      entityId: data.entityId,
    };

    return createData;
  }
}
