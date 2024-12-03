import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsObject, IsString } from 'class-validator';

class Credentials {
  @ApiProperty({
    example: 'email@domain.com',
  })
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'password',
  })
  @IsString()
  password: string;

  @ApiProperty({
    example: true,
  })
  @IsBoolean()
  is_remember: boolean;
}

class Session {
  @ApiProperty({
    example: '127.0.0.1',
  })
  @IsString()
  ip: string;

  @ApiProperty({
    example:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36',
  })
  @IsString()
  ua: string;
}

export class SignInDto {
  @ApiProperty()
  @IsObject()
  credentials: Credentials;

  @ApiProperty()
  @IsObject()
  session: Session;
}
