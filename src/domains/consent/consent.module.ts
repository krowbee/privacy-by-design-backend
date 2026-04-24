import { Module } from '@nestjs/common';
import { ConsentService } from './consent.service';
import { ConsentController } from './consent.contoller';

@Module({
  providers: [ConsentService],
  controllers: [ConsentController],
})
export class ConsentModule {}
