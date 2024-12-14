import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { UsersController } from './services/users-service/users.controller';
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
        name: 'AUTH_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'auth-service',
            brokers: [process.env.KAFKA_BROKER_URL],
            connectionTimeout: 5000,
            retry: {
              initialRetryTime: 1000,
              retries: 5,
            },
          },
          consumer: {
            groupId: 'auth-service-consumer',
            allowAutoTopicCreation: true,
            sessionTimeout: 30000,
          },
        },
      },
      {
        name: 'USERS_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'users-service',
            brokers: [process.env.KAFKA_BROKER_URL],
            connectionTimeout: 5000,
            retry: {
              initialRetryTime: 1000,
              retries: 5,
            },
          },
          consumer: {
            groupId: 'users-service-consumer',
            allowAutoTopicCreation: true,
            sessionTimeout: 30000,
          },
        },
      },
      {
        name: 'IDENTITY_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'identity-service',
            brokers: [process.env.KAFKA_BROKER_URL],
            connectionTimeout: 5000,
            retry: {
              initialRetryTime: 1000,
              retries: 5,
            },
          },
          consumer: {
            groupId: 'identity-service-consumer',
            allowAutoTopicCreation: true,
            sessionTimeout: 30000,
          },
        },
      },
    ]),
    I18nConfigModule,
  ],
  controllers: [UsersController, AuthController, IdentityController],
  providers: [LocalStrategy, JwtStrategy, JwtRefreshStrategy],
})
export class ApiGatewayModule {}
