import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { SignInDto } from './dtos/sign-in.dto';
import { SignUpDto } from './dtos/sign-up.dto';
import { ParseObjectIdPipe } from 'src/shared/pipes/object-id.pipe';
import { ValidateDto } from './dtos/validate.dto';
import { Public } from 'src/shared/decorators/public.decorator';
import { CLIENT_KAFKA_OPTIONS } from 'src/constants';
import JwtRefreshGuard from 'src/shared/guards/jwt-refresh.guard';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import RequestWithUser from 'src/shared/interfaces/request-with-user.interface';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject(CLIENT_KAFKA_OPTIONS.auth.name)
    private readonly authClient: ClientKafka,
  ) {}

  @Public()
  @Post('validate')
  async validateUser(@Body() validateDto: ValidateDto) {
    const { email, password } = validateDto;
    const response = await firstValueFrom(
      this.authClient.send('auth.validate-user', { email, password }),
    );
    return response;
  }

  @Public()
  @Post('sign-in')
  async login(@Body() signInDto: SignInDto, @Req() request: RequestWithUser) {
    const response = await firstValueFrom(
      this.authClient.send('auth.login', signInDto),
    );
    const { accessToken, refreshToken } = response;
    request.res.setHeader('Set-Cookie', [accessToken, refreshToken]);
    response.accessToken = undefined;
    response.refreshToken = undefined;
    return response;
  }

  @Public()
  @Post('sign-up')
  async signUp(@Body() signUpDto: SignUpDto) {
    const response = await firstValueFrom(
      this.authClient.send('auth.sign-up', signUpDto),
    );
    return response;
  }

  @Public()
  @UseGuards(JwtRefreshGuard)
  @Post('refresh-token')
  async refreshToken(
    @CurrentUser() payload: any,
    @Req() request: RequestWithUser,
  ) {
    const response = await firstValueFrom(
      this.authClient.send('auth.refresh-token', {
        userId: payload.userId,
        sessionId: payload.sessionId,
      }),
    );
    const { accessToken, refreshToken } = response;
    request.res.setHeader('Set-Cookie', [accessToken, refreshToken]);
    response.accessToken = undefined;
    response.refreshToken = undefined;
    return response;
  }

  @Post('session/:id')
  async getSessionById(@Param('id', ParseObjectIdPipe) sessionId: string) {
    const response = await firstValueFrom(
      this.authClient.send('auth.get-session-by-id', sessionId),
    );
    return response;
  }

  @Get('sessions')
  async getAllSessions() {
    const sessions = await firstValueFrom(
      this.authClient.send('auth.get-all-sessions', {}),
    );
    return sessions;
  }

  @Get('user-credentials')
  async getAllUserCredentials() {
    const response = await firstValueFrom(
      this.authClient.send('auth.get-all-user-credentials', {}),
    );
    return response;
  }

  async onModuleInit() {
    const topics = [
      'auth.validate-user',
      'auth.login',
      'auth.sign-up',
      'auth.refresh-token',
      'auth.get-session-by-id',
      'auth.get-all-user-credentials',
      'auth.get-all-sessions',
    ];

    for (const topic of topics) {
      this.authClient.subscribeToResponseOf(topic);
      console.log(`Subscribed to topic: ${topic}`);
    }

    await this.authClient.connect();
    console.log('Connected to Kafka');
  }

  async onModuleDestroy() {
    await this.authClient.close();
    console.log('Disconnected from Kafka');
  }
}
