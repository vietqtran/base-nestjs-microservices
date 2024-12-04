import { Body, Controller, Get, Inject, Param, Post } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { SignInDto } from './dtos/sign-in.dto';
import { SignUpDto } from './dtos/sign-up.dto';
import { ParseObjectIdPipe } from 'src/shared/pipes/object-id.pipe';
import { ValidateDto } from './dtos/validate.dto';
import { Public } from 'src/shared/decorators/public.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CLIENT_KAFKA_OPTIONS } from 'src/constants';

@ApiBearerAuth()
@Controller('auth')
export class AuthController {
  constructor(
    @Inject(CLIENT_KAFKA_OPTIONS.auth.name)
    private readonly client: ClientKafka,
  ) {}

  @Public()
  @Post('validate')
  async validateUser(@Body() validateDto: ValidateDto) {
    const { email, password } = validateDto;
    const user = await firstValueFrom(
      this.client.send('auth.validate-user', { email, password }),
    );
    return user;
  }

  @Public()
  @Post('sign-in')
  async login(@Body() signInDto: SignInDto) {
    const response = await firstValueFrom(
      this.client.send('auth.login', signInDto),
    );
    return response;
  }

  @Public()
  @Post('sign-up')
  async signUp(@Body() signUpDto: SignUpDto) {
    const user = await firstValueFrom(
      this.client.send('auth.sign-up', signUpDto),
    );
    return user;
  }

  @Post('session/:id')
  async getSessionById(@Param('id', ParseObjectIdPipe) sessionId: string) {
    const session = await firstValueFrom(
      this.client.send('auth.get-session-by-id', sessionId),
    );
    return session;
  }

  @Get('sessions')
  async getAllSessions() {
    const sessions = await firstValueFrom(
      this.client.send('auth.get-all-sessions', {}),
    );
    return sessions;
  }

  @Get('user-credentials')
  async getAllUserCredentials() {
    const userCredentials = await firstValueFrom(
      this.client.send('auth.get-all-user-credentials', {}),
    );
    return userCredentials;
  }
}
