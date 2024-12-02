import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { CreateUserDto } from './dtos/create-user.dto';
import { User } from './schemas/user.schema';
import { CustomRpcException } from './exceptions/custom-rpc.exception';
import { UpdateUserDto } from './dtos/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async findAll(): Promise<User[]> {
    try {
      return this.userModel.find();
    } catch (error) {
      console.error('!!! ERROR: Error at users.service.findAll');
      throw new CustomRpcException(
        error.message ?? 'Failed to get users',
        400,
        {
          field: 'user',
          message: 'get-users',
        },
      );
    }
  }

  async findById(id: string): Promise<User> {
    try {
      return this.userModel.findById(id);
    } catch (error) {
      console.error('!!! ERROR: Error at users.service.findById');
      throw new CustomRpcException(
        error.message ?? 'Failed to get user',
        400,
        {
          field: 'user',
          message: 'get-user',
        },
      );
    }
  }

  async findByFilter(filter: FilterQuery<User>): Promise<User[]> {
    try {
      return this.userModel.find(filter);
    } catch (error) {
      console.error('!!! ERROR: Error at users.service.findByFilter');
      throw new CustomRpcException(
        error.message ?? 'Failed to get users',
        400,
        {
          field: 'user',
          message: 'get-users',
        },
      );
    }
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existedUser = await this.userModel.findOne({
      $or: [
        { username: createUserDto.username },
        { email: createUserDto.email },
      ],
    });

    if (existedUser) {
      console.error('!!! ERROR: Error at users.service.create - user existed');
      throw new CustomRpcException('User existed', 400, {
        field: 'user',
        message: 'existed',
      });
    }

    const createdUser = await this.userModel.create(createUserDto);

    if (!createdUser) {
      console.error('!!! ERROR: Error at users.service.create - create user');
      throw new CustomRpcException('Failed to create user', 400, {
        field: 'user',
        message: 'create-user',
      });
    }

    return createdUser.toObject();
  }

  async update(updateUserDto: UpdateUserDto) {
    const user = await this.userModel.findById(updateUserDto.id);

    if (!user) {
      console.error(
        '!!! ERROR: Error at users.service.update - user not found',
      );
      throw new CustomRpcException('User not found', 400, {
        field: 'user',
        message: 'not-found',
      });
    }

    const updatedUser = await this.userModel.findByIdAndUpdate(
      updateUserDto.id,
      updateUserDto.payload,
      { new: true },
    );

    if (!updatedUser) {
      console.error('!!! ERROR: Error at users.service.update - update user');
      throw new CustomRpcException('Failed to update user', 400, {
        field: 'user',
        message: 'update-user',
      });
    }

    return updatedUser.toObject();
  }

  async delete(id: string) {
    const user = await this.userModel.findById(id);

    if (!user) {
      console.error(
        '!!! ERROR: Error at users.service.delete - user not found',
      );
      throw new CustomRpcException('User not found', 400, {
        field: 'user',
        message: 'not-found',
      });
    }

    const deletedUser = await this.userModel.findByIdAndDelete(id);

    if (!deletedUser) {
      console.error('!!! ERROR: Error at users.service.delete - delete user');
      throw new CustomRpcException('Failed to delete user', 400, {
        field: 'user',
        message: 'delete-user',
      });
    }

    return deletedUser.toObject();
  }
}
