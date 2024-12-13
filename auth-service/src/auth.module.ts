import { Inject, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ClientKafka, ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import {
  UserCredentials,
  UserCredentialsSchema,
} from './schemas/user-credentials.schema';
import { Session, SessionSchema } from './schemas/session.schema';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        uri: config.get<string>('MONGO_URI'),
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([
      { name: UserCredentials.name, schema: UserCredentialsSchema },
      { name: Session.name, schema: SessionSchema },
    ]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: `${configService.get<string>('JWT_EXPIRE_IN')}s`,
        },
      }),
    }),
    ClientsModule.registerAsync([
      {
        name: 'USERS_SERVICE',
        useFactory: (config: ConfigService) => ({
          transport: Transport.KAFKA,
          options: {
            client: {
              clientId: 'auth-service-users-service',
              brokers: [config.get<string>('KAFKA_BROKER_URL')],
            },
            consumer: {
              groupId: 'auth-service-users-service-consumer-group',
            },
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {
  constructor(
    @Inject('USERS_SERVICE') private readonly usersClient: ClientKafka,
  ) {}

  private readonly topics = [
    'users.get-by-id',
    'users.get-by-filter',
    'users.create',
  ];

  async onModuleInit() {
    this.topics.forEach((topic) => {
      this.usersClient.subscribeToResponseOf(topic);
      console.log(`Subscribed to topic: ${topic}`);
    });

    await this.usersClient.connect();
    console.log('Connected to Kafka');
  }
}
