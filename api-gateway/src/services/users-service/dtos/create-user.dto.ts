import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    example: 'username',
  })
  @IsString()
  username: string;

  @ApiProperty({
    example: 'email@domain.com',
  })
  @IsEmail()
  email: string;
}
