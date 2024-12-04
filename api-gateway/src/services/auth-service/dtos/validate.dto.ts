import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ValidateDto {
  @ApiProperty({
    example: 'email@gmail.com',
  })
  @IsString()
  email: string;

  @ApiProperty({
    example: 'password',
  })
  @IsString()
  password: string;
}
