import { Controller, Get } from '@nestjs/common';
import { ConsentService } from './consent.service';

@Controller('privacy')
export class ConsentController {
  constructor(private consentService: ConsentService) {}

  @Get('')
  async getActualConsent() {
    return this.consentService.getActualConsent();
  }
}
