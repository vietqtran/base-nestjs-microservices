import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Role } from './schemas/role.schema';
import { Model } from 'mongoose';
import { CreateRoleDto } from './dtos/create-role.dto';
import { CustomRpcException } from './exceptions/custom-rpc.exception';
import { ClientKafka } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class IdentityService {
  constructor(
    @InjectModel(Role.name) private readonly roleModel: Model<Role>,
    @Inject('USERS_SERVICE') private readonly usersClient: ClientKafka,
  ) {}

  async createRole(createRoleDto: CreateRoleDto) {
    const existedRole = await this.roleModel.findOne({
      $or: [
        { role_key: createRoleDto.role_key },
        { role_name: createRoleDto.role_name },
      ],
    });
    if (existedRole) {
      throw new CustomRpcException('Role existed', 400, {
        field: 'role',
        message: 'existed',
      });
    }
    try {
      const createdRole = await this.roleModel.create(createRoleDto);
      return createdRole.toObject();
    } catch (error) {
      console.error(
        '!!! ERROR: Error at identity.service.createRole - create role',
        error,
      );
      throw new CustomRpcException('Role existed', 400, {
        field: 'system-error',
        message: 'system-error',
      });
    }
  }

  async updateRole(userId: string, roleKeys: string[]) {
    try {
      const [user] = await Promise.all([
        firstValueFrom(
          this.usersClient.send('users.update', {
            id: userId,
            payload: { roles: roleKeys },
          }),
        ),
      ]);
      return user;
    } catch (error) {
      console.error(
        '!!! ERROR: Error at identity.service.updateRole - update role',
        error,
      );
      throw new CustomRpcException('Can not update role.', 400, {
        field: 'system-error',
        message: 'system-error',
      });
    }
  }
}
