import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

const saltOrRounds = 12;

@Injectable()
export class CryptoService {
  async hashValue(value: string): Promise<string> {
    return bcrypt.hash(value, saltOrRounds);
  }
  async compareValue(value: string, hashedValue: string): Promise<boolean> {
    return bcrypt.compare(value, hashedValue);
  }
}
