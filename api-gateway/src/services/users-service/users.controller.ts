import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { Inject } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { CreateUserDto } from 'src/services/users-service/dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { ParseObjectIdPipe } from 'src/shared/pipes/object-id.pipe';
import { CLIENT_KAFKA_OPTIONS } from 'src/constants';

@Controller('users')
export class UsersController {
  constructor(
    @Inject(CLIENT_KAFKA_OPTIONS.users.name)
    private readonly userClient: ClientKafka,
  ) {}

  @Get()
  async getAllUsers() {
    const response = await firstValueFrom(
      this.userClient.send('users.get-all', {}),
    );
    return response;
  }

  @Get(':id')
  async getUserById(@Param('id', ParseObjectIdPipe) id: string) {
    const response = await firstValueFrom(
      this.userClient.send('users.get-by-id', id),
    );
    return response;
  }

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto) {
    const response = await firstValueFrom(
      this.userClient.send('users.create', createUserDto),
    );
    return response;
  }

  @Put(':id')
  async update(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const response = await firstValueFrom(
      this.userClient.send('users.update', { id, payload: updateUserDto }),
    );
    return response;
  }

  @Delete(':id')
  async deleteUser(@Param('id', ParseObjectIdPipe) id: string) {
    const response = await firstValueFrom(
      this.userClient.send('users.delete', id),
    );
    return response;
  }

  async onModuleInit() {
    const topics = [
      'users.get-all',
      'users.create',
      'users.update',
      'users.delete',
      'users.get-by-id',
      'users.get-by-filter',
    ];

    for (const topic of topics) {
      this.userClient.subscribeToResponseOf(topic);
      console.log(`Subscribed to topic: ${topic}`);
    }

    await this.userClient.connect();
    console.log('Connected to Kafka');
  }

  async onModuleDestroy() {
    await this.userClient.close();
    console.log('Disconnected from Kafka');
  }
}
