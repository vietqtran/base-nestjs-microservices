import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';

export class UpdateUserRoleDto {
  @ApiProperty({
    example: ['admin', 'user'],
  })
  @IsArray()
  roleKeys: string[];
}
