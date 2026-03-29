import { PrismaClient } from 'generated/prisma/client';
import { ClsService } from 'nestjs-cls';
import {
  ActorType,
  EventActions,
  EventCategories,
  EventStatus,
} from 'generated/prisma/enums';
import { Prisma } from 'generated/prisma/client';
import { CreateAuditData } from 'src/domains/audit/audit.payload';

const SKIP_MODELS = new Set(['AuditEvent']);

const OPERATION_TO_ACTION: Partial<Record<string, EventActions>> = {
  create: EventActions.CREATE,
  createMany: EventActions.CREATE,
  update: EventActions.UPDATE,
  updateMany: EventActions.UPDATE,
  upsert: EventActions.UPDATE,
  delete: EventActions.DELETE,
  deleteMany: EventActions.DELETE,
  findUnique: EventActions.READ,
  findFirst: EventActions.READ,
  findMany: EventActions.READ,
};

const extractChangedFields = (args: unknown, operation: string): string[] => {
  if (operation !== 'update') return [];
  if (!args || typeof args !== 'object') return [];
  const data = (args as Record<string, unknown>)['data'];
  if (!data && typeof data !== 'object') return [];
  return Object.keys(data as object);
};

function buildAuditPayload(
  cls: ClsService,
  model: string,
  action: EventActions,
  operation: string,
  args: unknown,
  status: EventStatus,
  error?: unknown,
): CreateAuditData {
  return {
    category: EventCategories.CRUD,
    status,
    action,
    entity: model,
    entitySelector:
      args && typeof args === 'object' && 'where' in args
        ? ((args as Record<string, unknown>).where ?? Prisma.JsonNull)
        : Prisma.JsonNull,
    ip: cls.get<string>('ip') ?? null,
    actorId: cls.get<string>('actorId') ?? null,
    actorType: cls.get<ActorType>('actorType') ?? null,
    metadata: {
      requestId: cls.getId(),
      path: cls.get<string>('path'),
      method: cls.get<string>('method'),
      fields: extractChangedFields(args, operation),
      error:
        error instanceof Error
          ? {
              name: error.name,
              message: error.message,
            }
          : null,
    },
  };
}

export function auditExtension(cls: ClsService, baseClient: PrismaClient) {
  return Prisma.defineExtension({
    name: 'audit-log',
    query: {
      $allModels: {
        async $allOperations({ model, operation, args, query }) {
          const action = OPERATION_TO_ACTION[operation];
          if (!action) return query(args);
          if (
            model === 'User' &&
            action !== EventActions.UPDATE &&
            action !== EventActions.DELETE
          )
            return query(args);
          try {
            const result = await query(args);

            if (!model || SKIP_MODELS.has(model)) return result;
            baseClient.auditEvent
              .create({
                data: buildAuditPayload(
                  cls,
                  model,
                  action,
                  operation,
                  args,
                  EventStatus.SUCCESS,
                ),
              })
              .then((event) => console.log('Audit logged:', event))
              .catch((err) => console.error('Audit log failed', err));

            return result;
          } catch (err) {
            baseClient.auditEvent
              .create({
                data: buildAuditPayload(
                  cls,
                  model,
                  action,
                  operation,
                  args,
                  EventStatus.FAILURE,
                  err,
                ),
              })
              .then((event) => console.log('Audit logged:', event))
              .catch((err) => console.error('Audit log failed', err));
          }
        },
      },
    },
  });
}
