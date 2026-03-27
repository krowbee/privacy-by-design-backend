import {
  ActorType,
  EventActions,
  EventStatus,
  Prisma,
} from 'generated/prisma/client';

export type AuditPayload = {
  metadata?: Prisma.InputJsonValue | Prisma.NullableJsonNullValueInput;
  ip?: string;
  action: EventActions;
  entity?: string;
  entityId?: string;
  actorId?: string;
  actorType?: ActorType;
  status: EventStatus;
};
