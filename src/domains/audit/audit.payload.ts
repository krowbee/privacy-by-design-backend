import { EventCategories, Prisma } from 'generated/prisma/browser';
import { ActorType, EventActions, EventStatus } from 'generated/prisma/client';

export type Metadata = Prisma.InputJsonObject;

export interface AuditPayload {
  category: EventCategories;
  status: EventStatus;
  action?: EventActions;
  entity?: string;
  entitySelector?: Prisma.InputJsonValue;
  metadata?: Metadata;
}

export interface CreateAuditData extends AuditPayload {
  ip?: string;
  actorId?: string;
  actorType?: ActorType;
}
