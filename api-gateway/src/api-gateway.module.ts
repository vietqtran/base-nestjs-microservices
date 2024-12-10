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
  controllers: [UsersController, AuthController],
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

  async onModuleInit() {
    const usersTopics = [
      'users.get-all',
      'users.create',
      'users.update',
      'users.delete',
      'users.get-by-id',
    ];
    const authTopics = [
      'auth.validate-user',
      'auth.login',
      'auth.sign-up',
      'auth.refresh-token',
      'auth.get-session-by-id',
      'auth.get-all-user-credentials',
      'auth.get-all-sessions',
    ];
    const identityTopics = []

    usersTopics.forEach((topic) =>
      this.usersClient.subscribeToResponseOf(topic),
    );
    authTopics.forEach((topic) => this.authClient.subscribeToResponseOf(topic));
    identityTopics.forEach((topic) => this.identityClient.subscribeToResponseOf(topic));

    Promise.all([this.usersClient.connect(), this.authClient.connect(), this.identityClient.connect()]).then(
      () => {
        console.log('Connected to Kafka');
      },
    );
  }
}
