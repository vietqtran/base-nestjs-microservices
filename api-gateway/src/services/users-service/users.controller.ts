import { 
    Controller, 
    Get, 
    Post, 
    Body, 
    HttpException, 
    HttpStatus 
  } from '@nestjs/common';
  import { ClientKafka } from '@nestjs/microservices';
  import { Inject } from '@nestjs/common';
  import { firstValueFrom } from 'rxjs';
import { CreateUserDto } from 'src/services/users-service/dtos/create-user.dto';
  
  @Controller('users')
  export class UsersController {
    constructor(
      @Inject('USERS_SERVICE') private readonly client: ClientKafka
    ) {}
  
    @Get()
    async getAllUsers() {
      try {
        const users = await firstValueFrom(
          this.client.send('get_all_users', {})
        );
        return users;
      } catch (error) {
        throw new HttpException(
          `Failed to retrieve users: ${error.message}`, 
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      }
    }
  
    @Post()
    async createUser(@Body() createUserDto: CreateUserDto) {
      try {
        const user = await firstValueFrom(
          this.client.send('create_user', createUserDto)
        );
        return user;
      } catch (error) {
        throw new HttpException(
          `Failed to create user: ${error.message}`, 
          HttpStatus.BAD_REQUEST
        );
      }
    }
  
    onModuleInit() {
      const topics = ['get_all_users', 'create_user'];
      topics.forEach(topic => this.client.subscribeToResponseOf(topic));
    }
  }