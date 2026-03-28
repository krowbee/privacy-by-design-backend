import { Prisma } from 'generated/prisma/client';
import { AuditService } from 'src/domains/audit/audit.service';

export const auditChangesExtension = (auditService: AuditService) =>
  Prisma.defineExtension({
    name: 'audit',
    query: {
      $allOperations({ model, operation, args, query }) {
        return query(args);
      },
    },
  });
