import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Transform } from 'class-transformer';

@Schema({
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
  versionKey: false,
})
export class UserCredentials {
  @Transform(({ value }) => value.toString())
  _id?: string;

  @Prop({ required: true, index: true })
  user_id: string;

  @Prop({ required: true, index: true })
  email: string;

  @Prop({ required: true, index: true })
  username: string;

  @Prop({ required: true })
  hashed_password: string;

  @Prop({ required: false, default: [] })
  password_history?: string[];
}

export const UserCredentialsSchema =
  SchemaFactory.createForClass(UserCredentials);
