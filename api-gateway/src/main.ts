import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { ApiGatewayModule } from './api-gateway.module';
import * as dotenv from 'dotenv'

dotenv.config()

async function bootstrap() {
  const app = await NestFactory.create(ApiGatewayModule);
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'api-gateway',
        brokers: [process.env.KAFKA_BROKER_URL ?? 'localhost:9092'],
      },
      consumer: {
        groupId: 'api-gateway-consumer-group'
      }
    }
  });

  await app.startAllMicroservices();
  await app.listen(3000);
}
bootstrap();