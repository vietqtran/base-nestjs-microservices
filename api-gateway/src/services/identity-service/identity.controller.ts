import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { ApiTags } from '@nestjs/swagger';
import { firstValueFrom } from 'rxjs';
import { CLIENT_KAFKA_OPTIONS } from 'src/constants';
import { CreateRoleDto } from './dtos/create-role.dto';
import { UpdateUserRoleDto } from './dtos/update-user-role.dto';
import { ParseObjectIdPipe } from 'src/shared/pipes/object-id.pipe';

@ApiTags('Identity')
@Controller('identity')
export class IdentityController {
  constructor(
    @Inject(CLIENT_KAFKA_OPTIONS.identity.name)
    private readonly identityClient: ClientKafka,
  ) {}

  @Get('permissions')
  async getAllPermissions() {
    return await firstValueFrom(
      this.identityClient.send('identity.get-all-permissions', {}),
    );
  }

  @Post('roles')
  async createRole(@Body() createRoleDto: CreateRoleDto) {
    const [response] = await Promise.all([
      firstValueFrom(
        this.identityClient.send('identity.create-role', createRoleDto),
      ),
    ]);
    return response;
  }

  @Put('roles/:userId')
  async updateRole(
    @Param('userId', ParseObjectIdPipe) userId: string,
    @Body() updateUserRoleDto: UpdateUserRoleDto,
  ) {
    const [response] = await Promise.all([
      firstValueFrom(
        this.identityClient.send('identity.update-role', {
          userId,
          roleKeys: [...updateUserRoleDto.roleKeys],
        }),
      ),
    ]);
    return response;
  }

  async onModuleInit() {
    const topics = [
      'identity.get-all-permissions',
      'identity.create-role',
      'identity.update-role',
    ];

    for (const topic of topics) {
      this.identityClient.subscribeToResponseOf(topic);
      console.log(`Subscribed to topic: ${topic}`);
    }

    await this.identityClient.connect();
    console.log('Connected to Kafka');
  }

  async onModuleDestroy() {
    await this.identityClient.close();
    console.log('Disconnected from Kafka');
  }
}
