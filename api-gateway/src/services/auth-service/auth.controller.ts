import { Controller, Inject, Param, Post } from "@nestjs/common";
import { ClientKafka } from "@nestjs/microservices";
import { firstValueFrom } from "rxjs";
import { SignInDto } from "./dtos/sign-in.dto";
import { SignUpDto } from "./dtos/sign-up.dto";
import { ParseObjectIdPipe } from "src/shared/pipes/object-id.pipe";

@Controller('auth')
export class AuthController {
  constructor(@Inject('AUTH_SERVICE') private readonly client: ClientKafka) {}

  @Post('validate')
  async validateUser(email: string, password: string) {
    const user = await firstValueFrom(this.client.send('auth.validate-user', { email, password }));
    return user;
  }

  @Post('sign-in')
  async login(signInDto: SignInDto) {
    const response = await firstValueFrom(this.client.send('auth.login', signInDto));
    return response;
  }

  @Post('sign-up')
  async signUp(signUpDto: SignUpDto) {
    const user = await firstValueFrom(this.client.send('auth.sign-up', signUpDto));
    return user;
  }

  @Post('session/:id')
  async getSessionById(@Param('id', ParseObjectIdPipe) sessionId: string) {
    const session = await firstValueFrom(this.client.send('auth.get-session-by-id', sessionId));
    return session;
  }

  onModuleInit() {
    const topics = [
      'auth.validate-user',
      'auth.login',
      'auth.sign-up',
      'auth.get-session-by-id',
    ];
    topics.forEach((topic) => this.client.subscribeToResponseOf(topic));
  }
}
