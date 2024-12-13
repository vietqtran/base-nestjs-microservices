import { Inject, Module } from '@nestjs/common';
import { ClientKafka, ClientsModule, Transport } from '@nestjs/microservices';
import { UsersController } from './services/users-service/users.controller';
import { CLIENT_KAFKA_OPTIONS } from './constants';
import * as dotenv from 'dotenv';
import { I18nConfigModule } from './i18n/i18n.module';
import { AuthController } from './services/auth-service/auth.controller';
import { LocalStrategy } from './shared/strategies/local.strategy';
import { JwtStrategy } from './shared/strategies/jwt.strategy';
import { ConfigModule } from '@nestjs/config';
import { JwtRefreshStrategy } from './shared/strategies/jwt-refresh.strategy';
import { IdentityController } from './services/identity-service/identity.controller';

dotenv.config();

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [],
      isGlobal: true,
      expandVariables: true,
    }),
    ClientsModule.register([
      {
        name: CLIENT_KAFKA_OPTIONS.users.name,
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: CLIENT_KAFKA_OPTIONS.users.clientId,
            brokers: [process.env.KAFKA_BROKER_URL],
          },
          consumer: {
            groupId: CLIENT_KAFKA_OPTIONS.users.groupId,
          },
        },
      },
      {
        name: CLIENT_KAFKA_OPTIONS.auth.name,
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: CLIENT_KAFKA_OPTIONS.auth.clientId,
            brokers: [process.env.KAFKA_BROKER_URL],
          },
          consumer: {
            groupId: CLIENT_KAFKA_OPTIONS.auth.groupId,
          },
        },
      },
      {
        name: CLIENT_KAFKA_OPTIONS.identity.name,
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: CLIENT_KAFKA_OPTIONS.identity.clientId,
            brokers: [process.env.KAFKA_BROKER_URL],
          },
          consumer: {
            groupId: CLIENT_KAFKA_OPTIONS.identity.groupId,
          },
        },
      },
    ]),
    I18nConfigModule,
  ],
  controllers: [UsersController, AuthController, IdentityController],
  providers: [LocalStrategy, JwtStrategy, JwtRefreshStrategy],
})
export class ApiGatewayModule {
  constructor(
    @Inject(CLIENT_KAFKA_OPTIONS.users.name)
    private readonly usersClient: ClientKafka,
    @Inject(CLIENT_KAFKA_OPTIONS.auth.name)
    private readonly authClient: ClientKafka,
    @Inject(CLIENT_KAFKA_OPTIONS.identity.name)
    private readonly identityClient: ClientKafka,
  ) {}

  private readonly topics = {
    users: [
      'users.get-all',
      'users.create',
      'users.update',
      'users.delete',
      'users.get-by-id',
      'users.get-by-filter',
    ],
    auth: [
      'auth.validate-user',
      'auth.login',
      'auth.sign-up',
      'auth.refresh-token',
      'auth.get-session-by-id',
      'auth.get-all-user-credentials',
      'auth.get-all-sessions',
    ],
    identity: [
      'identity.get-all-permissions',
      'identity.create-role',
      'identity.update-role',
    ],
  };

  async onModuleInit() {
    const registerTopics = async (client: ClientKafka, topics: string[]) => {
      topics.forEach((topic) => {
        client.subscribeToResponseOf(topic);
        console.log(`Subscribed to topic: ${topic}`);
      });
      await client.connect();
    };

    await Promise.all([
      registerTopics(this.usersClient, this.topics.users),
      registerTopics(this.authClient, this.topics.auth),
      registerTopics(this.identityClient, this.topics.identity),
    ]);

    console.log('All Kafka clients connected and topics registered.');
  }

  async onModuleDestroy() {
    await this.usersClient.close();
    await this.authClient.close();
    await this.identityClient.close();
  }
}
