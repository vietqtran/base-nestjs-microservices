import { Inject } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authService: ClientKafka,
  ) {
    super({
      usernameField: 'email',
    });
  }
  async validate(email: string, password: string) {
    return await firstValueFrom(
      this.authService.send('auth.validate-user', { email, password }),
    );
  }
}
