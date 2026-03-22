import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProfileDTO, UpdateProfileDTO } from './types/profile.dto';
import { PrismaService } from 'src/lib/prisma/prisma.service';
import { maskNumbers } from './utills/passportNumberMask';

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
    const passportNumber = maskNumbers(profile.passportNumber);
    return { ...profile, passportNumber };
  }

  async updateProfile(data: UpdateProfileDTO, userId: string) {
    const isExists = await this.prisma.client.profile.findUnique({
      where: { userId },
    });
    if (!isExists) throw new NotFoundException("You don't have profile");
    const profile = await this.prisma.client.profile.update({
      where: { userId },
      data,
    });
    const passportNumber = maskNumbers(profile.passportNumber);
    return { ...profile, passportNumber };
  }

  async getProfile(userId: string) {
    const profile = await this.prisma.client.profile.findUnique({
      where: { userId },
    });
    if (!profile) throw new NotFoundException("You don't have profile");
    return profile;
  }

  async deleteProfile(userId: string) {
    const isExists = await this.prisma.client.profile.findUnique({
      where: { userId },
    });
    if (!isExists) throw new NotFoundException("You don't have profile");
    const profile = await this.prisma.client.profile.delete({
      where: { userId },
    });
    const passportNumber = maskNumbers(profile.passportNumber);
    return { ...profile, passportNumber };
  }
}
