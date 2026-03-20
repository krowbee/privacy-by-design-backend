import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';

const saltOrRounds = 12;

type encryptedField = {
  iv: string;
  data: string;
  tag: string;
};
@Injectable()
export class CryptoService {
  constructor(private key: Buffer) {
    if (!process.env.ENCRYPTION_KEY) {
      throw new InternalServerErrorException();
    }
    this.key = Buffer.from(process.env.ENCRYPTION_KEY, 'hex');
  }
  async hashValue(value: string): Promise<string> {
    return bcrypt.hash(value, saltOrRounds);
  }
  async compareValue(value: string, hashedValue: string): Promise<boolean> {
    return bcrypt.compare(value, hashedValue);
  }

  encryptField(field: string): string {
    if (this.key.length !== 32)
      throw new InternalServerErrorException('Invalid key length');
    const iv = randomBytes(12);
    const cipher = createCipheriv('aes-256-gcm', this.key, iv);
    const encryptedField = Buffer.concat([
      cipher.update(field, 'utf8'),
      cipher.final(),
    ]);
    const tag = cipher.getAuthTag();
    return JSON.stringify({
      iv: iv.toString('hex'),
      data: encryptedField.toString('hex'),
      tag: tag.toString('hex'),
    });
  }

  decryptField(payload: string) {
    const { iv, data, tag } = JSON.parse(payload) as encryptedField;
    const decipher = createDecipheriv(
      'aes-256-gcm',
      this.key,
      Buffer.from(iv, 'hex'),
    );
    decipher.setAuthTag(Buffer.from(tag, 'hex'));

    const decryptedField = Buffer.concat([
      decipher.update(Buffer.from(data, 'hex')),
      decipher.final(),
    ]);
    return decryptedField.toString('utf8');
  }
}
