import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';
import { UsersModule } from './users.module';
import * as dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(UsersModule, {
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'users-service',
        brokers: [process.env.KAFKA_BROKER_URL ?? 'localhost:9092'],
      },
      consumer: {
        groupId: 'users-consumer-group'
      }
    }
  });

  app.useGlobalPipes(new ValidationPipe());
  await app.listen();
}
bootstrap();