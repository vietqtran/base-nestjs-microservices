import { Controller } from '@nestjs/common';
import { IdentityService } from './identity.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { PERMISSIONS } from './constants/permission';
import { CreateRoleDto } from './dtos/create-role.dto';

@Controller('identity')
export class IdentityController {
  constructor(private readonly identityService: IdentityService) {}

  @MessagePattern('identity.get-all-permissions')
  async getAllPermissions() {
    return PERMISSIONS;
  }

  @MessagePattern('identity.create-role')
  async create(@Payload() { createRoleDto }: { createRoleDto: CreateRoleDto }) {
    return await this.identityService.createRole(createRoleDto);
  }

  @MessagePattern('identity.update-role')
  async update(
    @Payload() { userId, roleKeys }: { userId: string; roleKeys: string[] },
  ) {
    return await this.identityService.updateRole(userId, roleKeys);
  }
}
