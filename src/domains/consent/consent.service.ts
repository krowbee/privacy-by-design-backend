import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/lib/prisma/prisma.service';

type ConsentPrismaClient = Pick<
  PrismaService['client'],
  'userConsent' | 'consentDocument'
>;
@Injectable()
export class ConsentService {
  constructor(private prismaService: PrismaService) {}

  async getActualConsent() {
    const consent =
      await this.prismaService.baseClient.consentDocument.findFirst({
        where: { isActive: true },
        orderBy: [{ id: 'desc' }, { createdAt: 'desc' }],
      });
    if (!consent) throw new NotFoundException('Consents not found');
    return consent;
  }

  async createUserConsent(
    userId: string,
    prisma: ConsentPrismaClient = this.prismaService.client,
  ) {
    const actualConsent = await this.getActualConsent();
    if (!actualConsent) throw new NotFoundException('Consents not found');
    const userConsent = await prisma.userConsent.create({
      data: { userId, documentId: actualConsent?.id },
    });
    return userConsent;
  }
}
