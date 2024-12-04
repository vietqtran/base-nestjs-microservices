import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class RefreshTokenDto {
  @ApiProperty({
    example: '1234567890',
  })
  @IsString()
  refreshToken: string;
}
