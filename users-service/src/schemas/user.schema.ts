import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Transform, Type } from 'class-transformer';
import { IsEnum, IsObject, IsString, IsUrl } from 'class-validator';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

class Avatar {
  @Prop({ required: true })
  @IsUrl()
  url: string;

  @Prop({ required: true })
  key: string;
}

class Settings {
  @Prop({ required: false, default: 'light' })
  @Transform(({ value }) => value.toLowerCase())
  @IsEnum(['light', 'dark', 'system'])
  theme: 'light' | 'dark' | 'system';

  @Prop({ required: false, default: 'dd.mm.yyyy' })
  @Transform(({ value }) => value.toLowerCase())
  @IsEnum(['dd.mm.yyyy', 'mm.dd.yyyy', 'yyyy.mm.dd'])
  dateFormat: 'dd.mm.yyyy' | 'mm.dd.yyyy' | 'yyyy.mm.dd';

  @Prop({ required: false, default: 'en' })
  @Transform(({ value }) => value.toLowerCase())
  @IsEnum(['en', 'vi', 'ja', 'cn'])
  language: 'en' | 'vi' | 'ja' | 'cn';
}

class Address {
  @Prop({ required: false })
  @IsString()
  country?: string;

  @Prop({ required: false })
  @IsString()
  contry_code?: string;

  @Prop({ required: false })
  @IsString()
  city?: string;

  @Prop({ required: false })
  @IsString()
  state?: string;

  @Prop({ required: false })
  @IsString()
  postal_code?: string;

  @Prop({ required: false })
  @IsString()
  address_line_1?: string;

  @Prop({ required: false })
  @IsString()
  address_line_2?: string;
}

class DetailsProfile {
  @Prop({ required: false })
  @IsString()
  first_name?: string;

  @Prop({ required: false })
  @IsString()
  last_name?: string;

  @Prop({ required: false })
  @IsString()
  middle_name?: string;

  @Prop({ required: false })
  @IsString()
  phone_number?: string;

  @Prop({ required: false })
  @IsString()
  phone_code?: string;

  @Prop({ required: false })
  @IsString()
  bio?: string;

  @Prop({ required: false })
  @Transform(({ value }) => value.toLowerCase())
  @IsEnum(['male', 'female', 'other'])
  gender?: 'male' | 'female' | 'other';

  @Prop({ required: false })
  @IsObject()
  @Type(() => Address)
  address?: Address;
}

@Schema({
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
  versionKey: false,
})
export class User {
  @Transform(({ value }) => value.toString())
  _id?: string;

  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: false })
  @IsObject()
  @Type(() => Avatar)
  avatar: Avatar;

  @Prop({ required: false })
  @IsObject()
  @Type(() => Settings)
  settings: Settings;

  @Prop({ required: false })
  @IsObject()
  @Type(() => DetailsProfile)
  profile: DetailsProfile;
}

export const UserSchema = SchemaFactory.createForClass(User);
