import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/lib/prisma/prisma.service';

@Injectable()
export class ConsentService {
  constructor(private prismaClient: PrismaService) {}

  async getActualConsent() {
    const consent =
      await this.prismaClient.baseClient.consentDocument.findFirst({
        where: { isActive: true },
        orderBy: { id: 'desc', createdAt: 'desc' },
      });
    return consent;
  }

  async createUserConsent(userId: string) {
    const actualConsent = await this.getActualConsent();
    if (!actualConsent) throw new NotFoundException('Consents not found');
    const userConsent = this.prismaClient.client.userConsent.create({
      data: { userId, documentId: actualConsent?.id },
    });
    return userConsent;
  }
}
