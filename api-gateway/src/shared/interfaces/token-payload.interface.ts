export interface TokenPayload {
  sub: string;
  username: string;
  email: string;
  roles: string[];
  sessionId: string;
  expiredAt: string;
}
