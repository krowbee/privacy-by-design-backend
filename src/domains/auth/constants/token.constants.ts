import { JwtSignOptions } from '@nestjs/jwt';

export const accessTokenOptions: JwtSignOptions = {
  secret: process.env.ACCESS_SECRET,
  expiresIn: '10m',
};
