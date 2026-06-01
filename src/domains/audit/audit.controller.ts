import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AuditService } from './audit.service';
import { EventStatus } from 'generated/prisma/enums';
import { EventCategories } from 'generated/prisma/enums';
import { AdminOnlyGuard } from '../auth/guards/admin-only.guard';

@Controller('audit')
export class AuditController {
  constructor(private auditService: AuditService) {}

  @Get('')
  @UseGuards(AdminOnlyGuard)
  async getAuditByFilter(
    @Query('status') status?: EventStatus,
    @Query('category') category?: EventCategories,
  ) {
    return this.auditService.getAuditByFilters(status, category);
  }
}
