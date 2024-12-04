import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class SignUpDto {
  @ApiProperty({
    example: 'email@gmail.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'username',
  })
  @IsString()
  username: string;

  @ApiProperty({
    example: 'password',
  })
  @IsString()
  password: string;

  @ApiProperty({
    example: 'password',
  })
  @IsString()
  confirmPassword: string;
}
