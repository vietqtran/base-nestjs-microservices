# Các công cụ và phiên bản cần thiết cho dự án

### NVM (Dùng để tải Nodejs và chuyển đổi các versions của Nodejs nếu cần)
#### Download: [https://github.com/nvm-sh/nvm](https://github.com/nvm-sh/nvm)
##### Để kiểm tra đã cài thành công chưa, mở CMD gõ lệnh `nvm -v` và kết quả sẽ hiển thị version của NVM
##### Sau đó gõ lệnh nvm install 20.17.0 để cài đặt Nodejs version v20.17.0.
##### Sau khi cài thành công, gõ lệnh `nvm ls` để xem các version của Nodejs đã cài đặt
##### Kết quả trả về sẽ có dạng như sau:
```
*   v20.17.0 (Currently using node v20.17.0)
    v20.16.0
```
##### Nếu (Currently using node v20.17.0) thì bạn đã cài đặt thành công
##### Nếu không, bạn cần gõ lệnh sau để sử dụng version v20.17.0 bằng lệnh `nvm install 20.17.0`
**_Nếu đã làm phần này có thể chuyển qua cài Yarn luôn, bỏ qua hướng dẫn cài Nodejs ở dưới._**
### Nodejs version: v20.17.0
#### Download: [https://nodejs.org/download/release/v20.17.0/](https://nodejs.org/download/release/v20.17.0/)
##### Để kiểm tra đã cài thành công chưa, mở CMD gõ lệnh `node -v` và kết quả sẽ hiển thị version của Nodejs
### Yarn version: v1.22.22
#### Download: Sau khi cài thành công Nodejs version v20.17.0, gõ lệnh sau để cài đặt Yarn
```
npm install -g yarn
```
##### Để kiểm tra đã cài thành công chưa, mở CMD gõ lệnh `yarn -v` và kết quả sẽ hiển thị version của Yarn

Các tools cần thiết cho quá trình phát triển:
### Nestjs cli
#### Download: Sau khi cài thành công 

# Các bước tạo 1 service mới:
Mở terminal ở thư mục gốc của dự án
Gõ lệnh: nest new <service-name>    
Thay thế <service-name> bằng tên của service mới ví dụ: 
        
```
nest new users-service
```
Sau khi tạo xong service, thay thế mục dependencies và devDependencies trong file package.json của service mới:
```
dependencies": {
    "@nestjs/common": "^10.0.0",
    "@nestjs/config": "^3.3.0",
    "@nestjs/core": "^10.0.0",
    "@nestjs/mapped-types": "*",
    "@nestjs/microservices": "^10.4.11",
    "@nestjs/mongoose": "^10.1.0",
    "@nestjs/platform-express": "^10.0.0",
    "class-transformer": "^0.5.1",
    "class-validator": "^0.14.1",
    "dotenv": "^16.4.5",
    "kafkajs": "^2.2.4",
    "mongoose": "^8.8.3",
    "reflect-metadata": "^0.2.0",
    "rxjs": "^7.8.1"
  },
  "devDependencies": {
    "@nestjs/cli": "^10.0.0",
    "@nestjs/schematics": "^10.0.0",
    "@nestjs/testing": "^10.0.0",
    "@types/express": "^5.0.0",
    "@types/jest": "^29.5.2",
    "@types/node": "^20.3.1",
    "@types/supertest": "^6.0.0",
    "@typescript-eslint/eslint-plugin": "^8.0.0",
    "@typescript-eslint/parser": "^8.0.0",
    "eslint": "^8.0.0",
    "eslint-config-prettier": "^9.0.0",
    "eslint-plugin-prettier": "^5.0.0",
    "jest": "^29.5.0",
    "prettier": "^3.0.0",
    "source-map-support": "^0.5.21",
    "supertest": "^7.0.0",
    "ts-jest": "^29.1.0",
    "ts-loader": "^9.4.3",
    "ts-node": "^10.9.1",
    "tsconfig-paths": "^4.2.0",
    "typescript": "^5.1.3"
  },
```
Sau đó di chuyển vào thư mục của service mới bằng lệnh `cd <service-name>` và gõ lệnh `yarn` hoặc `yarn install` để cài đặt các dependencies.

# Thiết lập cho service mới
Gõ lệnh `nest g res <service-name>` để thiết lập các file cần thiết cho service mới. <service-name> là tên của service mới.
Sau khi gõ lệnh trên, bên trong thư mục `src` sẽ có các file như sau:
```
src
├── app.controller.ts
├── app.module.ts
├── app.service.ts
├── app.service.spec.ts
├── main.ts
├── <service-name>
│   ├── <service-name>.controller.ts
|   ├── <service-name>.controller.spec.ts
│   ├── <service-name>.service.ts
│   ├── <service-name>.service.spec.ts
|   └── <service-name>.module.ts
```

Sau đó xóa bỏ các file liên quan đến app và di chuyển các file vừa tạo ra ngoài thư mục `src`. Sau khi làm sẽ có kết quả như sau:
```
src
├── <service-name>.controller.ts
├── <service-name>.controller.spec.ts
├── <service-name>.service.ts
├── <service-name>.service.spec.ts
├── <service-name>.module.ts
└── main.ts
```

# Cấu hình cho service mới
Thêm .env vào thư mục gốc với nội dung:
```
MONGO_URI=<mongo-uri>
KAFKA_BROKER_URL=<kafka-broker-url>
```

Trong file main.ts, thay thế bằng đoạn code sau:
```
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
          groupId: 'users-consumer-group',
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
```

Chỉnh sửa module.ts như sau:
```
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User, UserSchema } from './schemas/user.schema';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as dotenv from 'dotenv';

dotenv.config();

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
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    ClientsModule.register([
      {
        name: 'USERS_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'users-service',
            brokers: [process.env.KAFKA_BROKER_URL],
          },
          consumer: {
            groupId: 'users-consumer-group',
          },
        },
      },
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
```

# Docker
Tải Docker từ trang https://docs.docker.com/get-docker/ và cài đặt.

Mở terminal ở thư mục gốc và gõ lệnh sau:
```
docker-compose up -d
```
Mục đích để chạy Kafka, Redis và các service cần thiết trong quá trình phát triển