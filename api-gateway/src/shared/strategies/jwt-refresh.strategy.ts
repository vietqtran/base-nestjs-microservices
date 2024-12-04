import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { TokenPayload } from '../interfaces/token-payload.interface';
import { firstValueFrom } from 'rxjs';
import { CLIENT_KAFKA_OPTIONS } from 'src/constants';
import { ClientKafka } from '@nestjs/microservices';
import { CustomRpcException } from '../exceptions/custom-rpc.exception';
import * as argon2 from 'argon2';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    private readonly configService: ConfigService,
    @Inject(CLIENT_KAFKA_OPTIONS.users.name)
    private readonly usersClient: ClientKafka,
    @Inject(CLIENT_KAFKA_OPTIONS.auth.name)
    private readonly authClient: ClientKafka,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField('refreshToken'),
      secretOrKey: configService.get<string>('JWT_REFRESH_SECRET'),
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: TokenPayload) {
    const refreshToken = req.body.refreshToken;
    const session = await firstValueFrom(
      this.authClient.send('auth.get-session-by-id', payload.sessionId),
    );
    const user = await firstValueFrom(
      this.usersClient.send('users.get-by-id', payload.sub),
    );
    if (!user || !session) {
      throw new CustomRpcException('Invalid token', 400, {
        field: 'token',
        message: 'invalid',
      });
    }
    const isMatched = await argon2.verify(
      session.hashed_refresh_token,
      refreshToken,
    );
    if (!isMatched) {
      throw new CustomRpcException('Invalid token', 400, {
        field: 'token',
        message: 'not-match',
      });
    }

    return {
      userId: user._id,
      sessionId: session._id,
    };
  }
}
