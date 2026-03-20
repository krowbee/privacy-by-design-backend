import { Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateProfileDTO } from './types/profile.dto';

@ApiTags('Profile')
@Controller('/profile')
export class ProfileController {
  @Post('')
  async createProfile(data: CreateProfileDTO) {}
}
