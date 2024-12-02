import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { UsersController } from './services/users-service/users.controller';
import { CLIENT_KAFKA_OPTIONS } from './constants';
import * as dotenv from 'dotenv';
import { I18nConfigModule } from './i18n/i18n.module';
import { AuthController } from './services/auth-service/auth.controller';

dotenv.config();

@Module({
  imports: [
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
    ]),
    I18nConfigModule,
  ],
  controllers: [UsersController, AuthController],
})
export class ApiGatewayModule {}
