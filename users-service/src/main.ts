import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';
import { UsersModule } from './users.module';
import * as dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    UsersModule,
    {
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
  );

  app.useGlobalPipes(new ValidationPipe());

  await app.listen();
}
bootstrap();
