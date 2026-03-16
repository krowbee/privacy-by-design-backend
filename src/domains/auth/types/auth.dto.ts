import { Expose } from 'class-transformer';
import { IsEmail, IsString } from 'class-validator';

export class SignUpDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}

export class SignInDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}

export class PublicUserDto {
  @Expose()
  id: string;

  @Expose()
  email: string;
}
