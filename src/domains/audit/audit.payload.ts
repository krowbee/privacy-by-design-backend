import { EventActions, EventStatus, Prisma } from 'generated/prisma/client';

export type AuditPayload = {
  metadata?: Prisma.JsonValue;
  action: EventActions;
  entity?: string;
  entityId?: string;
  userId?: string;
  status: EventStatus;
};
