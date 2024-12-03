export class SignInDto {
  credentials: {
    email: string;
    password: string;
    is_remember: boolean;
  };
  session: {
    ip: string;
    ua: string;
  };
}
