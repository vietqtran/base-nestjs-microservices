import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { CustomRpcException } from './exceptions/custom-rpc.exception';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @MessagePattern('get_all_users')
  async getAllUsers() {
    return this.usersService.findAll()
  }

  @MessagePattern('create_user')
  async createUser(@Payload() createUserDto: CreateUserDto) {
    try {
      return await this.usersService.create(createUserDto);
    } catch (error) {
      throw new Error(`Failed to create user: ${error.message}`);
    }
  }
}