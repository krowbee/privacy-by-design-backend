/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { PrismaClient } from 'generated/prisma/client';
import { ClsService } from 'nestjs-cls';
import {
  EventActions,
  EventCategories,
  EventStatus,
} from 'generated/prisma/enums';
import { Prisma } from 'generated/prisma/client';

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

export function auditExtension(cls: ClsService, baseClient: PrismaClient) {
  return Prisma.defineExtension({
    name: 'audit-log',
    query: {
      $allModels: {
        async $allOperations({ model, operation, args, query }) {
          const result = await query(args);

          if (!model || SKIP_MODELS.has(model)) return result;

          const action = OPERATION_TO_ACTION[operation];
          if (!action) return result;

          baseClient.auditEvent
            .create({
              data: {
                category: EventCategories.CRUD,
                status: EventStatus.SUCCESS,
                action,
                entity: model,
                entitySelector: (args as any)?.where ?? Prisma.JsonNull,
                ip: cls.get<string>('ip') ?? null,
                actorId: cls.get<string>('actorId') ?? null,
                actorType: cls.get('actorType') ?? null,
                metadata: {
                  requestId: cls.getId(),
                  path: cls.get<string>('path'),
                  method: cls.get<string>('method'),
                  fields: extractChangedFields(args, operation),
                },
              },
            })
            .then((event) => console.log('Audit logged:', event))
            .catch((err) => console.error('Audit log failed', err));

          return result;
        },
      },
    },
  });
}
