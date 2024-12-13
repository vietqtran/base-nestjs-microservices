import { Inject, Module } from '@nestjs/common';
import { IdentityService } from './identity.service';
import { IdentityController } from './identity.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ClientKafka, ClientsModule, Transport } from '@nestjs/microservices';
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
    ClientsModule.registerAsync([
      {
        name: 'USERS_SERVICE',
        useFactory: (config: ConfigService) => ({
          transport: Transport.KAFKA,
          options: {
            client: {
              clientId: 'identity-service-users-service',
              brokers: [config.get<string>('KAFKA_BROKER_URL')],
            },
            consumer: {
              groupId: 'identity-service-users-service-consumer-group',
            },
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [IdentityController],
  providers: [IdentityService],
})
export class IdentityModule {
  constructor(
    @Inject('USERS_SERVICE') private readonly usersClient: ClientKafka,
  ) {}

  private readonly topics = ['users.update', 'users.update.reply'];

  async onModuleInit() {
    this.topics.forEach((topic) => {
      this.usersClient.subscribeToResponseOf(topic);
      console.log(`Subscribed to topic: ${topic}`);
    });

    await this.usersClient.connect();
    console.log('Connected to Kafka');
  }
}
