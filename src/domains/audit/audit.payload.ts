import { PickType } from '@nestjs/swagger';
import { Prisma } from 'generated/prisma/browser';
import { ActorType, EventActions, EventStatus } from 'generated/prisma/client';

export class CreateAuditData {
  metadata?: Metadata;
  ip?: string;
  action?: EventActions;
  entity?: string;
  entityId?: string;
  actorId?: string;
  actorType?: ActorType;
  status: EventStatus;
}

export type Metadata = Prisma.InputJsonObject;

export class AuditPayload extends PickType(CreateAuditData, [
  'action',
  'entity',
  'entityId',
  'status',
  'metadata',
]) {}
