import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { SignInDto } from './dtos/sign-in.dto';
import { SignUpDto } from './dtos/sign-up.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern('auth.validate-user')
  async validateUser(@Payload() email: string, @Payload() password: string) {
    return await this.authService.validateUser(email, password);
  }

  @MessagePattern('auth.login')
  async login(@Payload() signInDto: SignInDto) {
    return await this.authService.login(signInDto);
  }

  @MessagePattern('auth.sign-up')
  async signUp(@Payload() signUpDto: SignUpDto) {
    return await this.authService.signUp(signUpDto);
  }

  @MessagePattern('auth.get-session-by-id')
  async getSessionById(@Payload() sessionId: string) {
    return await this.authService.getSessionById(sessionId);
  }
}
