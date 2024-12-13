import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ClientsModule } from '@nestjs/microservices';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User, UserSchema } from './schemas/user.schema';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        uri: config.get<string>('MONGO_URI'),
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    ClientsModule.registerAsync([]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {
  async onModuleInit() {
    console.log('UsersModule initialized');
  }

  async onModuleDestroy() {
    console.log('UsersModule destroyed');
  }
}
