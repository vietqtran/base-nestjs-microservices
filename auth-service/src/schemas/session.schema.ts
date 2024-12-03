import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Transform } from 'class-transformer';

@Schema({
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
  versionKey: false,
})
export class Session {
  @Transform(({ value }) => value.toString())
  _id?: string;

  @Transform(({ value }) => value.toString())
  @Prop({ required: true, index: true })
  user_id: string;

  @Prop({ required: true, index: true })
  hashed_refresh_token: string;

  @Prop({ required: false })
  ip?: string;

  @Prop({ required: false })
  ua?: string;
}

export const SessionSchema = SchemaFactory.createForClass(Session);
