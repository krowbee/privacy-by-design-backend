import { EventActions, EventStatus, Prisma } from 'generated/prisma/client';

export type AuditPayload = {
  metadata?: Prisma.JsonValue;
  action: EventActions;
  entity?: string;
  entityId?: string;

  status: EventStatus;
};
