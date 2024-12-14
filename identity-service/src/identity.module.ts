import { Inject, Module } from '@nestjs/common';
import { IdentityService } from './identity.service';
import { IdentityController } from './identity.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ClientKafka } from '@nestjs/microservices';
import { Role, RoleSchema } from './schemas/role.schema';

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
    MongooseModule.forFeature([{ name: Role.name, schema: RoleSchema }]),
  ],
  controllers: [IdentityController],
  providers: [IdentityService],
})
export class IdentityModule {
  constructor(
    @Inject('USERS_SERVICE') private readonly usersClient: ClientKafka,
  ) {}

  private readonly topics = ['users.update'];

  async onModuleInit() {
    this.topics.forEach((topic) => {
      this.usersClient.subscribeToResponseOf(topic);
      console.log(`Subscribed to topic: ${topic}`);
    });

    await this.usersClient.connect();
    console.log('Connected to Kafka');
  }

  async onModuleDestroy() {
    await this.usersClient.close();
  }
}
