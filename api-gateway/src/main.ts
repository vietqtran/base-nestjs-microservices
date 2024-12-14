import { NestFactory, Reflector } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { ApiGatewayModule } from './api-gateway.module';
import * as dotenv from 'dotenv';
import { ResponseParserInterceptor } from './shared/interceptors/response.interceptor';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import JwtAuthGuard from './shared/guards/jwt.guard';
import { KafkaExceptionFilter } from './shared/filters/exception.filter';
import * as cookieParser from 'cookie-parser';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(ApiGatewayModule);
  app.use(cookieParser());
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'api-gateway',
        brokers: [process.env.KAFKA_BROKER_URL],
        connectionTimeout: 5000,
        retry: {
          initialRetryTime: 1000,
          retries: 5,
        },
      },
      consumer: {
        groupId: 'api-gateway-consumer',
        allowAutoTopicCreation: true,
        sessionTimeout: 30000,
      },
    },
  });

  app.setGlobalPrefix('api');
  app.useGlobalInterceptors(new ResponseParserInterceptor());
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalGuards(new JwtAuthGuard(app.get(Reflector)));
  app.useGlobalFilters(new KafkaExceptionFilter());

  const config = new DocumentBuilder()
    .setTitle('API')
    .setDescription('API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.enableCors();

  await app.startAllMicroservices();
  await app.listen(process.env.PORT || 8000);
}
bootstrap();
