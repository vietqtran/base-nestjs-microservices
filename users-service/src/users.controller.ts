import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @MessagePattern('users.get-all')
  async getAllUsers() {
    return this.usersService.findAll();
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
