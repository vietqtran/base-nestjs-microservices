import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { SignInDto } from './dtos/sign-in.dto';
import { SignUpDto } from './dtos/sign-up.dto';
import { ParseObjectIdPipe } from 'src/shared/pipes/object-id.pipe';
import { ValidateDto } from './dtos/validate.dto';
import { Public } from 'src/shared/decorators/public.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CLIENT_KAFKA_OPTIONS } from 'src/constants';
import { RefreshTokenDto } from './dtos/refresh-token.dto';
import JwtRefreshGuard from 'src/shared/guards/jwt-refresh.guard';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';

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
    const response = await firstValueFrom(
      this.client.send('auth.validate-user', { email, password }),
    );
    return response;
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
    const response = await firstValueFrom(
      this.client.send('auth.sign-up', signUpDto),
    );
    return response;
  }

  @Public()
  @UseGuards(JwtRefreshGuard)
  @Post('refresh-token')
  async refreshToken(
    @CurrentUser() payload: any,
    @Body() refreshTokenDto: RefreshTokenDto,
  ) {
    const response = await firstValueFrom(
      this.client.send('auth.refresh-token', {
        userId: payload.userId,
        sessionId: payload.sessionId,
      }),
    );
    return response;
  }

  @Post('session/:id')
  async getSessionById(@Param('id', ParseObjectIdPipe) sessionId: string) {
    const response = await firstValueFrom(
      this.client.send('auth.get-session-by-id', sessionId),
    );
    return response;
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
    const response = await firstValueFrom(
      this.client.send('auth.get-all-user-credentials', {}),
    );
    return response;
  }
}
