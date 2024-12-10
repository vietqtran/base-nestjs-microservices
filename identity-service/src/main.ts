import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { IdentityModule } from './identity.module';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    IdentityModule,
    {
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
          groupId: 'identity-consumer-group',
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
