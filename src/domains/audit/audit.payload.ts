import { PickType } from '@nestjs/swagger';
import { EventCategories, Prisma } from 'generated/prisma/browser';
import { ActorType, EventActions, EventStatus } from 'generated/prisma/client';

export class CreateAuditData {
  category: EventCategories;
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
  'category',
  'action',
  'entity',
  'entityId',
  'status',
  'metadata',
]) {}
