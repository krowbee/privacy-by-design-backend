import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateProfileDTO } from './types/profile.dto';
import { AuthOnlyGuard } from '../auth/guards/auth-only.guard';
import { User } from '../auth/decorators/user.decorator';
import type { TokenPayload } from '../auth/types/payload';
import { ProfileService } from './profile.service';

@ApiTags('Profile')
@Controller('/profile')
export class ProfileController {
  constructor(private profileService: ProfileService) {}
  @Post('')
  @UseGuards(AuthOnlyGuard)
  async createProfile(
    @Body() data: CreateProfileDTO,
    @User() user: TokenPayload,
  ) {
    const profile = await this.profileService.createProfile(data, user.id);
    return profile;
  }
}
