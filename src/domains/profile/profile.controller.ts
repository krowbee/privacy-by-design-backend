import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateProfileDTO, UpdateProfileDTO } from './types/profile.dto';
import { AuthOnlyGuard } from '../auth/guards/auth-only.guard';
import { User } from '../auth/decorators/user.decorator';
import type { TokenPayload } from '../auth/types/payload';
import { ProfileService } from './profile.service';

@ApiTags('Profile')
@Controller('/profile')
export class ProfileController {
  constructor(private profileService: ProfileService) {}

  @Get('')
  @UseGuards(AuthOnlyGuard)
  async getProfile(@User() user: TokenPayload) {
    const profile = await this.profileService.getProfile(user.id);
    return profile;
  }

  @Post('')
  @UseGuards(AuthOnlyGuard)
  async createProfile(
    @Body() data: CreateProfileDTO,
    @User() user: TokenPayload,
  ) {
    const profile = await this.profileService.createProfile(data, user.id);
    return { id: profile.id };
  }

  @Patch('')
  @UseGuards(AuthOnlyGuard)
  async updateProfile(
    @Body() data: UpdateProfileDTO,
    @User() user: TokenPayload,
  ) {
    await this.profileService.updateProfile(data, user.id);
    return { message: 'Profile updated successfully' };
  }

  @Delete('')
  @UseGuards(AuthOnlyGuard)
  async deleteProfile(@User() user: TokenPayload) {
    await this.profileService.deleteProfile(user.id);
    return { message: 'Profile deleted successfully' };
  }
}
