import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsObject, IsString } from 'class-validator';

export class UpdateUserProfileDto {
  @ApiProperty()
  @IsString()
  first_name?: string;

  @ApiProperty()
  @IsString()
  last_name?: string;

  @ApiProperty()
  @IsString()
  middle_name?: string;

  @ApiProperty()
  @IsString()
  phone_number?: string;

  @ApiProperty()
  @IsString()
  phone_code?: string;

  @ApiProperty()
  @IsString()
  bio?: string;

  @ApiProperty()
  @IsString()
  gender?: 'male' | 'female' | 'other';
}

export class UpdateUserAddressDto {
  @ApiProperty()
  @IsString()
  country?: string;

  @ApiProperty()
  @IsString()
  country_code?: string;

  @ApiProperty()
  @IsString()
  city?: string;

  @ApiProperty()
  @IsString()
  state?: string;

  @ApiProperty()
  @IsString()
  postal_code?: string;

  @ApiProperty()
  @IsString()
  address_line_1?: string;

  @ApiProperty()
  @IsString()
  address_line_2?: string;
}

export class UpdateUserAvatarDto {
  @ApiProperty()
  @IsString()
  url?: string;

  @ApiProperty()
  @IsString()
  key?: string;
}

export class UpdateUserSettingsDto {
  @ApiProperty()
  @IsString()
  theme?: 'light' | 'dark' | 'system';

  @ApiProperty()
  @IsString()
  dateFormat?: 'dd.mm.yyyy' | 'mm.dd.yyyy' | 'yyyy.mm.dd';

  @ApiProperty()
  @IsString()
  language?: 'en' | 'vi' | 'ja' | 'cn';
}

export class UpdateUserDto {
  @ApiProperty()
  @IsObject()
  settings?: UpdateUserSettingsDto;

  @ApiProperty()
  @IsObject()
  avatar?: UpdateUserAvatarDto;

  @ApiProperty()
  @IsObject()
  profile: UpdateUserProfileDto;

  @ApiProperty()
  @IsObject()
  address?: UpdateUserAddressDto;

  @ApiProperty()
  @IsArray()
  roles?: string[];
}
