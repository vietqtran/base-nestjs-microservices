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

@Controller('users')
export class UsersController {
  constructor(@Inject('USERS_SERVICE') private readonly client: ClientKafka) {}

  @Get()
  async getAllUsers() {
    const users = await firstValueFrom(this.client.send('users.get-all', {}));
    return users;
  }

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto) {
    const user = await firstValueFrom(
      this.client.send('users.create', createUserDto),
    );
    return user;
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const user = await firstValueFrom(
      this.client.send('users.update', { id, payload: updateUserDto }),
    );
    return user;
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    const user = await firstValueFrom(this.client.send('users.delete', id));
    return user;
  }

  onModuleInit() {
    const topics = [
      'users.get-all',
      'users.create',
      'users.update',
      'users.delete',
    ];
    topics.forEach((topic) => this.client.subscribeToResponseOf(topic));
  }
}
