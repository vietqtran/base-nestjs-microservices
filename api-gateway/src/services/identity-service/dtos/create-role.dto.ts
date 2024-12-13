import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateRoleDto {
  @ApiProperty({ example: 'ADMIN' })
  @IsString()
  key: string;

  @ApiProperty({
    example: 'Administrator',
  })
  @IsString()
  role_name: string;

  @ApiProperty({
    example: 'Administrator',
  })
  @IsString()
  description: string;
}
