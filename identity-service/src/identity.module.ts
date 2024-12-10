import { Module } from '@nestjs/common';
import { IdentityService } from './identity.service';
import { IdentityController } from './identity.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [],
      isGlobal: true,
      expandVariables: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => {
        return {
          uri: config.get<string>('MONGO_URI'),
        };
      },
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([]),
    ClientsModule.register([
      {
        name: 'IDENTITY_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'identity-service',
            brokers: [process.env.KAFKA_BROKER_URL],
          },
          consumer: {
            groupId: 'identity-consumer-group',
          },
        },
      },
    ]),
  ],
  controllers: [IdentityController],
  providers: [IdentityService],
})
export class IdentityModule {
  constructor() {}

  async onModuleInit() {
    Promise.all([]).then(() => {
      console.log('Connected to Kafka');
    });
  }
}
