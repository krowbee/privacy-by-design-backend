import { plainToInstance } from 'class-transformer';

export function toDto<T, V>(dto: new (...args: any[]) => T, value: V): T {
  return plainToInstance(dto, value, { excludeExtraneousValues: true });
}
