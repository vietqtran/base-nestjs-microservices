import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { UsersController } from './services/users-service/users.controller';
import { CLIENT_KAFKA_OPTIONS } from './constants';
import * as dotenv from 'dotenv'
import { I18nConfigModule } from './i18n/i18n.module';

dotenv.config()

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
            groupId: CLIENT_KAFKA_OPTIONS.users.groupId
          }
        }
      }
    ]),
    I18nConfigModule
  ],
  controllers: [UsersController],
})
export class ApiGatewayModule {}