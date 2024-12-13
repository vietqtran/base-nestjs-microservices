import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsString } from 'class-validator';

@Schema({
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
  versionKey: false,
})
export class Role {
  @IsString()
  @Prop({ required: true, unique: true })
  key: string;

  @IsString()
  @Prop({ required: true, unique: true })
  role_name: string;

  @IsString()
  @Prop({ required: false, default: null })
  description: string;
}

export const RoleSchema = SchemaFactory.createForClass(Role);
