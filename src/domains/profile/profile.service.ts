import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateProfileDTO, UpdateProfileDTO } from './types/profile.dto';
import { PrismaService } from 'src/lib/prisma/prisma.service';

@Injectable()
export class ProfileService {
  constructor(private prisma: PrismaService) {}
  async createProfile(data: CreateProfileDTO, userId: string) {
    const isExists = await this.prisma.client.profile.findUnique({
      where: { userId },
    });
    if (isExists) throw new ForbiddenException('You already have profile');

    const profile = await this.prisma.client.profile.create({
      data: { ...data, userId },
    });
    return profile;
  }

  async updateProfile(data: UpdateProfileDTO, userId: string) {
    const isExists = await this.prisma.client.profile.findUnique({
      where: { userId },
    });
    if (!isExists) throw new ForbiddenException("You don't have profile");
    const profile = await this.prisma.client.profile.update({
      where: { userId },
      data,
    });
    return profile;
  }
}
