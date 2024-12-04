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
import { ApiBearerAuth } from '@nestjs/swagger';
import { CLIENT_KAFKA_OPTIONS } from 'src/constants';

@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(
    @Inject(CLIENT_KAFKA_OPTIONS.users.name)
    private readonly client: ClientKafka,
  ) {}

  @Get()
  async getAllUsers() {
    const response = await firstValueFrom(
      this.client.send('users.get-all', {}),
    );
    return response;
  }

  @Get(':id')
  async getUserById(@Param('id', ParseObjectIdPipe) id: string) {
    const response = await firstValueFrom(
      this.client.send('users.get-by-id', id),
    );
    return response;
  }

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto) {
    const response = await firstValueFrom(
      this.client.send('users.create', createUserDto),
    );
    return response;
  }

  @Put(':id')
  async update(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const response = await firstValueFrom(
      this.client.send('users.update', { id, payload: updateUserDto }),
    );
    return response;
  }

  @Delete(':id')
  async deleteUser(@Param('id', ParseObjectIdPipe) id: string) {
    const response = await firstValueFrom(this.client.send('users.delete', id));
    return response;
  }
}
