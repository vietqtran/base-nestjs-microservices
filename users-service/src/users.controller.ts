import {
  ClassSerializerInterceptor,
  Controller,
  UseInterceptors,
} from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { FilterQuery } from 'mongoose';
import { User } from './schemas/user.schema';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @MessagePattern('users.get-all')
  async getAllUsers() {
    return await this.usersService.findAll();
  }

  @MessagePattern('users.get-by-id')
  async getUserById(@Payload() id: string) {
    return await this.usersService.findById(id);
  }

  @MessagePattern('users.get-by-filter')
  async getUserByFilter(@Payload() filter: FilterQuery<User>) {
    return await this.usersService.findByFilter(filter);
  }

  @MessagePattern('users.create')
  async createUser(@Payload() createUserDto: CreateUserDto) {
    return await this.usersService.create(createUserDto);
  }

  @MessagePattern('users.update')
  async updateUser(@Payload() updateUserDto: UpdateUserDto) {
    return await this.usersService.update(updateUserDto);
  }

  @MessagePattern('users.delete')
  async deleteUser(@Payload() id: string) {
    return await this.usersService.delete(id);
  }
}
