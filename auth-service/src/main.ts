import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { AuthModule } from './auth.module';
import { KafkaExceptionFilter } from './filters/exception.filter';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AuthModule,
    {
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
          groupId: 'auth-consumer-group',
          allowAutoTopicCreation: true,
          sessionTimeout: 30000,
        },
      },
    },
  );

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new KafkaExceptionFilter());

  await app.listen();
}
bootstrap();
