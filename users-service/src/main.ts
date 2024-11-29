import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';
import { UsersModule } from './users.module';
import * as dotenv from 'dotenv';
import { KafkaExceptionFilter } from './filters/exception.filter';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(UsersModule, {
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'users-service',
        brokers: [process.env.KAFKA_BROKER_URL],
      },
      consumer: {
        groupId: 'users-consumer-group'
      }
    }
  });

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new KafkaExceptionFilter());

  await app.listen();
}
bootstrap();