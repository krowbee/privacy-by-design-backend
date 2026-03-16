import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class SignUpDto {
  @ApiProperty({ example: 'test123@gmail.com', type: String })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'newpasswd123#', type: String })
  @MinLength(8)
  @IsString()
  password: string;
}

export class SignInDto {
  @ApiProperty({ example: 'test123@gmail.com', type: String })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'newpasswd123#', type: String })
  @IsString()
  password: string;
}

export class PublicUserDto {
  @ApiProperty({ example: '123456-456asd-asfa5-asfdasf' })
  @Expose()
  id: string;

  @ApiProperty({ example: 'test123@gmail.com', type: String })
  @Expose()
  email: string;
}
